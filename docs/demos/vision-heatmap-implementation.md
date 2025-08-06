# Vision Heatmap Explorer - Implementation Guide

**Status:** Production-Ready Implementation Guide  
**Timeline:** 2 Tage MVP (Tag 1: 6-8h Core + Tag 2: 4-6h Polish)  
**Business Impact:** AI-powered Quality Control Demo für Manufacturing-Klientel  
**Tech Stack:** TensorFlow.js + Canvas 2D + MobileNet V1

---

## 🎯 **Business Context**

**Problem:** Manufacturing Quality Control ineffizient und fehleranfällig  
**Solution:** AI-powered Heatmap Visualization für Defect Detection  
**Demo Value:** Zeigt AI-Verständlichkeit durch Visual Explanations für Enterprise-Klientel  
**Target:** Automotive/Manufacturing Decision-Makers

---

## 🛠️ **Technical Stack**

```bash
# Dependencies  
npm i @tensorflow/tfjs @tensorflow/tfjs-backend-webgl @tensorflow/tfjs-backend-wasm

# Note: chroma-js wird nicht benötigt (eigene Colormap-Funktionen) – Bundle klein halten

# File Structure
src/app/labs/vision-heatmap/page.tsx
src/app/labs/vision-heatmap/client.tsx
src/components/labs/VisionHeatmapShell.tsx
src/lib/ai/tf-init.ts
src/lib/ai/gradcam.ts
src/lib/ai/labels.ts
src/lib/ai/topk.ts
src/lib/canvas/dpr.ts
src/lib/canvas/overlay.ts
src/lib/canvas/colormap.ts
src/lib/canvas/export.ts
public/imagenet-labels.json
public/tfjs-wasm/*.wasm
```

**Architecture Decisions:**
- ✅ **MobileNet V1 LayersModel** (robust splittable, production-tested)
- ✅ **Canvas 2D mit DPR** für scharfe Overlays
- ✅ **Backend Fallback:** webgl → wasm → graceful error
- ✅ **Memory-Safe Patterns:** tf.tidy/dispose konsequent implementiert
- ✅ **SSR-Safe Architecture:** "use client" + dynamic loading
- ✅ **Client/Server Split:** Alle Hooks/TFJS-Imports ausschließlich in Client-Dateien (Shell/Client), niemals in page.tsx Server Components
- ✅ **CORS-Safe Export:** crossOrigin="anonymous" für PNG-Download
- ✅ **TFJS-Backends Single-Source:** ausschließlich in src/lib/ai/tf-init.ts importiert & konfiguriert; gradcam.ts importiert nur ensureTFReady() – keine Backend-Seiteneffekte in anderen Dateien
- 🚀 **Performance Optimizations:** Model-JSON Preload, Upload-Limit 2048px, COOP/COEP für Threaded-SIMD
- 📊 **Monitoring:** Backend-Badge sichtbar, Time-to-First-CAM Metrik, Memory-Budgets

---

## 🚀 **Funktionsumfang v1**

1. **Bild-Upload** (oder 3–4 Demo-Bilder)
2. **On-device Inference** mit TensorFlow.js (MobileNet V1)
3. **Grad-CAM / Class Activation Map** → Heatmap-Overlay über dem Bild
4. **UI-Regler:** Opazität (0–100%), Blend-Mode (multiply/screen), Top-K Klassenwahl
5. **A11y & DSGVO:** Keine Datenübertragung, vollständige Tastatursteuerung, prefers-reduced-motion respektiert
6. **Export:** PNG-Download des Overlays

---

## 🤖 **AI Core Implementation (ChatGPT Production-Ready)**

### **Grad-CAM System**

```typescript
// lib/ai/gradcam.ts - Production Implementation
import * as tf from '@tensorflow/tfjs';

export type LoadOpts = {
  url?: string;
  preferBackend?: 'webgl' | 'wasm';
};

export type GradCamModels = {
  base: tf.LayersModel;
  convModel: tf.LayersModel;
  headModel: tf.LayersModel;
  lastConvName: string;
  inputSize: number;
  backend: string;
};

import { ensureTFReady } from './tf-init';

const DEFAULT_MOBILENET_V1_URL =
  'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json';

/** Grad-CAM mit korrekter Gradienten-Berechnung */
export async function gradCAM(
  models: GradCamModels,
  input: tf.Tensor4D,
  classIdx?: number
): Promise<tf.Tensor2D> {
  const { convModel, headModel, inputSize } = models;
  const A = tf.tidy(() => convModel.apply(input) as tf.Tensor4D);
  
  // Bestimme Target-Klasse
  let targetIdx = classIdx;
  if (targetIdx == null) {
    const logits = tf.tidy(() => headModel.apply(A) as tf.Tensor2D);
    targetIdx = (await logits.argMax(1).data())[0];
    logits.dispose();
  }

  // KORREKT: ∂Score/∂A mit valueAndGrads auf headModel(A)
  const valueAndGrads = tf.valueAndGrads((Ain: tf.Tensor) => {
    const logits = headModel.apply(Ain) as tf.Tensor2D;
    const score = logits.gather([targetIdx!], 1).sum() as tf.Scalar;
    return score;
  });

  const { value: score, grads } = valueAndGrads(A);
  const gradients = grads as tf.Tensor4D;

  // Global Average Pooling über Gradienten
  const weights = tf.tidy(() => {
    return gradients.mean([1, 2]) as tf.Tensor2D; // [batch, filters] - FIXED: mean([1,2]) liefert Tensor2D
  });

  // Gewichtete Summe: CAM = Σ(weight_i * A_i)
  const cam = tf.tidy(() => {
    const weightsExpanded = weights.reshape([1, 1, 1, -1]); // [batch, 1, 1, filters] - FIXED: reshape statt expandDims
    const weightedMaps = A.mul(weightsExpanded); // [batch, h, w, filters]
    const summed = weightedMaps.sum(3) as tf.Tensor3D; // [batch, h, w]
    return summed.squeeze([0]) as tf.Tensor2D; // [h, w]
  });

  // Cleanup
  A.dispose();
  score.dispose();
  gradients.dispose();
  weights.dispose();

  // ReLU + Normalisierung
  return tf.tidy(() => {
    const reluCAM = cam.relu();
    const min = reluCAM.min();
    const max = reluCAM.max();
    const normalized = reluCAM.sub(min).div(max.sub(min).add(1e-8));
    const resized = tf.image.resizeBilinear(
      normalized.expandDims(2), 
      [inputSize, inputSize], 
      true
    ).squeeze([2]) as tf.Tensor2D;
    
    cam.dispose();
    return resized;
  });
}
```

### **Canvas System (HiDPI + Overlay)**

```typescript
// lib/canvas/overlay.ts - Canvas System with Feature Detection
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  dpr = window.devicePixelRatio || 1
) {
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  
  // Set CSS dimensions for stable layout
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  
  // Use desynchronized without feature detection - browsers ignore unknown options
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) throw new Error('Canvas context not available');
  
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, dpr };
}

/** Precision image alignment with contain/cover modes */
export function getDrawRect(
  imgW: number, 
  imgH: number, 
  canvasW: number, 
  canvasH: number,
  fit: 'contain' | 'cover' = 'contain'
): { x: number; y: number; w: number; h: number } {
  const imgAspect = imgW / imgH;
  const canvasAspect = canvasW / canvasH;
  
  let w: number, h: number;
  if (fit === 'contain') {
    if (imgAspect > canvasAspect) {
      w = canvasW; h = w / imgAspect;
    } else {
      h = canvasH; w = h * imgAspect;
    }
  } else { // cover
    if (imgAspect > canvasAspect) {
      h = canvasH; w = h * imgAspect;
    } else {
      w = canvasW; h = w / imgAspect;
    }
  }
  
  // Bei cover erfolgt das Cropping am Ziel (negatives dx/dy + Canvas-Clipping)
  // Source-Cropping ist nicht nötig; Export übernimmt dieselbe Zielgeometrie
  return {
    x: (canvasW - w) / 2,
    y: (canvasH - h) / 2,
    w: Math.round(w),
    h: Math.round(h)
  };
}
```

### **Labels System**

```typescript
// lib/ai/labels.ts - Labels System
export type LabelList = string[];

export async function loadLabels(url = '/imagenet-labels.json'): Promise<LabelList> {
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load labels from ${url}`);
  const labels = (await res.json()) as string[];
  
  // Validate ImageNet mapping (must match TFJS MobileNet class order)
  if (!Array.isArray(labels) || labels.length !== 1000) {
    throw new Error(`Labels must contain exactly 1000 classes, got ${labels.length}`);
  }
  
  // Smoke test: Verify known class mappings
  const knownMappings = [
    { idx: 0, expected: /tench|Tinca tinca/i },
    { idx: 285, expected: /Egyptian cat|Egyptian/i },
    { idx: 999, expected: /toilet tissue|toilet paper/i }
  ];
  
  for (const { idx, expected } of knownMappings) {
    if (!expected.test(labels[idx])) {
      console.warn(`Potential label mapping issue at index ${idx}: "${labels[idx]}"`);
    }
  }
  
  return labels;
}

/** 0..1 → "92,3 %" (immer mit schmalem NBSP vor %) */
export function formatProb(p: number, digits = 1): string {
  const clamped = Math.max(0, Math.min(1, p));
  return `${(clamped * 100).toFixed(digits).replace('.', ',')}\u00A0%`; // NBSP vor %
}
```

---

## 🛠️ **Vision Heatmap – Aufgabenplan (v1)**

**Ziel:** Heatmap v1 in 2 Tagen sauber liefern (A11y- & Performance-Budget erfüllt), v1.1/v2 optional danach.  
**Hinweis:** [ ] = abhakbare Aufgaben für Claude Code. Stop-Punkte markieren Review-Momente.

---

### **0) Must-Fix Korrekturen der Spec (vor Start)**

- [ ] **Modellkonsistenz:** Überall MobileNet V1 (LayersModel, 1.0/224) benennen (nicht V2) ✅
- [ ] **ImageNet-Labels:** public/imagenet-labels.json (1000 Klassen) hinzufügen; Reihenfolge gegen TFJS MobileNet V1 prüfen (3 Stichproben) ✅  
- [ ] **WASM-Assets:** import '@tensorflow/tfjs-backend-wasm' + tf.setWasmPaths('/tfjs-wasm/') + Assets bereitstellen ✅
  - Dateien: `tfjs-backend-wasm.wasm`, `tfjs-backend-wasm-simd.wasm`, `tfjs-backend-wasm-threaded-simd.wasm` → `/public/tfjs-wasm/`
- [ ] **OffscreenCanvas-Detect:** Feature-Detection einbauen, Fallback auf `<canvas>` ✅
- [ ] **Typografie-Prozent:** formatProb() nutzt schmales NBSP → „92,3\u00A0%" durchgängig ✅

---

### **T0 – Infrastruktur & Routing (~0,5 Tage)**

**Ziel:** Labs-Route existiert, Demo wird lazy geladen (kein TFJS im Initial-Load), WASM-Pfade sind korrekt konfiguriert.

**Dateien:**
- [ ] `app/labs/vision-heatmap/page.tsx`
- [ ] `components/labs/VisionHeatmapShell.tsx`
- [ ] `components/utils/useVisible.ts`
- [ ] `public/tfjs-wasm/` → `tfjs-backend-wasm.wasm`, `tfjs-backend-wasm-simd.wasm`, `tfjs-backend-wasm-threaded-simd.wasm`

**Schritte:**

1. **useVisible-Hook:**
```typescript
// components/utils/useVisible.ts
import { useEffect, useRef, useState } from 'react';

export function useVisible<T extends HTMLElement>() {
  const ref = useRef<T|null>(null);
  const [isVisible, set] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  
  return { ref, isVisible };
}
```

2. **Labs-Seite & Lazy-Import (Server/Client Split):**
```typescript
// app/labs/vision-heatmap/page.tsx (Server Component, keine Hooks)
import dynamic from 'next/dynamic';

const Client = dynamic(() => import('./client'), { ssr: false });

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Vision Heatmap (Grad-CAM)</h1>
      <p className="text-sm text-muted-foreground mb-8">
        100&nbsp;% on-device – no data leaves your browser
      </p>
      <Client />
    </main>
  );
}
```

```typescript
// app/labs/vision-heatmap/client.tsx ("use client")
'use client';
import { useVisible } from '@/components/utils/useVisible';
import dynamic from 'next/dynamic';

const VisionHeatmapShell = dynamic(() => import('@/components/labs/VisionHeatmapShell'), { ssr: false });

export default function Client() {
  const { ref, isVisible } = useVisible<HTMLDivElement>();
  return (
    <div ref={ref} className="min-h-[50vh]">
      {isVisible ? <VisionHeatmapShell /> : <div className="opacity-70">Loading on demand…</div>}
    </div>
  );
}
```

3. **TFJS-Backend Setup (robust):**
   - Assets in `public/tfjs-wasm/` ablegen (drei .wasm-Dateien)
   - TF-Init Modul (kommt in T1):
```typescript
// lib/ai/tf-init.ts (einmalig importieren, wenn die Demo geladen wird)
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs';

tf.setWasmPaths('/tfjs-wasm/'); // public/tfjs-wasm/*.wasm

export async function ensureTFReady(prefer: 'webgl' | 'wasm' = 'webgl'): Promise<string> {
  try {
    await tf.setBackend(prefer);
  } catch {
    /* ignore */
  }
  await tf.ready();
  
  if (prefer === 'webgl' && tf.getBackend() !== 'webgl') {
    try {
      await tf.setBackend('wasm');
      await tf.ready();
    } catch {
      /* ignore */
    }
  }
  
  return tf.getBackend();
}
```

**Tests/Checks:**
- [ ] Page aufrufen → Network-Tab prüfen: 0 @tensorflow/* Requests bis die Demo sichtbar ist
- [ ] WASM-Dateien sind per URL erreichbar (`/tfjs-wasm/tfjs-backend-wasm.wasm` → 200)

**Akzeptanzkriterien:**
- [ ] Init-Budget: 0 @tensorflow/* Requests bis die Demo sichtbar ist (Network-Tab)
- [ ] WASM-Dateien unter `/tfjs-wasm/` werden ausgeliefert

**Fallstricke:**
- Vergiss den Side-Effect-Import nicht (`@tensorflow/tfjs-backend-wasm`), sonst greift setWasmPaths nicht
- Bei GitHub Pages/Netlify ggf. Asset-Pfad (`/tfjs-wasm/`) an Base-Path anpassen

**Claude Code Prompt:**
```
Implementiere T0 des Vision Heatmap Explorers - Infrastruktur & Routing:

AUFGABEN:
1. Erstelle useVisible Hook in src/components/utils/useVisible.ts mit IntersectionObserver (rootMargin: 200px)
2. Erstelle src/app/labs/vision-heatmap/page.tsx als Server Component mit SEO-optimierter Landing Page
3. Erstelle src/app/labs/vision-heatmap/client.tsx mit lazy loading über useVisible Hook
4. Lade TFJS WASM Assets herunter und stelle sie in public/tfjs-wasm/ bereit (3 .wasm Dateien)
5. Erstelle src/lib/ai/tf-init.ts mit Backend-Setup (WebGL → WASM Fallback)

TECHNISCHE REQUIREMENTS:
- Server/Client Split: page.tsx (Server) + client.tsx (Client) getrennt halten
- Zero TFJS im Initial-Load bis Demo im Viewport erscheint
- WASM-Pfade korrekt konfigurieren: tf.setWasmPaths('/tfjs-wasm/')
- Backend-Imports auf module level (nicht in function)

CODE BASIS:
- Verwende die bereitgestellten Code-Snippets aus docs/demos/vision-heatmap-implementation.md, Abschnitt T0
- IntersectionObserver mit 200px rootMargin für frühen Load
- Dynamic imports für alle TensorFlow.js Dependencies

VALIDIERUNG:
- Network-Tab: Keine @tensorflow/* Requests bis Demo sichtbar
- URL-Test: /tfjs-wasm/tfjs-backend-wasm.wasm gibt 200 zurück
- Console: ensureTFReady() loggt aktives Backend

INTEGRATION:
- Folge Next.js 15 App Router Conventions
- Verwende bestehende Tailwind Classes und Container-Struktur
- SEO: Titel "Vision Heatmap (Grad-CAM)" + Privacy-Beschreibung
```

---

### **T1 – Modell & Labels (~0,5 Tage)**

**Ziel:** MobileNet V1 (LayersModel, 1.0/224) laden, sauber splitten; ImageNet-Labels verfügbar; Warmup.

**Dateien:**
- [ ] `src/lib/ai/gradcam.ts` (Import/Init + Split)
- [ ] `src/lib/ai/labels.ts`, `src/lib/ai/topk.ts`
- [ ] `public/imagenet-labels.json` (1000 Strings)

**Schritte:**

1. **Labels hinzufügen:** `public/imagenet-labels.json` mit 1000 Klassen (ImageNet-1k)

2. **Ensure TF Ready + Split laden:** In gradcam.ts:
   - `ensureTFReady('webgl' | 'wasm')` aufrufen
   - `loadSplitModel()` → base, convModel, headModel, inputSize, lastConvName
   - Warmup einmalig nach Modell-Load

**Tests/Checks:**
- [ ] Label-Smoke-Test: Beim Laden 0 / 285 / 999 loggen (Tench / Egyptian cat / Toilet tissue)
- [ ] Warmup: < 500 ms auf M-Chip

**Akzeptanzkriterien:**
- [ ] lastConvName geloggt; inputSize = 224  
- [ ] Labels laden ohne Fehler; Top-K funktioniert
- [ ] Label-Smoke-Test: Index 0, 285, 999 → plausible Mappings

**Fallstricke:**
- Verwechsle GraphModel und LayersModel nicht – wir brauchen LayersModel zum Splitten

**Claude Code Prompt:**
```
Implementiere T1 des Vision Heatmap Explorers - Modell & Labels:

AUFGABEN:
1. Erstelle public/imagenet-labels.json mit 1000 ImageNet-1k Klassennamen (keine Übersetzung; Reihenfolge muss exakt dem TFJS MobileNet V1-Mapping entsprechen)
2. Erweitere src/lib/ai/gradcam.ts um loadSplitModel() Funktion
3. Implementiere src/lib/ai/labels.ts mit loadLabels() und formatProb() Funktionen
4. Erstelle src/lib/ai/topk.ts für Top-K Klassifikation
5. Integriere ensureTFReady() aus T0 und teste Backend-Fallback

TECHNISCHE REQUIREMENTS:
- MobileNet V1 LayersModel (1.0/224) von offizieller URL laden
- Model splitting: base → convModel (bis letzte Conv) + headModel (Classification Head)
- lastConvName automatisch detektieren (typisch: "conv_pw_13_relu")
- Warmup einmalig nach Modell-Load für Performance

CODE BASIS:
- Verwende GradCamModels Type aus gradcam.ts Code-Snippet
- URL: https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json
- Label-Validation mit Smoke-Test für bekannte Mappings (Index 0, 285, 999)

VALIDIERUNG:
- Console-Log: lastConvName gefunden, inputSize = 224
- Label-Test: Index 0 ≈ "tench", Index 285 ≈ "Egyptian cat", Index 999 ≈ "toilet tissue"
- Warmup-Performance: < 500ms auf M-Chip
- Dispose-Hygiene: Kein Memory-Leak bei Model-Load

INTEGRATION:
- Error Handling für Model-Load und Label-Load Failures
- German formatProb(): "92,3\u00A0%" mit schmalem NBSP
- Cache-Header für Labels: { cache: 'force-cache' }
- Kompatibilität mit TFJS Backend aus T0
```

---

### **T2 – Grad-CAM Core (∂Score/∂A) (~0,5–1 Tag)**

**Ziel:** Korrekte Grad-CAM: ∂Score/∂A (A = letzte Conv-Aktivierung), ReLU → Min-Max → bilinear Upscale, Dispose-sicher.

**Dateien:**
- [ ] `src/lib/ai/gradcam.ts` (vollständig einfügen)

**Schritte:**

1. **gradCAM(models, input, classIdx?) verwenden:**
   - A = convModel(input)
   - valueAndGrads(a => headModel(a).gather([classIdx],1).sum())(A)
   - weights = mean(grads, [1,2])
   - cam = relu(sum(A * weights, -1)) → min-max → resizeBilinear auf inputSize

2. **Dispose-Hygiene:** tf.tidy/dispose an allen Hot-Paths (A, grads, weights)

**Tests/Checks:**
- [ ] 10× nacheinander CAM berechnen (gleiches Bild) → Heap stabil, kein Growth
- [ ] Visuelle Plausibilität: Heatmap reagiert, wenn Klasse gewechselt wird

**Akzeptanzkriterien:**
- [ ] `cam.shape = [H,W]` (H=W=224), Werte ∈ [0,1]
- [ ] Kein Memory-Leak erkennbar

**Fallstricke:**
- Nicht dataSync() im Renderpfad nutzen (blockiert UI). Immer .data() (async)

**Claude Code Prompt:**
```
Implementiere T2 des Vision Heatmap Explorers - Grad-CAM Core:

AUFGABEN:
1. Implementiere gradCAM() Funktion in src/lib/ai/gradcam.ts (bereits vorhanden - verwenden und testen)
2. Integriere korrekte Gradienten-Berechnung: ∂Score/∂A mit tf.valueAndGrads()
3. Implementiere ReLU + Min-Max Normalisierung + bilinear Upscale
4. Sicherstelle tf.tidy/dispose Hygiene an allen kritischen Stellen
5. Teste Memory-Safety mit wiederholten CAM-Berechnungen

KRITISCHE FIXES (bereits angewendet):
- weights = gradients.mean([1, 2]) → Tensor2D (nicht Tensor3D)
- weightsExpanded = weights.reshape([1, 1, 1, -1]) → korrektes Broadcasting
- Alle Intermediate-Tensors ordnungsgemäß disposed

TECHNISCHE IMPLEMENTATION:
- A = convModel.apply(input) → letzte Conv-Aktivierung
- valueAndGrads((Ain) => headModel.apply(Ain).gather([classIdx], 1).sum())(A)
- Gewichtete Summe: CAM = Σ(weight_i * A_i) über Channels
- ReLU(CAM) → Min-Max → resizeBilinear auf inputSize

CODE BASIS:
- Verwende die vollständige gradCAM() Implementation aus gradcam.ts Code-Snippet
- Alle Must-Fix Korrekturen sind bereits integriert
- tf.tidy() wrapper um alle Hot-Path Operationen

VALIDIERUNG:
- Memory-Test: 10× wiederholte CAM-Berechnung → stabiler Heap
- Shape-Test: cam.shape = [224, 224], Werte ∈ [0, 1]
- Visual-Test: Heatmap reagiert plausibel auf Klassenwechsel
- Performance: CAM-Berechnung < 200ms auf WebGL

INTEGRATION:
- Async Pattern: .data() statt .dataSync() für UI-Thread
- Error Handling: Graceful degradation bei Backend-Failures
- Target Class Detection: Auto-select höchste Confidence Klasse
- Memory Monitoring: Console-Warnings bei Memory-Leaks
```

---

### **T3 – Canvas-System & Overlay (~0,5 Tage)**

**Ziel:** Retina-scharfes Overlay, pixelgenaues Align (contain/cover), Blend-Modes, Resize/DPR-Change robust.

**Dateien:**
- [ ] `src/lib/canvas/dpr.ts` (setupHiDPICanvas, getDrawRect)
- [ ] `src/lib/canvas/colormap.ts` (viridisRGB)
- [ ] `src/lib/canvas/overlay.ts` (camToImageData, drawOverlayImageData)
- [ ] `components/labs/HeatmapOverlayCanvas.tsx` (Dual-Canvas)

**Schritte:**

1. **Dual-Canvas implementieren** (Base unten, Overlay oben)
2. **getDrawRect(imgW,imgH,viewW,viewH,mode)** für contain/cover
3. **camToImageData(cam, dw, dh, alpha)** + **drawOverlayImageData(...)**
4. **DPR-Änderungen & Resize** abfangen (rAF-debounced)

**Tests/Checks:**
- [ ] Querformat/Hochformat: Overlay deckt exakt (kein 1-px-Ghosting)
- [ ] Retina: messerscharf; Zoom (80–125%) bleibt korrekt

**Akzeptanzkriterien:**
- [ ] Keine Offsets; Overlay entspricht 1:1 dem Bildbereich
- [ ] Kein Layout-Shift

**Fallstricke:**
- Export & cover: wir croppen bewusst am Ziel (negatives dx/dy + Canvas-Clipping), nicht an der Quelle – Export nutzt die Zielgeometrie

**Claude Code Prompt:**
```
Implementiere T3 des Vision Heatmap Explorers - Canvas-System & Overlay:

AUFGABEN:
1. Erweitere src/lib/canvas/overlay.ts um setupHiDPICanvas() (bereits vorhanden - verwenden)
2. Implementiere src/lib/canvas/colormap.ts mit viridis Colormap für Heatmap-Rendering
3. Erstelle camToImageData() für CAM → ImageData Konversion mit Alpha-Blending
4. Implementiere HeatmapOverlayCanvas.tsx mit Dual-Canvas System (Base + Overlay)
5. Integriere getDrawRect() für präzises contain/cover Alignment

TECHNISCHE REQUIREMENTS:
- HiDPI/Retina Support: canvas.width/height vs style.width/height
- Dual-Canvas: Base-Canvas (Bild) unten, Overlay-Canvas (Heatmap) oben
- Blend-Modes: source-over, multiply, screen für verschiedene Visualisierungen
- Responsive Resize: rAF-debounced für DPR-Änderungen

KRITISCHE FIXES (bereits angewendet):
- setupHiDPICanvas setzt CSS-Dimensionen: style.width/height für stable Layout
- getDrawRect() handle contain/cover Modi korrekt
- Desynchronized Canvas Context für bessere Performance

CODE BASIS:
- Verwende setupHiDPICanvas() und getDrawRect() aus overlay.ts Code-Snippets
- Viridis Colormap: [0,0,0.5] → [1,1,0] für wissenschaftliche Heatmaps
- ImageData Buffer-Manipulation für Alpha-Blending mit Bild

VALIDIERUNG:
- Pixel-Perfect: Overlay deckt exakt das Bildgebiet ab (kein 1px Offset)
- Retina-Test: Messerscharf bei verschiedenen DPR-Werten (1.0, 1.5, 2.0)
- Resize-Test: Layout-Shift-frei bei Viewport-Änderungen
- Blend-Test: Verschiedene Blend-Modi funktionieren visuell

INTEGRATION:
- React useCallback für Canvas Refs und Event Handlers
- useEffect für Resize Observer und DPR-Änderungen
- Error Boundaries für Canvas-Context Failures
- Performance: Nur bei tatsächlichen Änderungen neu rendern
```

---

### **T4 – UI/UX & A11y (~0,5 Tage)**

**Ziel:** Bedienbar per Tastatur; klare Controls; permanente Datenschutz-Kennzeichnung.

**Dateien:**
- [ ] In VisionHeatmapShell.tsx Controls/Panel hinzufügen
- [ ] `components/labs/TopKPanel.tsx`

**Schritte:**

1. **Controls:** Opacity Slider, Blend-Mode Select (source-over, multiply, screen), Contain/Cover Toggle
2. **Top-K Panel** an logits anbinden; Klick/Enter/Space setzt Klasse → neue CAM
3. **Badge (statisch, a11y-lesbar):** „100% on-device – no data leaves your browser" 
   **WICHTIG:** Kein aria-live verwenden - Badge ist statisch und soll nicht wiederholt announced werden
4. **Fokus-Ringe sichtbar;** sinnvolle aria-labels; aria-describedby für Canvas

**Tests/Checks:**
- [ ] Nur mit Tastatur nutzbar (Tab/Pfeile/Enter/Space)
- [ ] Kontrast ≥ 4.5:1 (Dark Theme + Controls)

**Akzeptanzkriterien:**
- [ ] Lighthouse A11y = 100
- [ ] Badge im DOM vorhanden (nicht nur visuell)

**Fallstricke:**
- Deutsch/Englisch mischen vermeiden (einheitliche UI-Sprache definieren)

**Claude Code Prompt:**
```
Implementiere T4 des Vision Heatmap Explorers - UI/UX & A11y:

AUFGABEN:
1. Erweitere VisionHeatmapShell.tsx um vollständige Control-Panel Implementation
2. Implementiere components/labs/TopKPanel.tsx für Klassifikations-Ergebnisse
3. Integriere Accessibility: Keyboard Navigation, ARIA Labels, Focus Management  
4. Implementiere Opacity Slider, Blend-Mode Select, Contain/Cover Toggle
5. Erstelle statischen Privacy Badge (OHNE aria-live)

UI CONTROLS:
- Opacity Slider: 0-100% mit Live-Preview und Tastatur-Steuerung
- Blend-Mode Select: source-over, multiply, screen mit visuellen Previews
- Contain/Cover Toggle: Button-Group für Fit-Modi
- Top-K Panel: Clickable Classification Results mit Confidence-Anzeige

A11Y REQUIREMENTS (KRITISCH):
- Vollständige Tastatur-Navigation: Tab, Arrow Keys, Enter, Space
- aria-labels für alle interaktiven Elemente
- aria-describedby für Canvas mit Live-Beschreibung des aktuellen Zustands
- Focus-Visible Ring mit 4.5:1 Kontrast-Ratio
- Privacy Badge: Statisch ohne aria-live (bereits dokumentiert)

TECHNISCHE IMPLEMENTATION:
- Controlled Components mit React State für alle Controls
- Debounced Updates für Performance (200ms für Opacity)
- onKeyDown Handler für Space/Enter bei Custom Controls
- Focus-Trap während Modal-artigen Interaktionen

CODE BASIS:
- shadcn/ui Components: Slider, Select, Button, Badge
- Tailwind Classes für Konsistenz mit Portfolio-Design
- German UI-Sprache durchgängig (formatProb bereits implementiert)

VALIDIERUNG:
- Lighthouse A11y Score: 100/100
- Tab-Only Navigation: Alle Features erreichbar ohne Maus
- Screen Reader: VoiceOver/NVDA vollständig kompatibel
- Kontrast: WCAG 2.1 AA Standard (4.5:1 minimum)

INTEGRATION:
- Event Callbacks: onOpacityChange, onBlendModeChange, onClassSelect
- State Management: Sync mit Parent Component für CAM Re-computation
- Error States: Graceful Handling wenn AI-Models nicht laden
- Loading States: Spinner/Skeleton während CAM-Berechnung
```

---

### **T5 – Export & CORS (~0,25–0,5 Tage)**

**Ziel:** PNG-Export des Composites (Base+Overlay) in < 2 s; CORS-Fehler abgefangen.

**Dateien:**
- [ ] `src/lib/canvas/export.ts` (exportCompositePNG(base, overlay))

**Schritte:**

1. **Composite auf temporären Canvas** zeichnen → `toDataURL('image/png')`
2. **CORS-Guard:** Bei externen Bildern ohne CORS kann toDataURL failen → Button disabled + Hinweis anzeigen
3. **Detection:** Try/Catch um toDataURL(); SecurityError → CORS-Warnung

**Tests/Checks:**
- [ ] Export eines lokalen Sample-Bilds (unter `/public/samples/...`) → Datei identisch zur Preview
- [ ] Externes Bild ohne CORS → Hinweis erscheint, kein Crash

**Akzeptanzkriterien:**
- [ ] Export: Lokales Sample → PNG < 2 s, 1:1 zum Composite; Extern ohne CORS → Button disabled + Hinweis
- [ ] CORS-Fehler eindeutig kommuniziert

**Fallstricke:**
- Safari kann OffscreenCanvas im Export zickig handhaben → Fallback auf DOM-Canvas verwendet

**Claude Code Prompt:**
```
Implementiere T5 des Vision Heatmap Explorers - Export & CORS:

AUFGABEN:
1. Erstelle src/lib/canvas/export.ts mit exportCompositePNG() Funktion
2. Implementiere Canvas-Composite: Base-Image + Heatmap-Overlay auf temp Canvas
3. Integriere CORS-Detection und graceful Error Handling
4. Erstelle Download-Button mit Progress-Feedback und Error-States
5. Implementiere Export-Filename mit Timestamp und Class-Name

TECHNISCHE IMPLEMENTATION:
- Temporärer Canvas für Composite-Rendering (same size as display)
- ctx.drawImage() für Base + Overlay mit korrekten Transform-Matrizen
- toDataURL('image/png') mit CORS-Error Catching
- Blob-Download mit createObjectURL für bessere Memory-Efficiency

CORS HANDLING (KRITISCH):
- crossOrigin="anonymous" für alle externe Bilder
- Try/Catch um toDataURL() → SecurityError detection
- UI-Feedback: Button disabled + Warning-Toast bei CORS-Failure
- Fallback: Export nur Heatmap-Overlay als Alternative

EXPORT FEATURES:
- Filename: "heatmap_[className]_[timestamp].png"
- Same resolution as display (nicht upscaled)
- Preserve Alpha-Channel für wissenschaftliche Nutzung
- Progress-Indication während Export-Vorgang

CODE BASIS:
- Verwende bestehende getDrawRect() für korrektes Alignment  
- Integration mit Canvas-System aus T3
- Error-Handling konsistent mit Rest der App

VALIDIERUNG:
- Local-Image Export: Identisch zur Canvas-Preview
- External-Image ohne CORS: Warning-Message, kein Crash
- Export-Performance: < 2 Sekunden für 1920x1080 Canvas
- File-Size: Reasonable PNG Compression für Web-Usage

INTEGRATION:
- Export-Button in Control-Panel (T4)
- Loading-State während Export-Process
- Success/Error Toasts mit deutscher Sprache
- Keyboard-Support: Enter/Space für Export-Trigger
- A11y: aria-label mit aktuellem Export-Status
```

---

### **T6 – Performance & QA (~0,5 Tage)**

**Ziel:** Smooth UX, keine Leaks, Budgets eingehalten.

**Schritte:**

1. **Budgets prüfen:** Initial-JS ≤ 100 kB (TFJS on-demand), LCP ≤ 1,2 s
2. **Async Pfade:** .data() statt .dataSync(); optional Chunking beim CAM→ImageData (z.B. jede 10. Spalte await Promise.resolve())
3. **Warmup** nach Model-Load; Backend-Badge anzeigen (webgl / wasm)
4. **Memory-Test:** 10 CAM-Runs hintereinander → Heap Snapshot vergleichen (kein Trend)
5. **Lighthouse:** Perf ≥ 90 (Desktop), A11y 100

**Akzeptanzkriterien:**
- [ ] FPS 55–60 (M-Chip), ≥ 30 (Mittelklasse Windows)
- [ ] Kein wachsender Heap, keine gelben Long-Tasks im Performance-Panel
- [ ] TTFC (Time-to-First-CAM): WebGL ≤ 1,0 s, WASM ≤ 2,0 s (M-Chip)

**Fallstricke:**
- Große Bilder (4000+ px Kantenlänge) → vorverkleinern (max 2048 px lange Kante) für stabilen Speicher

**Claude Code Prompt:**
```
Implementiere T6 des Vision Heatmap Explorers - Performance & QA:

AUFGABEN:
1. Implementiere Performance-Budget Monitoring und Validation
2. Optimiere Async-Pfade: CAM→ImageData mit optional Chunking
3. Integriere Memory-Monitoring mit Heap-Snapshot Vergleichen
4. Implementiere Backend-Badge UI für aktives TensorFlow.js Backend
5. Führe kompletten Lighthouse- und Cross-Browser-QA durch

PERFORMANCE OPTIMIERUNG:
- Async CAM→ImageData: Promise.resolve() alle 10 Spalten für UI-Thread
- Image Preprocessing: Auto-resize auf max 2048px lange Kante
- Memory-Budgets: tf.memory().numTensors tracking mit Warnings
- RequestIdleCallback für non-critical Updates

MONITORING IMPLEMENTATION:
- Performance Observer für Long-Tasks (>50ms)
- Memory-Test Suite: 10× CAM-Runs mit Heap-Delta Measurement
- FPS Monitoring mit requestAnimationFrame während CAM-Updates
- Bundle-Size Tracking: Initial-JS ≤ 100kB (ohne TFJS)

BACKEND-ANZEIGE:
- UI-Badge zeigt aktives Backend: "WebGL" / "WASM" / "CPU"
- Performance-Hints basierend auf Backend: WebGL-Optimierungen vs WASM-Fallback
- Backend-Switch UI für Debug/Development
- Error-Recovery bei Backend-Failures

QA VALIDATION:
- Lighthouse: Performance ≥90, A11y 100, Best Practices ≥90
- Core Web Vitals: LCP <1.2s, FID <100ms, CLS <0.1
- Cross-Browser: Chrome/Safari/Firefox Funktionalität 100%
- Memory-Leak-Test: 10 CAM-Runs → stable heap, kein wachsender Trend

TECHNISCHE IMPLEMENTATION:
- Warmup-Strategy: Dummy-Inference nach Model-Load für optimale Performance
- Error-Boundaries: Graceful Degradation bei TFJS/Canvas Failures
- Loading-States: Skeleton UI während Model/Image Loading
- Performance-Profiling: Built-in Dev-Tools für Bottleneck-Identification

VALIDIERUNG:
- M1/M2 Mac: 55-60 FPS konstant, <500ms CAM-Berechnung
- Windows Mittelklasse: ≥30 FPS, <1000ms CAM-Berechnung
- Mobile/Tablet: Graceful Degradation, WASM-Backend funktional
- Memory: <200MB Heap-Usage, keine Long-Tasks >100ms

INTEGRATION:
- Performance-Metriken in Developer Console
- User-Feedback für Performance-Issues
- Automatic Backend-Selection basierend auf Device-Capabilities
- Progressive Enhancement: Core-Features auch ohne High-End Hardware
```

---

### **T7 – Doku & Labs-Kachel (~0,25 Tage)**

**Ziel:** Knackige Doku; Demo leicht auffindbar.

**Schritte:**

1. **README-Abschnitt:**
   - Was ist Grad-CAM? (2 Sätze, laienverständlich)
   - On-device Verarbeitung (Datenschutz)
   - Limits (CORS beim Export, Browser-Kompatibilität)
   - GIF/WebM (≤ 2 MB) der Demo in Aktion

2. **Labs-Kachel:** Titel · Kurz-Nutzen · Tech-Stack · Link

**Akzeptanzkriterien:**
- [ ] Repo erklärt Install → Öffnen → Bild → Heatmap → Export ohne Rückfragen
- [ ] Labs-Seite verlinkt die Demo sichtbar

**Claude Code Prompt:**
```
Implementiere T7 des Vision Heatmap Explorers - Doku & Labs-Kachel:

AUFGABEN:
1. Erstelle README-Abschnitt für Vision Heatmap Explorer mit Business-Fokus
2. Implementiere Labs-Showcase Kachel in der Haupt-Labs Seite
3. Erstelle Demo-Video/GIF (≤2MB) für visuellen Impact
4. Dokumentiere Installation, Usage und Troubleshooting
5. Integriere SEO-Meta-Tags und Open Graph für Social Sharing

README CONTENT:
- Business-Nutzen: "AI-powered Quality Control für Manufacturing"
- Laien-Erklärung: "Grad-CAM macht AI-Entscheidungen visuell verständlich"
- Technical Highlights: "100% on-device, WebGL/WASM, TensorFlow.js"
- Quick-Start: "3 Clicks von Upload zu Heatmap"
- Performance-Claims: "Sub-second inference, retina-sharp overlays"

LABS-KACHEL DESIGN:
- Hero-Image: Screenshot vom Heatmap-Overlay (automotive Bauteil bevorzugt)
- Title: "Vision Heatmap Explorer"
- Subtitle: "AI-Erkennungen visuell verstehen"
- Tech-Stack-Badge: "TensorFlow.js • Canvas 2D • WebGL"
- CTA: "Demo starten" mit Pfeil-Icon
- Business-Badge: "Manufacturing Quality Control"

DEMO-DOCUMENTATION:
- Video/GIF: Upload → Classification → Heatmap → Export (15-30 Sekunden)
- Use-Cases: Automotive, Electronics, Medical Imaging
- Browser-Support: Chrome 90+, Safari 14+, Firefox 88+
- Performance-Expectations je nach Hardware
- Limitations: CORS für externe Bilder, WASM-Fallback für ältere Hardware

SEO OPTIMIZATION:
- Meta-Title: "Vision Heatmap Explorer - AI Quality Control Demo"
- Meta-Description: "Visualisiere AI-Entscheidungen mit Grad-CAM. On-device Bildanalyse für Manufacturing Quality Control. TensorFlow.js powered."
- Open Graph: Social Media Preview mit Demo-Screenshot
- JSON-LD: Strukturierte Daten für Software-Anwendung

TECHNISCHE INTEGRATION:
- Update src/app/labs/page.tsx mit neuer Demo-Kachel
- Navigation: Breadcrumb-Support für /labs/vision-heatmap
- Analytics: Track Demo-Engagement und Conversion-Funnel
- A11y: Alt-Tags für alle Demo-Images, ARIA-Labels für Interactive Elements

VALIDATION:
- README ist selbsterklärend ohne technisches Vorwissen
- Demo-Video lädt schnell (<2MB) und zeigt klaren Mehrwert
- Labs-Kachel ist visuell ansprechend und clickable
- SEO-Meta-Tags validiert mit Google Rich Results Test

CONTENT-STRATEGIE:
- Automotive-Fokus: Beispiele mit KFZ-Teilen und Qualitätskontrolle
- German/English: README auf English, UI-Labels auf Deutsch
- Professional Tone: Enterprise-Kunden ansprechen
- Technical Credibility: Benchmarks und Performance-Claims untermauern
```

---

## **Abhängigkeiten & Reihenfolge**

- **Reihenfolge:** T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7
- **Blocker:** T2 (Grad-CAM korrekt) & T3 (Overlay exakt) sind harte Gatekeeper
- **Stop-Punkte:** Nach T1/T2 und T3 bitte kurz reviewen (visuell/technisch)

---

## **Rollback & Risiken**

- **WASM-Path nicht gefunden** → tf.setWasmPaths('/tfjs-wasm/') früh setzen; Preview testen
- **Safari OffscreenCanvas** → Fallback `<canvas>` aktiv
- **Falsche Label-Zuordnung** → Beim Laden 3 Zufallsindizes loggen & prüfen  
- **UI-Jank** → Async APIs + optionales Chunking beim CAM→ImageData

---

## **Definition of Done (v1)**

**Funktional:**
- [ ] Bild laden → Top-K anzeigen → Klasse wählen → Heatmap Overlay erscheint → PNG exportierbar

**Qualität:**
- [ ] Lighthouse: Perf ≥ 90, A11y 100
- [ ] Kein Memory-Leak nach 10 CAM-Runs
- [ ] FPS-Ziele erfüllt

**Technik:**
- [ ] MobileNet V1 (LayersModel), sauber gesplittet; WASM Fallback konfiguriert; Dispose-Hygiene ok

**A11y:**
- [ ] Tastaturbedienbar, Fokus-Ringe, aria-describedby am Canvas; Privacy-Badge permanent im DOM (OHNE aria-live)

---

## **Commit-Format (optional, konsistent)**

- `feat(labs/vision-heatmap): add lazy route & shell`
- `feat(ai/gradcam): split mobilenet v1 + correct ∂Score/∂A`
- `feat(canvas): hidpi + overlay + colormap`
- `feat(labs/vision-heatmap): controls + top-k + a11y`
- `feat(export): composite png + cors guard`
- `chore(docs): readme section + labs tile`
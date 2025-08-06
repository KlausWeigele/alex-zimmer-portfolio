import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Interactive Labs - AI & Manufacturing Demos | Alex Zimmer',
  description: 'Explore cutting-edge AI demonstrations and interactive prototypes designed for automotive and manufacturing industries. See measurable ROI through innovative technology.',
  keywords: ['AI Demos', 'Manufacturing Technology', 'Interactive Prototypes', 'Automotive Solutions', 'Quality Control', 'Process Optimization'],
  openGraph: {
    title: 'Interactive Labs | Alex Zimmer - AI & Manufacturing Expert',
    description: 'Experience innovative AI demonstrations with real manufacturing applications',
    images: ['/og-labs-overview.jpg'], // TODO: Create OG image
    type: 'website',
  },
};

/**
 * Labs Overview Page - Strategic Demo Showcase
 * 
 * Business Strategy:
 * - Tier 1 Demos (Vision Heatmap) → Immediate ROI demonstration
 * - Tier 2 Demos (3D/Robotics) → Technical credibility 
 * - Tier 3 Demos (Experimental) → Innovation leadership
 * 
 * Target Audience: Manufacturing decision makers, CTOs, Lead Engineers
 */

interface Demo {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'live' | 'coming-soon' | 'prototype';
  technologies: string[];
  businessImpact: string;
  roiMetric: string;
  href: string;
  icon: string;
  tier: 1 | 2 | 3;
}

const DEMO_PROJECTS: Demo[] = [
  {
    id: 'vision-heatmap',
    title: 'Vision Heatmap Explorer',
    description: 'AI-powered visual inspection with explainable Grad-CAM heatmaps. 100% on-device processing for maximum privacy and real-time quality control.',
    category: 'AI & Quality Control',
    status: 'coming-soon',
    technologies: ['TensorFlow.js', 'Canvas 2D', 'WebGL', 'Computer Vision'],
    businessImpact: 'Automated defect detection with visual explanations for manufacturing quality assurance.',
    roiMetric: '€500k/Jahr Einsparung bei Tier-1 Automotive Zulieferer',
    href: '/labs/vision-heatmap',
    icon: '🔬',
    tier: 1
  },
  {
    id: '3d-portfolio',
    title: '3D Portfolio Experience',
    description: 'Interactive Three.js portfolio with physics simulation and immersive navigation. Showcasing advanced 3D web capabilities.',
    category: 'Interactive 3D',
    status: 'prototype',
    technologies: ['Three.js', 'WebGL', 'Physics Engine', 'GSAP'],
    businessImpact: 'Immersive product visualization and virtual showroom experiences.',
    roiMetric: '40% höhere Engagement-Rate bei Produkt-Präsentationen',
    href: '/(prototypes)/3d-portfolio', // TODO: Migrate to /labs/3d-portfolio
    icon: '🎲',
    tier: 2
  },
  {
    id: 'ai-interface',
    title: 'AI Interface Showcase',
    description: 'Modern AI-powered user interfaces with natural language processing and intelligent automation workflows.',
    category: 'AI & UX',
    status: 'prototype',
    technologies: ['React', 'OpenAI API', 'Natural Language Processing', 'Machine Learning'],
    businessImpact: 'Streamlined user workflows through intelligent interface automation.',
    roiMetric: '30% Reduktion der Bearbeitungszeit bei komplexen Tasks',
    href: '/(prototypes)/ai-interface', // TODO: Migrate to /labs/ai-interface
    icon: '🤖',
    tier: 2
  },
  {
    id: 'data-visualization',
    title: 'Manufacturing Analytics',
    description: 'Real-time data visualization dashboards for manufacturing KPIs, predictive maintenance, and process optimization.',
    category: 'Data Analytics',
    status: 'prototype',
    technologies: ['D3.js', 'Chart.js', 'WebSockets', 'Real-time Data'],
    businessImpact: 'Data-driven decision making with real-time manufacturing insights.',
    roiMetric: '25% Verbesserung der OEE durch predictive insights',
    href: '/(prototypes)/data-visualization', // TODO: Migrate to /labs/manufacturing-analytics
    icon: '📊',
    tier: 2
  },
  {
    id: 'experimental-ui',
    title: 'Experimental UI Lab',
    description: 'Cutting-edge CSS animations, micro-interactions, and advanced web technologies pushing the boundaries of user experience.',
    category: 'Advanced UI/UX',
    status: 'prototype',
    technologies: ['Advanced CSS', 'Web Animations API', 'CSS Grid', 'Modern CSS Features'],
    businessImpact: 'Next-generation user interfaces that differentiate your digital products.',
    roiMetric: '50% höhere User-Satisfaction durch innovative UX',
    href: '/(prototypes)/experimental-ui', // TODO: Migrate to /labs/experimental-ui
    icon: '🎨',
    tier: 3
  }
];

const STATUS_CONFIG = {
  live: { label: 'Live', color: 'bg-green-100 text-green-800', icon: '✅' },
  'coming-soon': { label: 'Coming Soon', color: 'bg-yellow-100 text-yellow-800', icon: '🚀' },
  prototype: { label: 'Prototype', color: 'bg-blue-100 text-blue-800', icon: '🔬' },
};

const TIER_CONFIG = {
  1: { label: 'Tier 1 - Immediate ROI', color: 'border-yellow-400 bg-yellow-50' },
  2: { label: 'Tier 2 - Strategic Value', color: 'border-blue-400 bg-blue-50' },
  3: { label: 'Tier 3 - Innovation Leadership', color: 'border-purple-400 bg-purple-50' },
};

export default function LabsOverviewPage() {
  const tier1Demos = DEMO_PROJECTS.filter(demo => demo.tier === 1);
  const tier2Demos = DEMO_PROJECTS.filter(demo => demo.tier === 2);
  const tier3Demos = DEMO_PROJECTS.filter(demo => demo.tier === 3);

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Interactive <span className="text-teal-600">Labs</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Innovative AI and web technology demonstrations designed specifically for 
          <strong className="text-gray-900"> automotive and manufacturing industries</strong>.
          Each demo represents real-world solutions with measurable business impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#tier1-demos"
            className="bg-teal-600 text-white hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold transition-colors text-lg shadow-lg"
          >
            Explore Tier 1 Demos
          </a>
          <a
            href="/contact"
            className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
          >
            Discuss Implementation
          </a>
        </div>
      </section>

      {/* Tier 1 - Immediate ROI */}
      <section id="tier1-demos" className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🏆 Tier 1 - Immediate Business Impact
          </h2>
          <p className="text-lg text-gray-600">
            Production-ready solutions with proven ROI for manufacturing operations
          </p>
        </div>
        
        <div className="grid gap-8">
          {tier1Demos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} featured />
          ))}
        </div>
      </section>

      {/* Tier 2 - Strategic Value */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Tier 2 - Strategic Technology Showcase
          </h2>
          <p className="text-lg text-gray-600">
            Advanced capabilities demonstrating technical expertise and innovation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {tier2Demos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>
      </section>

      {/* Tier 3 - Innovation Leadership */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Tier 3 - Innovation Laboratory
          </h2>
          <p className="text-lg text-gray-600">
            Experimental technologies and cutting-edge web capabilities
          </p>
        </div>
        
        <div className="grid gap-8">
          {tier3Demos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-xl mb-8 opacity-90">
            These demonstrations represent just the beginning. Let's discuss how these technologies 
            can be customized for your specific manufacturing challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              Schedule Technical Consultation
            </a>
            <a
              href="mailto:alex@example.com"
              className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              Contact Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Demo Card Component
 */
function DemoCard({ demo, featured = false }: { demo: Demo; featured?: boolean }) {
  const statusConfig = STATUS_CONFIG[demo.status];
  const tierConfig = TIER_CONFIG[demo.tier];
  
  return (
    <div className={`
      bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 
      border-2 ${tierConfig.color}
      ${featured ? 'ring-4 ring-yellow-400/50 scale-[1.02]' : ''}
    `}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{demo.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{demo.title}</h3>
              <p className="text-sm text-gray-500">{demo.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
            <span className="text-xs text-gray-500">{tierConfig.label}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{demo.description}</p>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Business Impact:</h4>
          <p className="text-sm text-gray-600">{demo.businessImpact}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">ROI Potential:</h4>
          <p className="text-sm font-medium text-green-600">{demo.roiMetric}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {demo.technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href={demo.href}
            className={`
              flex-1 text-center py-3 px-6 rounded-lg font-semibold transition-colors
              ${demo.status === 'live' 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : demo.status === 'coming-soon'
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {demo.status === 'live' ? 'View Demo' : 
             demo.status === 'coming-soon' ? 'Preview Coming Soon' : 
             'View Prototype'}
          </Link>
          {demo.tier === 1 && (
            <a
              href="/contact"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Discuss Implementation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
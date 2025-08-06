import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo Prototypes - Alex Zimmer Portfolio',
  description: 'Interactive prototypes and demo projects showcasing AI and web development expertise.',
  robots: 'noindex, nofollow', // Prototypes nicht in Search indexieren
};

/**
 * Layout für Prototype Routes
 * 
 * Verwendet (prototypes) route group für:
 * - Schnelle HTML→React Migration ohne URL changes
 * - Separate SEO behandlung (noindex)
 * - Einheitliches styling für alle demos
 * - Einfache maintenance während migration phase
 */
export default function PrototypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Prototype Warning Banner (nur in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-sm">
          <p className="font-medium">🚧 Prototype Route</p>
          <p>This is a migrated HTML prototype. Final version will be in /labs/</p>
        </div>
      )}
      
      {/* Prototype Content */}
      {children}
      
      {/* Migration Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            This is a prototype version. Visit{' '}
            <a href="/labs" className="text-blue-600 hover:text-blue-800 underline">
              /labs
            </a>{' '}
            for the final production demos.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Portfolio by Alex Zimmer - AI & Full-Stack Development Expert
          </p>
        </div>
      </footer>
    </>
  );
}
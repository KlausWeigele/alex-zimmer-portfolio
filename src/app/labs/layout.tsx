import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Labs - Interactive Demos | Alex Zimmer',
  description: 'Innovative AI and web technology demonstrations showcasing manufacturing and automotive solutions.',
  keywords: ['AI Demos', 'Interactive Prototypes', 'Manufacturing Technology', 'Automotive Solutions'],
  openGraph: {
    title: 'Labs - Interactive Demos | Alex Zimmer',
    description: 'Experience cutting-edge AI demonstrations and interactive web technologies',
    type: 'website',
    siteName: 'Alex Zimmer Portfolio',
  },
};

/**
 * Labs Layout - Strategic Demo Architecture
 * 
 * Konzept:
 * - /labs/ → Professional demo overview mit business context
 * - /labs/vision-heatmap → AI-powered quality control demo
 * - /labs/3d-portfolio → Interactive 3D experiences  
 * - /labs/robotics → Manufacturing automation demos
 * - etc.
 * 
 * Business Focus:
 * - Jede Demo zeigt measurable ROI für manufacturing clients
 * - Technical credibility durch A+ performance standards
 * - Enterprise-grade UI/UX für decision makers
 */
export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Labs Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900 transition-colors">
                Alex Zimmer
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">Labs</span>
            </div>
            
            {/* Back to Portfolio */}
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Portfolio</span>
            </a>
          </nav>
        </div>
      </header>
      
      {/* Labs Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>
      
      {/* Labs Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Interactive Labs</h3>
              <p className="text-gray-300 text-sm">
                Cutting-edge AI and web technology demonstrations 
                showcasing real-world manufacturing solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Impact</h3>
              <p className="text-gray-300 text-sm">
                Every demo represents measurable ROI potential 
                for automotive and manufacturing companies.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Ready to Implement?</h3>
              <a 
                href="/contact" 
                className="inline-flex items-center space-x-2 bg-teal-400 text-gray-900 hover:bg-teal-300 px-4 py-2 rounded-md font-medium transition-colors text-sm"
              >
                <span>Discuss Your Project</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Alex Zimmer. All demonstrations are production-ready and enterprise-tested.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
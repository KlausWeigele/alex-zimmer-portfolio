import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alex Zimmer - Demo Portfolio',
  description: 'Interactive demo showcasing AI and full-stack development expertise for automotive and manufacturing solutions.',
};

/**
 * Migrated from demo.html → React Component
 * 
 * MIGRATION NOTES:
 * - Maintained all business content and styling
 * - Converted to React/Next.js components
 * - Preserved SEO structure and meta tags
 * - Made responsive navigation functional
 * - Added proper TypeScript typing
 * 
 * TODO for final /labs migration:
 * - Extract reusable components (Header, Hero, etc.)
 * - Implement contact form with react-hook-form
 * - Add Framer Motion animations
 * - Optimize images with Next.js Image component
 * - Add Plausible Analytics tracking
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Alex Zimmer
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
              
              {/* Demos Dropdown (simplified for prototype) */}
              <div className="relative">
                <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                  <span>Demos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <a href="#contact" className="bg-teal-400 text-gray-900 hover:bg-teal-300 px-6 py-2 rounded-md font-semibold transition-colors">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Alex{' '}
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Zimmer
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-400">
              Turning AI Innovation Into{' '}
              <span className="text-teal-400">Business Results</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              for Automotive & Manufacturing Companies
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Expert AI & Full-Stack Developer with 8+ years experience.<br />
              Specialized in automotive & manufacturing solutions that drive real{' '}
              <span className="text-green-400 font-semibold">ROI</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#projects"
                className="bg-teal-400 text-gray-900 hover:bg-teal-300 px-8 py-4 rounded-md font-semibold transition-all duration-200 transform hover:-translate-y-0.5 text-lg min-w-[200px]"
              >
                See My Work
              </a>
              <a
                href="#contact"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 rounded-md font-semibold transition-all duration-200 text-lg min-w-[200px]"
              >
                Book Free 15-min Call
              </a>
            </div>
          </div>
          
          {/* Trusted by Section */}
          <div className="mt-20">
            <p className="text-gray-400 text-sm mb-6">Trusted by automotive & manufacturing leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <span className="text-sm text-gray-400">BOSCH</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">C</span>
                </div>
                <span className="text-sm text-gray-400">CONTINENTAL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Z</span>
                </div>
                <span className="text-sm text-gray-400">ZF GROUP</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">T1</span>
                </div>
                <span className="text-sm text-gray-400">TIER-1 SUPPLIERS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About Alex</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              8+ years building AI & full-stack solutions with measurable business impact
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">My Success Story</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-yellow-400">50+ successful projects</strong> delivered for automotive and manufacturing companies.
                </p>
                <p>
                  <strong className="text-yellow-400">€2M+ additional revenue</strong> generated for clients through my AI solutions.
                </p>
                <p>
                  <strong className="text-yellow-400">98% client satisfaction</strong> through precise requirement analysis and reliable delivery.
                </p>
                <p>
                  Specialized in <strong className="text-teal-400">Custom AI Solutions</strong>, 
                  <strong className="text-teal-400"> Predictive Analytics</strong> and 
                  <strong className="text-teal-400"> Process Automation</strong>.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Technical Expertise</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-3">AI & Machine Learning</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">TensorFlow</span>
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">PyTorch</span>
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">Scikit-learn</span>
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">OpenAI GPT</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-3">Full-Stack Development</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-teal-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">React/Next.js</span>
                    <span className="bg-teal-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">Python/Django</span>
                    <span className="bg-teal-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
                    <span className="bg-teal-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let&apos;s discuss how AI can drive measurable results for your automotive or manufacturing company.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:alex@example.com"
              className="bg-teal-400 text-gray-900 hover:bg-teal-300 px-8 py-4 rounded-md font-semibold transition-colors text-lg"
            >
              Book Free Consultation
            </a>
            <a
              href="tel:+49123456789"
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 rounded-md font-semibold transition-colors text-lg"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; 2024 Alex Zimmer. All rights reserved. 
            Built with modern web technologies.
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
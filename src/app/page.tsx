import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alex Zimmer - AI & Full-Stack Development Expert',
  description: 'Expert AI & Full-Stack Developer specializing in automotive and manufacturing solutions. 8+ years experience delivering measurable business results.',
  keywords: ['AI Developer', 'Full-Stack Developer', 'Automotive Solutions', 'Manufacturing Technology', 'Machine Learning'],
  openGraph: {
    title: 'Alex Zimmer - AI & Manufacturing Expert',
    description: 'Innovative AI solutions for automotive and manufacturing industries',
    type: 'website',
    siteName: 'Alex Zimmer Portfolio',
  },
};

/**
 * Homepage - Professional Portfolio Landing
 * 
 * Business Strategy:
 * - Immediately establish AI + Manufacturing expertise credibility
 * - Clear value proposition with measurable ROI metrics
 * - Strong CTA directing to Labs for demo engagement
 * - Enterprise-focused messaging for decision makers
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Alex Zimmer
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#expertise" className="text-gray-600 hover:text-gray-900 transition-colors">Expertise</a>
              <Link href="/labs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Interactive Labs
              </Link>
              <a 
                href="#contact" 
                className="bg-teal-600 text-white hover:bg-teal-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Turning AI Innovation Into{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Business Results
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
              for Automotive & Manufacturing Companies
            </p>
            
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Expert AI & Full-Stack Developer with <strong className="text-teal-600">8+ years experience</strong>.
              Specialized in automotive & manufacturing solutions that drive real{' '}
              <span className="text-green-600 font-semibold">ROI</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/labs"
                className="bg-teal-600 text-white hover:bg-teal-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 text-lg min-w-[250px] shadow-lg"
              >
                =€ Explore Interactive Demos
              </Link>
              <a
                href="#contact"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 text-lg min-w-[250px]"
              >
                =Þ Book Free Consultation
              </a>
            </div>
            
            {/* Business Impact Metrics */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Successful Projects</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">¬2M+</div>
                <div className="text-sm text-gray-600">Additional Revenue Generated</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Expertise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized in AI & manufacturing solutions that deliver measurable business impact
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">>à</span>
                AI & Machine Learning
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">Computer Vision</span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">TensorFlow.js</span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">Quality Control AI</span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">Predictive Analytics</span>
                </div>
                <p className="text-gray-600">
                  On-device AI processing for manufacturing quality control with explainable results.
                  Specialized in automotive part inspection and defect detection.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">¡</span>
                Full-Stack Development
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">React/Next.js</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">TypeScript</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Python/FastAPI</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Docker/Cloud</span>
                </div>
                <p className="text-gray-600">
                  Enterprise-grade web applications with A+ performance standards.
                  Container-first architecture for reliable deployment and scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Labs CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Experience the Technology</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Explore interactive demonstrations of AI-powered manufacturing solutions. 
            Each demo showcases real-world applications with measurable ROI potential.
          </p>
          
          <div className="bg-white/10 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">=,</span>
              <h3 className="text-2xl font-bold">Vision Heatmap Explorer</h3>
            </div>
            <p className="text-lg opacity-90 mb-4">
              AI-powered visual inspection with explainable Grad-CAM heatmaps
            </p>
            <p className="text-2xl font-bold text-yellow-300">
              ¬500k/Jahr Potential Savings for Tier-1 Automotive Suppliers
            </p>
          </div>
          
          <Link
            href="/labs"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg shadow-xl transform hover:-translate-y-0.5 inline-block"
          >
            =€ Explore Interactive Labs
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let's discuss how AI can drive measurable results for your automotive or manufacturing company.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:alex@example.com"
              className="bg-teal-400 text-gray-900 hover:bg-teal-300 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              =ç Book Free Consultation
            </a>
            <a
              href="tel:+49123456789"
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              =Þ Call Directly
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Alex Zimmer. All rights reserved. 
            <span className="mx-2">"</span>
            <Link href="/labs" className="text-teal-400 hover:text-teal-300">
              Interactive Labs
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
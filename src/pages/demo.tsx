import { Html, Head, Main, NextScript } from 'next/document'

export default function DemoPage() {
  return (
    <Html lang="de" className="dark">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Alex Zimmer - Full-Stack Developer & AI Innovation Specialist</title>
        <meta name="description" content="Expert AI & Full-Stack Developer for Automotive & Manufacturing companies. Custom AI solutions, web applications, and data analytics. 50+ projects delivered, €2M+ client revenue generated." />
        <meta name="keywords" content="AI Development, Full-Stack Developer, Machine Learning, Data Analytics, Automotive AI, Manufacturing Solutions, Python, React, TensorFlow" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Alex Zimmer - AI & Full-Stack Developer for Automotive & Manufacturing" />
        <meta property="og:description" content="Expert AI solutions and development services. Specialized in automotive and manufacturing industries. 50+ successful projects delivered." />
        <meta property="og:url" content="https://alexzimmer.dev" />
        <meta property="og:image" content="https://alexzimmer.dev/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alex Zimmer - AI & Full-Stack Developer" />
        <meta name="twitter:description" content="Expert AI solutions for automotive & manufacturing companies. Custom development services." />
        <meta name="twitter:image" content="https://alexzimmer.dev/twitter-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%234ecdc4' viewBox='0 0 24 24'%3e%3cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3e%3c/svg%3e" />
      </Head>
      <body className="bg-background-primary text-text-primary antialiased">
        <DemoContent />
        <NextScript />
      </body>
    </Html>
  )
}

function DemoContent() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-primary/95 backdrop-blur-sm border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="logo-container opacity-70 hover:opacity-100 transition-opacity duration-300">
              <a href="#" className="text-2xl font-bold bg-gradient-to-r from-accent-gold to-accent-gold-dark bg-clip-text text-transparent">
                Alex Zimmer
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-text-secondary hover:text-accent-gold transition-colors">Über mich</a>
              <a href="#services" className="text-text-secondary hover:text-accent-gold transition-colors">Services</a>
              <a href="#projects" className="text-text-secondary hover:text-accent-gold transition-colors">Projekte</a>
              <a href="#expertise" className="text-text-secondary hover:text-accent-gold transition-colors">Expertise</a>
              <a href="#contact" className="bg-accent-mint text-background-primary hover:bg-accent-mint-dark px-6 py-2 rounded-md font-semibold transition-all duration-200 shadow-accent">
                Projektangebot anfordern
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-background-primary to-background-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hi, ich bin{' '}
              <span className="bg-gradient-to-r from-accent-gold to-accent-gold-dark bg-clip-text text-transparent block sm:inline">
                Alex Zimmer
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              Expert AI & Full-Stack Developer with 8+ years experience.<br className="hidden sm:block" />
              <span className="block sm:inline">Specialized in automotive & manufacturing solutions</span>
              <span className="block sm:inline sm:ml-1">that drive real ROI.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#projects"
                className="bg-accent-gold text-background-primary hover:bg-accent-gold-dark px-8 py-4 rounded-md font-semibold transition-all duration-200 shadow-accent transform hover:-translate-y-0.5 text-lg min-w-[200px]"
              >
                Meine Projekte ansehen
              </a>
              <a
                href="#contact"
                className="border-2 border-accent-mint text-accent-mint hover:bg-accent-mint hover:text-background-primary px-8 py-4 rounded-md font-semibold transition-all duration-200 text-lg min-w-[200px]"
              >
                Unverbindlich kontaktieren
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Über mich</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              8+ Jahre Erfahrung in AI & Full-Stack Development mit Fokus auf messbare Geschäftsergebnisse
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-background-tertiary border border-border-secondary rounded-lg p-8 card-hover shadow-card">
              <h3 className="text-2xl font-bold text-text-primary mb-6">Meine Erfolgsgeschichte</h3>
              <div className="space-y-4 text-text-secondary">
                <p>
                  <strong className="text-accent-gold">50+ erfolgreiche Projekte</strong> für Automotive- und Manufacturing-Unternehmen entwickelt.
                </p>
                <p>
                  <strong className="text-accent-gold">€2M+ zusätzlicher Umsatz</strong> durch meine AI-Lösungen für Kunden generiert.
                </p>
                <p>
                  <strong className="text-accent-gold">98% Kundenzufriedenheit</strong> durch präzise Anforderungsanalyse und zuverlässige Lieferung.
                </p>
                <p>
                  Spezialisiert auf <strong className="text-accent-mint">Custom AI Solutions</strong>, 
                  <strong className="text-accent-mint"> Predictive Analytics</strong> und 
                  <strong className="text-accent-mint"> Process Automation</strong>.
                </p>
              </div>
            </div>
            
            <div className="bg-background-tertiary border border-border-secondary rounded-lg p-8 card-hover shadow-card">
              <h3 className="text-2xl font-bold text-text-primary mb-6">Technical Expertise</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-accent-gold mb-3">AI & Machine Learning</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">TensorFlow</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">PyTorch</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">Scikit-learn</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">OpenAI GPT</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-gold mb-3">Full-Stack Development</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-accent-mint text-background-primary px-3 py-1 rounded-full text-sm font-medium">React/Next.js</span>
                    <span className="bg-accent-mint text-background-primary px-3 py-1 rounded-full text-sm font-medium">Python/Django</span>
                    <span className="bg-accent-mint text-background-primary px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
                    <span className="bg-accent-mint text-background-primary px-3 py-1 rounded-full text-sm font-medium">PostgreSQL</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-gold mb-3">Cloud & DevOps</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">AWS</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">Docker</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">Kubernetes</span>
                    <span className="bg-accent-gold text-background-primary px-3 py-1 rounded-full text-sm font-medium">CI/CD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-tertiary py-8 border-t border-border-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-secondary">
            &copy; <span id="current-year">2024</span> Alex Zimmer. Alle Rechte vorbehalten. 
            Entwickelt mit modernsten Web-Technologien.
          </p>
        </div>
      </footer>

      {/* Enhanced JavaScript */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Dynamic copyright year
          document.getElementById('current-year').textContent = new Date().getFullYear();
          
          // Enhanced prefers-reduced-motion support
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
          
          function handleReducedMotion(e) {
            if (e.matches) {
              document.querySelectorAll('.animate-fade-in-up, .pulse-subtle').forEach(element => {
                element.style.animation = 'none !important';
              });
            }
          }
          
          prefersReducedMotion.addEventListener('change', handleReducedMotion);
          handleReducedMotion(prefersReducedMotion);
          
          // Smooth scrolling for anchor links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            });
          });
        `
      }} />
    </>
  )
}
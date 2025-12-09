import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Recursyv Full Hub</h1>
                <p className="text-xs text-slate-600">Integration Marketplace</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
              <a href="/about" className="text-sm font-medium text-primary">About Us</a>
              <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            About Recursyv Full Hub
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're building the future of business integrations, connecting your essential tools seamlessly.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-none shadow-xl">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              At Recursyv, we believe that businesses shouldn't waste time on manual data entry and disconnected systems. 
              Our mission is to provide seamless, reliable integrations that connect your hub platform with all the tools 
              your team uses every day.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We've built a comprehensive integration marketplace that supports multiple hub vendors and dozens of spoke 
              integrations, giving you the flexibility to build the perfect tech stack for your business.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Integration Setup</h3>
                <p className="text-slate-600">
                  Get your integrations up and running in minutes, not weeks. Our streamlined process makes it easy to connect your tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Reliable</h3>
                <p className="text-slate-600">
                  Enterprise-grade security and 99.9% uptime guarantee. Your data is safe and your integrations always work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Support</h3>
                <p className="text-slate-600">
                  Our integration specialists are here to help you every step of the way, from setup to optimization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">174+</div>
              <div className="text-blue-100">Integration Combinations</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">6</div>
              <div className="text-blue-100">Hub Vendors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">29</div>
              <div className="text-blue-100">Spoke Integrations</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-none shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to Connect Your Tools?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Explore our integration marketplace and find the perfect connections for your business.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => setLocation("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  View Integrations
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/contact")}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

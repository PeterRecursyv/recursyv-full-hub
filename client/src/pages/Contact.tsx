import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function Contact() {
  const { data: branding } = trpc.config.branding.useQuery();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const submitContactForm = trpc.system.submitContactForm.useMutation({
    onSuccess: () => {
      alert("Thank you! Your message has been sent successfully. We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      alert(`Error sending message: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactForm.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <img
                src={branding?.logo || "/assets/logos/recursyv-logo.png"}
                alt="Recursyv"
                className="h-16 w-auto object-contain"
              />
            </div>
            <nav className="flex items-center gap-8">
              <a href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="/about" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-blue-600 font-medium">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">
            Get in touch with our team - we're here to help
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Contact Form */}
        <Card className="mb-12 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={submitContactForm.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {submitContactForm.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:info@recursyv.com"
                  className="text-lg text-blue-600 hover:text-blue-700 hover:underline"
                >
                  info@recursyv.com
                </a>
                <p className="text-sm text-slate-600 mt-2">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-slate-700">United Kingdom</p>
                  <a
                    href="tel:+441183800142"
                    className="text-lg text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    +44 118 380 0142
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">United States</p>
                  <a
                    href="tel:+18337493781"
                    className="text-lg text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    +1 833 749 3781
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-slate-700 leading-relaxed">
                  Recursyv Limited
                  <br />
                  400 Thames Valley Park Drive
                  <br />
                  Reading, RG6 1PT
                  <br />
                  United Kingdom
                </address>
              </CardContent>
            </Card>
          </div>

          {/* Google Map */}
          <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.8!2d-0.9312!3d51.4615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDI3JzQxLjQiTiAwwrA1NSc1Mi4zIlc!5e0!3m2!1sen!2suk!4v1733238000000!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Recursyv Office Location"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

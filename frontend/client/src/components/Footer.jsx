import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold">
                Start<span className="italic">X</span>
              </span>
            </div>
            <p className="text-secondary-foreground/80 max-w-md mb-4">
              Empowering the next generation of founders to build innovative solutions
              that shape the future of technology.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>Newton School of Technology</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>mindNest@newton.edu</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+91 1234567890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#apply" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Apply Now
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © 2025 MindNest. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
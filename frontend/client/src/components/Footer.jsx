import { Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-t border-border overflow-hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                Mind<span className="text-primary italic">X</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Empowering future founders to build innovative solutions.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Links</h4>
              <ul className="space-y-1">
                <li><a href="#about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#benefits" className="text-xs text-muted-foreground hover:text-primary transition-colors">Benefits</a></li>
                <li><a href="#apply" className="text-xs text-muted-foreground hover:text-primary transition-colors">Apply</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-2 text-foreground">Contact</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>mindNest@newton.edu</span>
                </li>
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>+91 1234567890</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-sm mb-2 text-foreground">Follow Us</h4>
            <div className="flex gap-3 justify-center md:justify-end">
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-all group">
                <Linkedin className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-all group">
                <Twitter className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-all group">
                <Github className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">© 2025 MindNest. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

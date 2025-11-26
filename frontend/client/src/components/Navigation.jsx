import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../services/authService";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Benefits", href: "#benefits" },
    { label: "Apply", href: "#apply" },
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-4 rounded-3xl backdrop-blur-xl bg-background/70 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Start<span className="text-primary italic">X</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:scale-105"
              >
                {item.label}
              </a>
            ))}
            {authenticated ? (
              <Button onClick={handleLogout} variant="outline" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                Logout
              </Button>
            ) : (
              <Button onClick={() => navigate('/signin')} className="rounded-full shadow-lg hover:shadow-xl transition-all">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-6 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-4 p-4 rounded-2xl bg-background/50 backdrop-blur-md border border-white/10">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:translate-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {authenticated ? (
                <Button onClick={handleLogout} variant="outline" className="rounded-full w-full shadow-lg">
                  Logout
                </Button>
              ) : (
                <Button onClick={() => { navigate('/signin'); setIsOpen(false); }} className="rounded-full w-full shadow-lg">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
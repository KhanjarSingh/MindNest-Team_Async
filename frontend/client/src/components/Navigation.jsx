import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser, isAdmin } from "../services/authService";
import ProfileDropdown from "./navbar/ProfileDropdown";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const adminNavItems = [
    { label: "Dashboard", href: "/admin-dashboard", isRoute: true },
  ];

  const regularNavItems = [
    { label: "Home", href: "/", isRoute: true },
    ...(authenticated ? [
      { label: "Connect", href: "/connect", isRoute: true },
      { label: "My Ideas", href: "/my-ideas", isRoute: true },
      { label: "Submit Idea", href: "/addidea", isRoute: true }
    ] : [
      { label: "About", href: "#about" }
    ]),
    { label: "Benefits", href: "#benefits" },
    { label: "Schemes", href: "/schemes", isRoute: true },
    { label: "Upcoming hackathons", href: "/hackathons", isRoute: true },
    { label: "Apply", href: "#apply" },
  ];

  const navItems = isAdmin() ? adminNavItems : regularNavItems;

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-4 rounded-3xl backdrop-blur-xl bg-background/70 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                Mind<span className="text-primary italic">Nest</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isRoute ? (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.href); window.scrollTo(0, 0); }}
                  className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  {item.label}
                </a>
              )
            ))}
            {authenticated ? (
              <ProfileDropdown onLogout={handleLogout} />
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
                item.isRoute ? (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.href); window.scrollTo(0, 0); setIsOpen(false); }}
                    className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:translate-x-2 text-left"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:translate-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              {authenticated ? (
                <div className="flex justify-center">
                  <ProfileDropdown onLogout={handleLogout} />
                </div>
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SimpleNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/", isRoute: true },
    { label: "About", href: "/about", isRoute: true },
    { label: "Upcoming hackathons", href: "/hackathons", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className="text-xl font-bold text-gray-900">
              StartX
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => navigate('/signin')} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.href); setIsOpen(false); }}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => { navigate('/signin'); setIsOpen(false); }} 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-left"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavigation;
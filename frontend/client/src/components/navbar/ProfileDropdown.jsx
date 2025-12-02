import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import studentAvatar from "../../assets/avatars/student.png";
import { isAdmin } from "../../services/authService";

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <img 
          src={studentAvatar} 
          alt="Student Profile" 
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-6 w-72 bg-background/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-[9999]">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col items-center space-y-3">
              <img 
                src={studentAvatar} 
                alt="Student Profile" 
                className="w-10 h-10 rounded-full"
              />
              <p className="text-xs text-primary font-medium">{isAdmin() ? 'Admin' : 'Student'}</p>
            </div>
          </div>
          
          <div className="p-2">
            <div className="px-4 py-3 text-xs text-foreground/70">
              <p className="mb-1">Any feedback or suggestions? Email:</p>
              <button
                onClick={() => {
                  window.open('mailto:shibadityadeb.official@gmail.com');
                  setIsOpen(false);
                }}
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                shibadityadeb.official@gmail.com
              </button>
            </div>
            
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-50/10 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
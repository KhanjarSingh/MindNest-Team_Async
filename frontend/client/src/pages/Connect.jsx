import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/Navigation';
import ChatWindow from '../components/chat/ChatWindow';
import { getAuthToken } from '../services/authService';

const Connect = () => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Admin user ID
  const ADMIN_ID = 10;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Connect with
                <br />
                <span className="text-primary italic">Admin Support</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions about your ideas or need assistance? Chat directly with our admin team for real-time support.
              </p>
            </div>

            {currentUserId && (
              <div className="max-w-2xl mx-auto">
                <ChatWindow 
                  receiverId={ADMIN_ID}
                  receiverName="Admin"
                  currentUserId={currentUserId}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Connect;
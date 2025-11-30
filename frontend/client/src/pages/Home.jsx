import React, { useState, useEffect } from 'react';
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Benefits from "../components/Benefits";
import ApplicationCTA from "../components/ApplicationCTA";
import Footer from "../components/Footer";
import { isAuthenticated, getAuthToken } from '../services/authService';
import axios from 'axios';

export default function Home() {
  const [userIdeas, setUserIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      fetchUserIdeas();
    }
  }, [authenticated]);

  const fetchUserIdeas = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('https://mindnest-team-async.onrender.com/api/v1/ideas/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserIdeas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user ideas:', error);
    }
  };

  if (selectedIdea) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        <section className="relative min-h-screen flex items-start justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
            <button 
              onClick={() => setSelectedIdea(null)}
              className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to My Ideas
            </button>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">{selectedIdea.title}</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Your Idea</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pitch</label>
                      <p className="text-foreground">{selectedIdea.pitch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground">{selectedIdea.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                      <p className="text-foreground">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Review Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedIdea.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                        selectedIdea.status === 'funded' ? 'bg-green-100 text-green-800' :
                        selectedIdea.status === 'under_funding' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(selectedIdea.status || 'under_review').replace('_', ' ')}
                      </div>
                    </div>

                    {selectedIdea.score && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Score</label>
                        <p className="text-foreground text-lg font-semibold">{selectedIdea.score}/10</p>
                      </div>
                    )}

                    {selectedIdea.fundingAmount && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Funding Amount</label>
                        <p className="text-green-600 text-lg font-semibold">${selectedIdea.fundingAmount.toLocaleString()}</p>
                      </div>
                    )}

                    {selectedIdea.tags && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tags</label>
                        <p className="text-foreground">{selectedIdea.tags}</p>
                      </div>
                    )}

                    {selectedIdea.note && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Admin Review Note</label>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-foreground">{selectedIdea.note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Benefits />
      <ApplicationCTA />
      
      {authenticated && userIdeas.length > 0 && (
        <section className="py-20 bg-background/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">Your Submitted Ideas</h2>
              <div className="grid gap-6">
                {userIdeas.slice(0, 3).map((idea) => (
                  <div 
                    key={idea.id} 
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 cursor-pointer hover:bg-card/70 transition-all"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-foreground text-lg">{idea.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        idea.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                        idea.status === 'funded' ? 'bg-green-100 text-green-800' :
                        idea.status === 'under_funding' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(idea.status || 'under_review').replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{idea.pitch}</p>
                    
                    <div className="flex gap-4 text-sm">
                      {idea.score && (
                        <span className="text-foreground">Score: <strong>{idea.score}/10</strong></span>
                      )}
                      {idea.fundingAmount && (
                        <span className="text-green-600 font-semibold">Funding: ${idea.fundingAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}

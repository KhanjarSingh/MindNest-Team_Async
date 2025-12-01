import React, { useState, useEffect } from 'react';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSchemes = [
        {
          id: 'startup_india_1',
          title: 'Startup India Seed Fund Scheme',
          description: 'Financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.',
          source: 'Startup India',
          url: 'https://www.startupindia.gov.in/content/sih/en/government-schemes.html',
          tags: ['funding', 'startup', 'seed']
        },
        {
          id: 'data_gov_1',
          title: 'Digital India Initiative',
          description: 'Transform India into a digitally empowered society and knowledge economy through digital infrastructure and governance.',
          source: 'Digital India',
          url: 'https://digitalindia.gov.in/',
          tags: ['digital', 'technology', 'governance']
        },
        {
          id: 'startup_india_2',
          title: 'Atal Innovation Mission',
          description: 'Promote innovation and entrepreneurship across the country through various initiatives and programs.',
          source: 'NITI Aayog',
          url: 'https://aim.gov.in/',
          tags: ['innovation', 'entrepreneurship', 'incubation']
        },
        {
          id: 'data_gov_2',
          title: 'Make in India',
          description: 'Initiative to encourage companies to manufacture their products in India and incentivize dedicated investments.',
          source: 'Make in India',
          url: 'https://www.makeinindia.com/',
          tags: ['manufacturing', 'investment', 'industry']
        },
        {
          id: 'startup_india_3',
          title: 'Stand Up India Scheme',
          description: 'Facilitate bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs.',
          source: 'Stand Up India',
          url: 'https://www.standupmitra.in/',
          tags: ['loan', 'women', 'sc/st', 'entrepreneurship']
        },
        {
          id: 'data_gov_3',
          title: 'Skill India Mission',
          description: 'Enable a large number of Indian youth to take up industry-relevant skill training.',
          source: 'Skill India',
          url: 'https://www.skillindia.gov.in/',
          tags: ['skills', 'training', 'youth', 'employment']
        }
      ];
      
      setSchemes(mockSchemes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">GOVERNMENT SCHEMES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Discover &
              <br />
              <span className="text-primary italic">Apply for Schemes</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Explore government schemes and initiatives designed to support startups, innovation, and entrepreneurship across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">Loading schemes...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSchemes.map((scheme) => (
                  <div 
                    key={scheme.id}
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:bg-card/70 transition-all duration-300 hover:scale-105"
                  >
                    <div className="mb-4">
                      <div className="text-xs text-primary font-medium mb-2">{scheme.source}</div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{scheme.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{scheme.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scheme.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => window.open(scheme.url, '_blank')}
                      className="w-full rounded-full"
                      variant="default"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredSchemes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">No schemes found matching your search.</div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
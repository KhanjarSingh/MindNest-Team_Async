import React, { useState, useEffect } from 'react';
import SimpleNavigation from '../components/SimpleNavigation';
import { Search, Globe, MapPin, Calendar, ExternalLink, Lock, Rocket, Filter, Users } from 'lucide-react';

const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [countries, setCountries] = useState([]);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchHackathons();
  }, []);

  useEffect(() => {
    filterHackathons();
  }, [hackathons, searchTerm, typeFilter, countryFilter]);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple proxy services
      const DEVPOST_URL = "https://devpost.com/api/hackathons?challenge_type=all&status=upcoming";
      const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(DEVPOST_URL)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(DEVPOST_URL)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(DEVPOST_URL)}`
      ];
      
      let data = null;
      let lastError = null;
      
      for (const proxyUrl of proxies) {
        try {
          console.log('🌐 Trying proxy:', proxyUrl.split('?')[0]);
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const result = await response.text();
          
          // Handle different proxy response formats
          if (proxyUrl.includes('allorigins')) {
            const parsed = JSON.parse(result);
            data = JSON.parse(parsed.contents);
          } else {
            data = JSON.parse(result);
          }
          
          console.log('✅ Proxy successful:', proxyUrl.split('?')[0]);
          break;
          
        } catch (err) {
          console.warn('❌ Proxy failed:', proxyUrl.split('?')[0], err.message);
          lastError = err;
          continue;
        }
      }
      
      if (!data) {
        throw new Error(`All proxies failed. Last error: ${lastError?.message}`);
      }
      

      

      
      const events = data.hackathons || [];
      console.log('✅ Successfully parsed', events.length, 'hackathons');
      
      const normalizedEvents = events.map(normalizeHackathon);
      setHackathons(normalizedEvents);
      
      const uniqueCountries = [...new Set(normalizedEvents.map(h => h.country).filter(Boolean))];
      setCountries(uniqueCountries.sort());
      
    } catch (err) {
      console.error('❌ Fetch failed:', err);
      
      console.error('Fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const normalizeHackathon = (hackathon) => {
    // Normalize thumbnail URLs that start with //
    const imageUrl = hackathon.thumbnail_url 
      ? (hackathon.thumbnail_url.startsWith('//') 
          ? 'https:' + hackathon.thumbnail_url 
          : hackathon.thumbnail_url)
      : '/placeholder.svg';
    
    // Parse location from displayed_location or fallback
    const isOnline = hackathon.displayed_location?.location === 'Online' || hackathon.displayed_location?.icon === 'globe';
    const location = hackathon.displayed_location?.location || 'Location: TBA';
    
    // Safe date parsing
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date().toISOString();
      try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } catch {
        return new Date().toISOString();
      }
    };
    
    // Parse dates from submission_period_dates string like "Dec 01, 2025 - Jan 07, 2026"
    const dateRange = hackathon.submission_period_dates || '';
    const [startDate, endDate] = dateRange.split(' - ');
    
    return {
      id: hackathon.id || Math.random().toString(36),
      name: hackathon.title || hackathon.name || 'Untitled Hackathon',
      website: hackathon.url || hackathon.website,
      start: parseDate(startDate || hackathon.start),
      end: parseDate(endDate || hackathon.end),
      city: isOnline ? null : (hackathon.location?.city || location.split(',')[0]?.trim()),
      state: hackathon.location?.state || null,
      country: isOnline ? 'Global' : (hackathon.location?.country || 'TBA'),
      virtual: isOnline || hackathon.virtual || hackathon.online || false,
      hybrid: hackathon.hybrid || false,
      banner: imageUrl,
      logo: imageUrl
    };
  };

  const filterHackathons = () => {
    let filtered = hackathons;

    if (searchTerm) {
      filtered = filtered.filter(h => 
        decodeHtmlEntities(h.name).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(h => {
        if (typeFilter === 'virtual') return h.virtual;
        if (typeFilter === 'hybrid') return h.hybrid;
        if (typeFilter === 'offline') return !h.virtual && !h.hybrid;
        return true;
      });
    }

    if (countryFilter) {
      filtered = filtered.filter(h => h.country === countryFilter);
    }

    setFilteredHackathons(filtered);
    setCurrentPage(1);
  };

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const paginatedHackathons = filteredHackathons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredHackathons.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleNavigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-secondary/20 border-t-secondary mx-auto animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Discovering Amazing Hackathons</h2>
            <p className="text-muted-foreground">Fetching the latest opportunities for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && hackathons.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleNavigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
              <div className="mb-6">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Oops! Something went wrong</h2>
              <p className="text-destructive mb-6 text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</p>
              <div className="space-y-3">
                <button 
                  onClick={fetchHackathons}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  🔄 Try Again
                </button>
                {import.meta.env.DEV && (
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs text-primary">
                      💡 Dev tip: Try setting VITE_USE_LOCAL_MOCK=true or check console for debug logs
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleNavigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Upcoming <span className="text-primary italic">Hackathons</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">Discover and participate in exciting hackathons worldwide. Build, learn, and connect with fellow innovators.</p>
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="bg-card/50 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all md:w-40"
              >
                <option value="all">All Types</option>
                <option value="virtual">Virtual</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select 
                value={countryFilter} 
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all md:w-48"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Showing <span className="text-primary font-bold">{paginatedHackathons.length}</span> of <span className="text-secondary font-bold">{filteredHackathons.length}</span> hackathons
            </p>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Virtual</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Hybrid</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {paginatedHackathons.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-card rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No hackathons found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </div>
            </div>
          ) : (
            paginatedHackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border backdrop-blur-sm flex flex-col">
                <div className="relative">
                  <img
                    src={hackathon.banner || hackathon.logo || '/placeholder.svg'}
                    alt={decodeHtmlEntities(hackathon.name)}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1 ${
                      hackathon.virtual ? 'bg-green-500 text-white' :
                      hackathon.hybrid ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {hackathon.virtual ? (
                        <><Globe className="w-3 h-3" /> Virtual</>
                      ) : hackathon.hybrid ? (
                        <><Globe className="w-3 h-3" /> Hybrid</>
                      ) : (
                        <><MapPin className="w-3 h-3" /> Offline</>
                      )}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-3 md:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-card-foreground overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                    {decodeHtmlEntities(hackathon.name)}
                  </h3>
                  
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 flex-grow">
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground bg-muted/50 p-1.5 md:p-2 rounded-lg">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-primary flex-shrink-0" />
                      <span className="font-medium truncate">
                        {hackathon.start ? new Date(hackathon.start).toLocaleDateString() : 'TBA'} — {hackathon.end ? new Date(hackathon.end).toLocaleDateString() : 'TBA'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground bg-muted/50 p-1.5 md:p-2 rounded-lg">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-secondary flex-shrink-0" />
                      <span className="font-medium truncate">{[hackathon.city, hackathon.state, hackathon.country].filter(Boolean).join(', ') || 'Location: TBA'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto">
                    {hackathon.website ? (
                      <button
                        onClick={() => window.open(hackathon.website, '_blank', 'noopener,noreferrer')}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 md:py-3 px-3 md:px-6 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base"
                      >
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden md:inline">Participate Now</span>
                        <span className="md:hidden">Join</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-muted text-muted-foreground py-2 md:py-3 px-3 md:px-6 rounded-xl cursor-not-allowed font-semibold flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base"
                        title="No registration link"
                      >
                        <Lock className="w-4 h-4" />
                        Registration Closed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-card rounded-2xl shadow-lg p-2 border border-border backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  ← Previous
                </button>
                
                <div className="flex items-center px-6 py-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-semibold text-foreground">
                    Page <span className="text-primary">{currentPage}</span> of <span className="text-secondary">{totalPages}</span>
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonsPage;
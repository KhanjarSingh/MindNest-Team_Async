import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, ExternalLink, Calendar } from 'lucide-react';
import axios from 'axios';
import { getAuthToken } from '../../services/authService';
import { API_CONFIG } from '../../config/api';

export default function MyIdeas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please log in to view your ideas');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IDEAS}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setIdeas(response.data.data || []);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'funded': return 'bg-green-100 text-green-800';
      case 'under_funding': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return (status || 'under_review').replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative min-h-screen pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">MY SUBMISSIONS</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                My Ideas
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your submitted ideas and their progress
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mb-8">
              <Button 
                onClick={() => navigate('/addidea')}
                className="rounded-full px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit New Idea
              </Button>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
                <p className="text-red-800">{error}</p>
                <Button 
                  onClick={fetchMyIdeas} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Ideas Grid */}
            {ideas && ideas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
                          {idea.title}
                        </CardTitle>
                        <Badge className={getStatusColor(idea.status)}>
                          {formatStatus(idea.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground line-clamp-2">
                        {idea.pitch}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {idea.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>

                        {idea.score && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Score:</span>
                            <Badge variant="outline">{idea.score}/10</Badge>
                          </div>
                        )}

                        {idea.fundingAmount && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Funding:</span>
                            <Badge className="bg-green-100 text-green-800">
                              ${idea.fundingAmount.toLocaleString()}
                            </Badge>
                          </div>
                        )}

                        {idea.tags && (
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.split(',').map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {idea.demoLink && (
                          <a 
                            href={idea.demoLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Demo
                          </a>
                        )}

                        {idea.note && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium text-foreground mb-1">Admin Note:</p>
                            <p className="text-sm text-muted-foreground">{idea.note}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !loading && !error && (
              <div className="text-center py-16">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-12 max-w-md mx-auto">
                  <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Ideas Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't submitted any ideas yet. Start by sharing your innovative project!
                  </p>
                  <Button 
                    onClick={() => navigate('/addidea')}
                    className="rounded-full"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Submit Your First Idea
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
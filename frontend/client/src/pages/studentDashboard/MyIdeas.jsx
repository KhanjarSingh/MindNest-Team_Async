import React, { useState, useEffect } from 'react';
import SimpleNavigation from '../../components/SimpleNavigation';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, Star, DollarSign, Tag, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAuthToken } from '../../services/authService';
import axios from 'axios';

const API_BASE_URL = 'https://mindnest-team-async.onrender.com/api/v1';

const MyIdeas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/ideas/my-ideas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const ideasData = response.data.data || [];
      setIdeas(ideasData);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch ideas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'under_review': { bg: 'bg-orange-500', text: 'UNDER REVIEW', icon: Clock },
      'funded': { bg: 'bg-green-500', text: 'FUNDED', icon: CheckCircle },
      'rejected': { bg: 'bg-red-500', text: 'REJECTED', icon: XCircle },
      'under_funding': { bg: 'bg-blue-500', text: 'UNDER FUNDING', icon: DollarSign },
    };
    const statusStyle = statusMap[status] || { bg: 'bg-gray-500', text: status.toUpperCase(), icon: Clock };
    const Icon = statusStyle.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full text-white ${statusStyle.bg}`}>
        <Icon className="w-3 h-3" />
        {statusStyle.text}
      </span>
    );
  };

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
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Your Ideas</h2>
            <p className="text-muted-foreground">Fetching your submitted ideas...</p>
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
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            My <span className="text-primary italic">Ideas</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">View and track the status of your submitted ideas</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl max-w-2xl mx-auto text-center">
            {error}
          </div>
        )}

        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-card rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-border">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-6">Submit your first idea to get started!</p>
              <button
                onClick={() => navigate('/addidea')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
              >
                Submit Your First Idea
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border backdrop-blur-sm"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-card-foreground flex-1">{idea.title}</h3>
                    {getStatusBadge(idea.status)}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">{idea.pitch}</p>

                  {/* Admin Review Info */}
                  <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-xl">
                    {idea.score && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-foreground">Score:</span>
                        <span className="text-muted-foreground">{idea.score}/10</span>
                      </div>
                    )}
                    
                    {idea.fundingAmount && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-foreground">Funding:</span>
                        <span className="text-muted-foreground">${idea.fundingAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {idea.tags && Array.isArray(idea.tags) && idea.tags.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <Tag className="w-4 h-4 text-primary mt-0.5" />
                        <div className="flex-1">
                          <span className="font-semibold text-foreground">Tags: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {idea.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {idea.note && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-secondary mt-0.5" />
                        <div className="flex-1">
                          <span className="font-semibold text-foreground">Admin Note: </span>
                          <p className="text-muted-foreground mt-1">{idea.note}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => navigate(`/my-ideas/${idea.id}`)}
                      className="flex items-center gap-1 text-primary hover:text-secondary transition-colors font-medium"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIdeas;


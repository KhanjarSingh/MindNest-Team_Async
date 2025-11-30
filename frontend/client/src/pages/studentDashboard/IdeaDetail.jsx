import React, { useState, useEffect } from 'react';
import SimpleNavigation from '../../components/SimpleNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, DollarSign, Tag, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAuthToken } from '../../services/authService';
import axios from 'axios';

const API_BASE_URL = 'https://mindnest-team-async.onrender.com/api/v1';

const IdeaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/ideas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setIdea(response.data.data);
    } catch (err) {
      console.error('Error fetching idea:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch idea');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'under_review': { bg: 'bg-orange-500', text: 'UNDER REVIEW', icon: Clock, desc: 'Your idea is currently under review by our admin team.' },
      'funded': { bg: 'bg-green-500', text: 'FUNDED', icon: CheckCircle, desc: 'Congratulations! Your idea has been approved and funded.' },
      'rejected': { bg: 'bg-red-500', text: 'REJECTED', icon: XCircle, desc: 'Unfortunately, your idea was not selected for funding at this time.' },
      'under_funding': { bg: 'bg-blue-500', text: 'UNDER FUNDING', icon: DollarSign, desc: 'Your idea is in the funding process.' },
    };
    const statusStyle = statusMap[status] || { bg: 'bg-gray-500', text: status.toUpperCase(), icon: Clock, desc: '' };
    const Icon = statusStyle.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusStyle.bg} text-white`}>
        <Icon className="w-5 h-5" />
        <div>
          <div className="font-bold">{statusStyle.text}</div>
          {statusStyle.desc && <div className="text-xs opacity-90">{statusStyle.desc}</div>}
        </div>
      </div>
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Idea Details</h2>
            <p className="text-muted-foreground">Fetching idea data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !idea) {
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
              <button 
                onClick={() => navigate('/my-ideas')}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
              >
                ← Back to My Ideas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="min-h-screen bg-background">
      <SimpleNavigation />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-ideas')}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to My Ideas</span>
        </button>

        {/* Status Badge */}
        <div className="mb-6">
          {getStatusBadge(idea.status)}
        </div>

        {/* Idea Information Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Idea Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Title</label>
              <h3 className="text-xl font-bold text-foreground">{idea.title}</h3>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Pitch</label>
              <p className="text-muted-foreground bg-muted/50 p-4 rounded-xl">{idea.pitch}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
              <p className="text-muted-foreground bg-muted/50 p-4 rounded-xl whitespace-pre-wrap">{idea.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {idea.demoLink && (
                <a
                  href={idea.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Demo Link</span>
                </a>
              )}
              {idea.pitchDeckUrl && (
                <a
                  href={idea.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-foreground">Pitch Deck</span>
                </a>
              )}
              {idea.ppt_Url && (
                <a
                  href={idea.ppt_Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-foreground" />
                  <span className="font-medium text-foreground">PPT</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Admin Review Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Admin Review</h2>
          
          <div className="space-y-6">
            {/* Score */}
            {idea.score && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-foreground">Score</span>
                </div>
                <div className="text-2xl font-bold text-foreground ml-8">
                  {idea.score}/10
                </div>
              </div>
            )}

            {/* Funding Amount */}
            {idea.fundingAmount && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-foreground">Funding Amount</span>
                </div>
                <div className="text-2xl font-bold text-green-500 ml-8">
                  ${idea.fundingAmount.toLocaleString()}
                </div>
              </div>
            )}

            {/* Tags */}
            {idea.tags && Array.isArray(idea.tags) && idea.tags.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-8">
                  {idea.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Note */}
            {idea.note && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-foreground">Admin Note</span>
                </div>
                <p className="text-muted-foreground ml-8 whitespace-pre-wrap">{idea.note}</p>
              </div>
            )}

            {!idea.score && !idea.fundingAmount && (!idea.tags || idea.tags.length === 0) && !idea.note && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No admin review information available yet. Your idea is still under review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;


import React, { useState, useEffect } from 'react';
import SimpleNavigation from '../../components/SimpleNavigation';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, ArrowRight, Users } from 'lucide-react';
import { getAuthToken } from '../../services/authService';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_BASE_URL = 'https://mindnest-team-async.onrender.com/api/v1';

const AdminHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    funded: 0,
    totalFunding: 0,
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/ideas/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const ideasData = response.data.data || [];
      setIdeas(ideasData);

      // Calculate stats
      const total = ideasData.length;
      const pending = ideasData.filter(i => i.status === 'under_review').length;
      const approved = ideasData.filter(i => i.status === 'funded').length;
      const rejected = ideasData.filter(i => i.status === 'rejected').length;
      const funded = ideasData.filter(i => i.status === 'funded' || i.status === 'under_funding').length;
      const totalFunding = ideasData
        .filter(i => i.fundingAmount)
        .reduce((sum, i) => sum + (i.fundingAmount || 0), 0);

      setStats({
        total,
        pending,
        approved,
        rejected,
        funded,
        totalFunding,
      });
    } catch (err) {
      console.error('Error fetching ideas:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch ideas';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const recentIdeas = ideas.slice(0, 5);

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
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h2>
            <p className="text-muted-foreground">Fetching ideas data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && ideas.length === 0) {
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
                onClick={fetchIdeas}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
              >
                🔄 Try Again
              </button>
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
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Admin <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">Manage and review all submitted ideas from participants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <span className="text-3xl font-bold text-primary">{stats.total}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Total Ideas</h3>
            <p className="text-sm text-muted-foreground">All submitted ideas</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-7 h-7 text-orange-500" />
              </div>
              <span className="text-3xl font-bold text-orange-500">{stats.pending}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Pending Review</h3>
            <p className="text-sm text-muted-foreground">Awaiting admin review</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <span className="text-3xl font-bold text-green-500">{stats.approved}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Funded</h3>
            <p className="text-sm text-muted-foreground">Ideas that received funding</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
              <span className="text-3xl font-bold text-red-500">{stats.rejected}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Rejected</h3>
            <p className="text-sm text-muted-foreground">Ideas that were rejected</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-500" />
              </div>
              <span className="text-3xl font-bold text-blue-500">{stats.funded}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Under Funding</h3>
            <p className="text-sm text-muted-foreground">Ideas in funding process</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-secondary" />
              </div>
              <span className="text-3xl font-bold text-secondary">${stats.totalFunding.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Total Funding</h3>
            <p className="text-sm text-muted-foreground">Total amount allocated</p>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Recent Submissions
            </h2>
            <button
              onClick={() => navigate('/admin/ideas')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border backdrop-blur-sm">
            {recentIdeas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No ideas yet</h3>
                <p className="text-muted-foreground">Ideas will appear here once participants submit them.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => navigate(`/admin/ideas/${idea.id}`)}
                    className="p-6 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{idea.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {idea.user?.username || 'Unknown'}
                          </span>
                          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{idea.pitch}</p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                          idea.status === 'under_review' ? 'bg-orange-500 text-white' :
                          idea.status === 'funded' ? 'bg-green-500 text-white' :
                          idea.status === 'rejected' ? 'bg-red-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {idea.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;


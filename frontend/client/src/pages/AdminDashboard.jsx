import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign, Clock, Eye, Edit3, Save, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ideaService } from '../services/ideaService';
import { getAuthToken } from '../services/authService';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchIdeas();
    
    // Get current user ID from token
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

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas from API...');
      const response = await ideaService.getAllIdeas();
      console.log('API Response:', response);
      console.log('Ideas found:', response.data?.length || 0);
      setIdeas(response.data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const [updateMessage, setUpdateMessage] = useState('');

  const updateField = async (ideaId, field, value) => {
    setUpdating(true);
    try {
      let response;
      switch (field) {
        case 'status':
          response = await ideaService.updateIdeaStatus(ideaId, value);
          break;
        case 'score':
          response = await ideaService.updateIdeaScore(ideaId, value);
          break;
        case 'fundingAmount':
          response = await ideaService.updateIdeaFunding(ideaId, value);
          break;
        case 'note':
          response = await ideaService.updateIdeaNote(ideaId, value);
          break;
        case 'tags':
          response = await ideaService.updateIdeaTags(ideaId, value);
          break;
        default:
          throw new Error(`Unknown field: ${field}`);
      }
      
      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, [field]: value } : idea
      ));
      
      if (selectedIdea && selectedIdea.id === ideaId) {
        setSelectedIdea(prev => ({ ...prev, [field]: value }));
      }
      
      setUpdateMessage('Updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setUpdateMessage('Error updating field');
      setTimeout(() => setUpdateMessage(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (idea.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: ideas.length,
    pending: ideas.filter(idea => idea.status === 'under_review').length,
    approved: ideas.filter(idea => idea.status === 'funded').length,
    rejected: ideas.filter(idea => idea.status === 'rejected').length,
    totalFunding: ideas.reduce((sum, idea) => sum + (idea.fundingAmount || 0), 0)
  };

  if (selectedIdea) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        <section className="relative min-h-screen flex items-start justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
            <Button 
              onClick={() => setSelectedIdea(null)}
              variant="outline"
              className="mb-6 hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Ideas
            </Button>
            
            <div className="bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl rounded-3xl border border-border/30 p-8 shadow-2xl animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">{selectedIdea.title}</h1>
              </div>
              
              <div className="space-y-8">
                {/* Top Section - Submitted Resources Horizontal */}
                {(selectedIdea.demoLink || selectedIdea.pitchDeckUrl || selectedIdea.ppt_Url) && (
                  <div className="bg-gradient-to-br from-slate-50/50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Submitted Resources
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {selectedIdea.demoLink && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Live Demo</span>
                            </div>
                            <button 
                              onClick={() => window.open(selectedIdea.demoLink, '_blank')}
                              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open in new tab
                            </button>
                          </div>
                          <div className="relative h-64 bg-gray-50">
                            <iframe 
                              src={selectedIdea.demoLink.includes('drive.google.com') ? 
                                selectedIdea.demoLink.replace('/view?usp=sharing', '/preview').replace('/edit?usp=sharing', '/preview').replace('/edit', '/preview') :
                                selectedIdea.demoLink
                              }
                              className="w-full h-full border-0"
                              title="Live Demo Preview"
                              sandbox="allow-scripts allow-same-origin allow-forms"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                      
                      {selectedIdea.pitchDeckUrl && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Pitch Deck</span>
                            </div>
                            <button 
                              onClick={() => window.open(selectedIdea.pitchDeckUrl, '_blank')}
                              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open in new tab
                            </button>
                          </div>
                          <div className="relative h-64 bg-gray-50">
                            <iframe 
                              src={selectedIdea.pitchDeckUrl.includes('drive.google.com') ? 
                                selectedIdea.pitchDeckUrl.replace('/view?usp=sharing', '/preview').replace('/edit?usp=sharing', '/preview').replace('/edit', '/preview') :
                                selectedIdea.pitchDeckUrl
                              }
                              className="w-full h-full border-0"
                              title="Pitch Deck Preview"
                              sandbox="allow-scripts allow-same-origin allow-forms"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                      
                      {selectedIdea.ppt_Url && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Presentation</span>
                            </div>
                            <button 
                              onClick={() => window.open(selectedIdea.ppt_Url, '_blank')}
                              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open in new tab
                            </button>
                          </div>
                          <div className="relative h-64 bg-gray-50">
                            <iframe 
                              src={selectedIdea.ppt_Url.includes('drive.google.com') ? 
                                selectedIdea.ppt_Url.replace('/view?usp=sharing', '/preview').replace('/edit?usp=sharing', '/preview').replace('/edit', '/preview') :
                                selectedIdea.ppt_Url
                              }
                              className="w-full h-full border-0"
                              title="Presentation Preview"
                              sandbox="allow-scripts allow-same-origin allow-forms"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Bottom Section - Student Info & Idea Details + Admin Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Side - Student & Idea Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
                      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Student Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-card/30 rounded-xl">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{(selectedIdea.user?.username || 'U')[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Student Name</label>
                            <p className="text-foreground font-medium">{selectedIdea.user?.username || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-card/30 rounded-xl">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Email</label>
                            <p className="text-foreground font-medium">{selectedIdea.user?.email || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-2xl p-6 border border-purple-500/20">
                      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-purple-500" />
                        Idea Details
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-card/30 rounded-xl">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pitch</label>
                          <p className="text-foreground mt-1 leading-relaxed">{selectedIdea.pitch}</p>
                        </div>
                        <div className="p-4 bg-card/30 rounded-xl">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                          <p className="text-foreground mt-1 leading-relaxed">{selectedIdea.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Admin Controls */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-orange-500/5 to-orange-600/10 rounded-2xl p-8 border border-orange-500/20 h-fit">
                      <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-2">
                        <Save className="w-6 h-6 text-orange-500" />
                        Admin Controls
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            Status
                          </label>
                          <Select 
                            value={selectedIdea.status || 'under_review'} 
                            onValueChange={(value) => updateField(selectedIdea.id, 'status', value)}
                            disabled={updating}
                          >
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under_review">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                  Under Review
                                </div>
                              </SelectItem>
                              <SelectItem value="rejected">
                                <div className="flex items-center gap-2">
                                  <X className="w-4 h-4 text-red-500" />
                                  Rejected
                                </div>
                              </SelectItem>
                              <SelectItem value="under_funding">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-blue-500" />
                                  Under Funding
                                </div>
                              </SelectItem>
                              <SelectItem value="funded">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Funded
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Score (1-10)
                          </label>
                          <Select 
                            value={selectedIdea.score?.toString() || ''} 
                            onValueChange={(value) => updateField(selectedIdea.id, 'score', parseInt(value))}
                            disabled={updating}
                          >
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                              <SelectValue placeholder="Select score" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      num <= 3 ? 'bg-red-500' :
                                      num <= 6 ? 'bg-yellow-500' :
                                      num <= 8 ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                    {num}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            Funding Amount
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="number"
                              value={selectedIdea.fundingAmount || ''}
                              onChange={(e) => setSelectedIdea(prev => ({ ...prev, fundingAmount: parseInt(e.target.value) || 0 }))}
                              placeholder="Enter funding amount"
                              disabled={updating}
                              className="h-12 pl-12 bg-card/50 border-border/50 hover:border-primary/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Tags
                          </label>
                          <Input
                            value={selectedIdea.tags || ''}
                            onChange={(e) => setSelectedIdea(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="Enter tags (comma separated)"
                            disabled={updating}
                            className="h-12 bg-card/50 border-border/50 hover:border-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-red-500" />
                          Admin Note
                        </label>
                        <Textarea
                          value={selectedIdea.note || ''}
                          onChange={(e) => setSelectedIdea(prev => ({ ...prev, note: e.target.value }))}
                          placeholder="Add your review notes here..."
                          rows={4}
                          disabled={updating}
                          className="bg-card/50 border-border/50 hover:border-primary/50 transition-all resize-none"
                        />
                      </div>

                      <Button 
                        onClick={() => {
                          updateField(selectedIdea.id, 'fundingAmount', selectedIdea.fundingAmount);
                          updateField(selectedIdea.id, 'tags', selectedIdea.tags);
                          updateField(selectedIdea.id, 'note', selectedIdea.note);
                        }}
                        disabled={updating}
                        className="w-full mt-8 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                      >
                        {updating ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Update Changes
                          </div>
                        )}
                      </Button>

                      {updateMessage && (
                        <div className={`p-4 rounded-xl text-center font-medium animate-fade-up border mt-4 ${
                          updateMessage.includes('Error') 
                            ? 'bg-red-50 text-red-800 border-red-200' 
                            : 'bg-green-50 text-green-800 border-green-200'
                        }`}>
                          <div className="flex items-center justify-center gap-2">
                            {updateMessage.includes('Error') ? (
                              <X className="w-5 h-5" />
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {updateMessage}
                          </div>
                        </div>
                      )}
                    </div>
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
      
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: 'url("/Home-Bg.jpg")' }}></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ADMIN DASHBOARD</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Admin Dashboard
              <br />
              <span className="text-primary italic">Manage & Connect</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Ideas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">${stats.totalFunding.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Funding</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="ideas" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ideas">Ideas Management</TabsTrigger>
                <TabsTrigger value="chat">User Conversations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ideas" className="mt-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <Input
                    placeholder="Search by title or student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="under_funding">Under Funding</SelectItem>
                      <SelectItem value="funded">Funded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={fetchIdeas} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>

                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
                  {loading ? (
                    <div className="text-center py-8">Loading ideas...</div>
                  ) : filteredIdeas.length === 0 ? (
                    <div className="text-center py-8">No ideas found.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Funding</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIdeas.map((idea) => (
                          <TableRow 
                            key={idea.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedIdea(idea)}
                          >
                            <TableCell className="font-medium">{idea.title}</TableCell>
                            <TableCell>{idea.user?.username || 'Unknown'}</TableCell>
                            <TableCell>{idea.user?.email || 'Unknown'}</TableCell>
                            <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                idea.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                idea.status === 'funded' ? 'bg-green-100 text-green-800' :
                                idea.status === 'under_funding' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {(idea.status || 'under_review').replace('_', ' ')}
                              </span>
                            </TableCell>
                            <TableCell>{idea.score || '-'}</TableCell>
                            <TableCell>{idea.fundingAmount ? `$${idea.fundingAmount.toLocaleString()}` : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 h-96 overflow-y-auto">
                      <ConversationList 
                        onSelectConversation={setSelectedConversation}
                        selectedConversation={selectedConversation}
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    {selectedConversation ? (
                      <ChatWindow 
                        receiverId={selectedConversation.partnerId}
                        receiverName={selectedConversation.partnerName}
                        currentUserId={currentUserId}
                      />
                    ) : (
                      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 h-96 flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a conversation to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}

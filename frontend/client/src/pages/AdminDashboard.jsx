import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas from API...');
      const response = await axios.get('https://mindnest-team-async.onrender.com/api/v1/ideas');
      console.log('API Response:', response.data);
      console.log('Ideas found:', response.data.data?.length || 0);
      setIdeas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      console.error('Error details:', error.response?.data);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const [updateMessage, setUpdateMessage] = useState('');

  const updateField = async (ideaId, field, value) => {
    setUpdating(true);
    try {
      await axios.patch(`http://localhost:3002/api/v1/ideas/${ideaId}/${field}`, {
        [field]: value
      });
      
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
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
            <Button 
              onClick={() => setSelectedIdea(null)}
              variant="outline"
              className="mb-6"
            >
              ← Back to Ideas
            </Button>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">{selectedIdea.title}</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Idea Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Student</label>
                      <p className="text-foreground">{selectedIdea.user?.username || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{selectedIdea.user?.email || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pitch</label>
                      <p className="text-foreground">{selectedIdea.pitch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground">{selectedIdea.description}</p>
                    </div>
                    {selectedIdea.demoLink && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Demo Link</label>
                        <a href={selectedIdea.demoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">
                          View Demo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Admin Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Select 
                        value={selectedIdea.status || 'under_review'} 
                        onValueChange={(value) => updateField(selectedIdea.id, 'status', value)}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="under_funding">Under Funding</SelectItem>
                          <SelectItem value="funded">Funded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Score (1-10)</label>
                      <Select 
                        value={selectedIdea.score?.toString() || ''} 
                        onValueChange={(value) => updateField(selectedIdea.id, 'score', parseInt(value))}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select score" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Funding Amount</label>
                      <Input
                        type="number"
                        value={selectedIdea.fundingAmount || ''}
                        onChange={(e) => setSelectedIdea(prev => ({ ...prev, fundingAmount: parseInt(e.target.value) || 0 }))}
                        placeholder="Enter funding amount"
                        disabled={updating}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tags</label>
                      <Input
                        value={selectedIdea.tags || ''}
                        onChange={(e) => setSelectedIdea(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Enter tags (comma separated)"
                        disabled={updating}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admin Note</label>
                      <Textarea
                        value={selectedIdea.note || ''}
                        onChange={(e) => setSelectedIdea(prev => ({ ...prev, note: e.target.value }))}
                        placeholder="Add your review notes here..."
                        rows={4}
                        disabled={updating}
                      />
                    </div>

                    <Button 
                      onClick={() => {
                        updateField(selectedIdea.id, 'fundingAmount', selectedIdea.fundingAmount);
                        updateField(selectedIdea.id, 'tags', selectedIdea.tags);
                        updateField(selectedIdea.id, 'note', selectedIdea.note);
                      }}
                      disabled={updating}
                      className="w-full mt-4"
                    >
                      {updating ? 'Updating...' : 'Update Changes'}
                    </Button>

                    {updateMessage && (
                      <div className={`p-3 rounded-lg text-center font-medium mt-4 ${
                        updateMessage.includes('Error') 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {updateMessage}
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
              Review Ideas &
              <br />
              <span className="text-primary italic">Manage Submissions</span>
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
          </div>
        </div>
      </section>
    </div>
  );
}

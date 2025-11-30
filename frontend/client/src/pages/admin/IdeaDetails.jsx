import React, { useState, useEffect } from 'react';
import SimpleNavigation from '../../components/SimpleNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, ExternalLink, Save, X, Plus } from 'lucide-react';
import { getAuthToken } from '../../services/authService';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const API_BASE_URL = 'https://mindnest-team-async.onrender.com/api/v1';

const IdeaDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState({});
  
  // Admin control states
  const [status, setStatus] = useState('');
  const [score, setScore] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchIdea();
  }, [id]);

  useEffect(() => {
    if (idea) {
      setStatus(idea.status || 'under_review');
      setScore(idea.score?.toString() || '');
      setFundingAmount(idea.fundingAmount?.toString() || '');
      setNote(idea.note || '');
      setTags(idea.tags && Array.isArray(idea.tags) ? idea.tags : []);
    }
  }, [idea]);

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
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch idea';
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

  const updateField = async (field, value, fieldName) => {
    const fieldKey = field === 'status' ? 'status' : field === 'score' ? 'score' : field === 'funding' ? 'fundingAmount' : field === 'note' ? 'note' : 'tags';
    
    try {
      setSaving(prev => ({ ...prev, [field]: true }));
      const token = getAuthToken();
      
      const response = await axios.patch(`${API_BASE_URL}/ideas/${id}/${field}`, 
        { [fieldKey]: value },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Refresh idea data
      await fetchIdea();
      
      toast({
        title: 'Success',
        description: `${fieldName || field} updated successfully`,
      });
      
      console.log(`Admin updated ${field} of idea ${id}`, { value });
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      const errorMsg = err.response?.data?.message || err.message || `Failed to update ${fieldName || field}`;
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      throw err; // Re-throw to allow rollback if needed
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    const previousStatus = status;
    setStatus(newStatus);
    try {
      await updateField('status', newStatus, 'Status');
    } catch {
      // Rollback on error
      setStatus(previousStatus);
    }
  };

  const handleScoreChange = async (newScore) => {
    const previousScore = score;
    setScore(newScore);
    if (newScore) {
      try {
        await updateField('score', parseInt(newScore), 'Score');
      } catch {
        // Rollback on error
        setScore(previousScore);
      }
    }
  };

  const handleFundingChange = async () => {
    if (fundingAmount) {
      const previousAmount = idea?.fundingAmount?.toString() || '';
      try {
        await updateField('funding', parseInt(fundingAmount), 'Funding amount');
      } catch {
        // Rollback on error
        setFundingAmount(previousAmount);
      }
    }
  };

  const handleNoteChange = async () => {
    const previousNote = idea?.note || '';
    try {
      await updateField('note', note, 'Note');
    } catch {
      // Rollback on error
      setNote(previousNote);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      const previousTags = [...tags];
      setTags(updatedTags);
      setNewTag('');
      try {
        await updateField('tags', updatedTags, 'Tags');
      } catch {
        // Rollback on error
        setTags(previousTags);
        setNewTag(newTag.trim());
      }
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const previousTags = [...tags];
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);
    try {
      await updateField('tags', updatedTags, 'Tags');
    } catch {
      // Rollback on error
      setTags(previousTags);
    }
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
              <div className="space-y-3">
                <button 
                  onClick={fetchIdea}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  🔄 Try Again
                </button>
                <button 
                  onClick={() => navigate('/admin/ideas')}
                  className="w-full px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all duration-200 font-semibold"
                >
                  ← Back to Ideas
                </button>
              </div>
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
          onClick={() => navigate('/admin/ideas')}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Ideas</span>
        </button>

        {/* Student Info Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Student Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{idea.user?.username || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <Mail className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{idea.user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Submission Date</p>
                <p className="font-semibold text-foreground">
                  {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
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

        {/* Admin Controls Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Admin Controls</h2>
          
          <div className="space-y-6">
            {/* Status Control */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Status</label>
              <Select value={status} onValueChange={handleStatusChange} disabled={saving.status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under_funding">Under Funding</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Control */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Score (1-10)</label>
              <Select value={score} onValueChange={handleScoreChange} disabled={saving.score}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select score" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Funding Control */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Funding Amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={saving}
                />
                <Button
                  onClick={handleFundingChange}
                  disabled={saving.funding || !fundingAmount}
                  className="px-6 bg-gradient-to-r from-primary to-secondary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving.funding ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Tags Control */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      disabled={saving.tags}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={saving}
                />
                <Button
                  onClick={handleAddTag}
                  disabled={saving.tags || !newTag.trim()}
                  className="px-6 bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {saving.tags ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Admin Notes</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write review notes here..."
                rows={5}
                className="mb-2"
                disabled={saving.note}
              />
              <Button
                onClick={handleNoteChange}
                disabled={saving.note}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving.note ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;


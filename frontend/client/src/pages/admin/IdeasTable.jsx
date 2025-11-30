import React, { useState, useEffect, useCallback } from 'react';
import SimpleNavigation from '../../components/SimpleNavigation';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Users, Calendar, DollarSign, Star, Tag } from 'lucide-react';
import { getAuthToken } from '../../services/authService';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API_BASE_URL = 'https://mindnest-team-async.onrender.com/api/v1';

const IdeasTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    filterAndSortIdeas();
  }, [ideas, debouncedSearchTerm, statusFilter, sortField, sortDirection]);

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

  const filterAndSortIdeas = () => {
    let filtered = [...ideas];

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        idea.user?.username?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        idea.user?.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(idea => idea.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'student':
          aValue = a.user?.username || '';
          bValue = b.user?.username || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'funding':
          aValue = a.fundingAmount || 0;
          bValue = b.fundingAmount || 0;
          break;
        case 'score':
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    setFilteredIdeas(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const paginatedIdeas = filteredIdeas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    const statusMap = {
      'under_review': { bg: 'bg-orange-500', text: 'UNDER REVIEW' },
      'funded': { bg: 'bg-green-500', text: 'FUNDED' },
      'rejected': { bg: 'bg-red-500', text: 'REJECTED' },
      'under_funding': { bg: 'bg-blue-500', text: 'UNDER FUNDING' },
    };
    const statusStyle = statusMap[status] || { bg: 'bg-gray-500', text: status.toUpperCase() };
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${statusStyle.bg}`}>
        {statusStyle.text}
      </span>
    );
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-primary" />
      : <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Ideas</h2>
            <p className="text-muted-foreground">Fetching ideas data...</p>
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            All <span className="text-primary italic">Ideas</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">Review and manage all submitted ideas</p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="bg-card/50 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by title, student name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all md:w-48"
              >
                <option value="all">All Status</option>
                <option value="under_review">Under Review</option>
                <option value="funded">Funded</option>
                <option value="rejected">Rejected</option>
                <option value="under_funding">Under Funding</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Showing <span className="text-primary font-bold">{paginatedIdeas.length}</span> of <span className="text-secondary font-bold">{filteredIdeas.length}</span> ideas
          </p>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-lg border border-border backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('student')}
                  >
                    <div className="flex items-center">
                      Student
                      <SortIcon field="student" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('funding')}
                  >
                    <div className="flex items-center">
                      Funding
                      <SortIcon field="funding" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center">
                      Score
                      <SortIcon field="score" />
                    </div>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIdeas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No ideas found</h3>
                        <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedIdeas.map((idea) => (
                    <TableRow
                      key={idea.id}
                      onClick={() => navigate(`/admin/ideas/${idea.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-semibold text-foreground">{idea.title}</TableCell>
                      <TableCell className="text-muted-foreground">{idea.user?.username || 'Unknown'}</TableCell>
                      <TableCell className="text-muted-foreground">{idea.user?.email || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(idea.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {idea.fundingAmount ? `$${idea.fundingAmount.toLocaleString()}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {idea.score ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {idea.score}/10
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {idea.tags && Array.isArray(idea.tags) && idea.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                {tag}
                              </span>
                            ))}
                            {idea.tags.length > 2 && (
                              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                                +{idea.tags.length - 2}
                              </span>
                            )}
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
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

export default IdeasTable;


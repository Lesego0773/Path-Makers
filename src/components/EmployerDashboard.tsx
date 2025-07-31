import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Filter,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Briefcase,
  TrendingUp,
  Users,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getNearbyWorkers, getJobsByEmployer, createJob, Employer } from '../lib/supabase';

const EmployerDashboard: React.FC = () => {
  const { user, userProfile, userType, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    workerType: 'handy',
    category: 'handy', // Default category to 'handy'
  });
  const [postingJob, setPostingJob] = useState(false);

  // Redirect if not authenticated or not an employer
  if (!user || userType !== 'employer') {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-white/80 mb-6">Please log in as an employer to access this dashboard.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (activeTab === 'search') {
      loadNearbyWorkers();
    } else if (activeTab === 'jobs') {
      loadJobs();
    }
  }, [activeTab, selectedCategory]);

  const loadNearbyWorkers = async () => {
    setIsLoading(true);
    try {
      const workers = await getNearbyWorkers(undefined, selectedCategory);
      setNearbyWorkers(workers || []);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobs = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const jobsData = await getJobsByEmployer(user.id);
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPostingJob(true);
    try {
      await createJob({
        ...newJob,
        budget: parseFloat(newJob.budget),
        employer_id: user.id,
        type: newJob.workerType,
        category: newJob.category || newJob.workerType, // Ensure category is set
        status: 'open', // Set default status
      });
      setShowPostJobModal(false);
      setNewJob({ title: '', description: '', budget: '', location: '', workerType: 'handy', category: 'handy' });
      loadJobs();
      alert('Job posted successfully!');
    } catch (error) {
      alert('Failed to post job.');
    } finally {
      setPostingJob(false);
    }
  };

  const tabs = [
    { id: 'search', label: 'Search Workers', icon: Search },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign }
  ];

  const categories = [
    'all', 'cleaning', 'plumbing', 'electrical', 'gardening', 'painting', 'childcare', 'elderly-care', 'cooking'
  ];

  const filteredWorkers = nearbyWorkers.filter(worker => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.skills.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderWorkerCard = (worker: any) => (
    <div key={worker.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#0FFCBE] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[#106EBE]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">{worker.full_name}</h3>
              {worker.is_verified && (
                <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
              )}
            </div>
            <p className="text-[#0FFCBE] font-medium">{worker.skills.split(',')[0]}</p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm">{worker.rating || 0}</span>
                <span className="text-white/60 text-sm">({worker.completed_jobs || 0} jobs)</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-[#0FFCBE]" />
                <span className="text-white/80 text-sm">{worker.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#0FFCBE] font-bold text-lg">R{Math.floor(Math.random() * 100) + 50}/hr</div>
          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
            worker.availability === 'full-time' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {worker.availability}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <h4 className="text-white font-medium text-sm mb-1">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {worker.skills.split(',').slice(0, 3).map((skill: string, index: number) => (
              <span key={index} className="bg-[#0FFCBE]/20 text-[#0FFCBE] px-2 py-1 rounded-full text-xs">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Experience: </span>
            <span className="text-white">{worker.experience || 'Not specified'}</span>
          </div>
          <div>
            <span className="text-white/60">Jobs: </span>
            <span className="text-white">{worker.completed_jobs || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={() => setSelectedWorker(worker)}
          className="flex-1 bg-[#0FFCBE] text-[#106EBE] px-4 py-2 rounded-lg font-medium hover:bg-[#0FFCBE]/90 transition-all duration-300"
        >
          View Profile
        </button>
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </button>
      </div>
    </div>
  );

  const renderWorkerModal = () => {
    if (!selectedWorker) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#106EBE] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#0FFCBE] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-[#106EBE]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-white">{selectedWorker.full_name}</h2>
                  {selectedWorker.is_verified && (
                    <CheckCircle className="w-6 h-6 text-[#0FFCBE]" />
                  )}
                </div>
                <p className="text-[#0FFCBE] font-medium text-lg">{selectedWorker.skills.split(',')[0]} Specialist</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{selectedWorker.rating || 0}</span>
                    <span className="text-white/60">({selectedWorker.completed_jobs || 0} jobs)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5 text-[#0FFCBE]" />
                    <span className="text-white">{selectedWorker.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedWorker(null)}
              className="text-white/60 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/80">Phone:</span>
                  <span className="text-white">{selectedWorker.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Email:</span>
                  <span className="text-white">{selectedWorker.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Availability:</span>
                  <span className="text-white">{selectedWorker.availability}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Work History</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/80">Jobs Completed:</span>
                  <span className="text-white">{selectedWorker.completed_jobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Rating:</span>
                  <span className="text-white">{selectedWorker.rating || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Verified:</span>
                  <span className={selectedWorker.is_verified ? 'text-green-400' : 'text-yellow-400'}>
                    {selectedWorker.is_verified ? 'Yes' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Skills & Experience</h3>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedWorker.skills.split(',').map((skill: string, index: number) => (
                    <span key={index} className="bg-[#0FFCBE]/20 text-[#0FFCBE] px-3 py-2 rounded-full">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Experience</h4>
                <p className="text-white/80">{selectedWorker.experience || 'No experience details provided.'}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300">
              Hire Now
            </button>
            <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </button>
            <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Call
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search workers by name or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="text-[#106EBE]">
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  
                  <button className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-medium hover:bg-[#0FFCBE]/90 transition-all duration-300 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Available Workers ({filteredWorkers.length} found)
              </h3>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>Showing verified workers</span>
              </div>
            </div>

            {/* Workers Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#0FFCBE] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/80">Loading workers...</p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No workers found</h3>
                <p className="text-white/60">Try adjusting your search criteria or expanding your location range.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkers.map(renderWorkerCard)}
              </div>
            )}
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">My Jobs</h3>
              <button
                className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300"
                onClick={() => setShowPostJobModal(true)}
              >
                Post New Job
              </button>
            </div>
            {/* Post Job Modal */}
            {showPostJobModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                    onClick={() => setShowPostJobModal(false)}
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-[#106EBE]">Post a New Job</h2>
                  <form onSubmit={handlePostJob} className="space-y-4">
                    <div>
                      <label className="block text-[#106EBE] font-semibold mb-1">Job Title</label>
                      <input
                        type="text"
                        required
                        value={newJob.title}
                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#106EBE] font-semibold mb-1">Description</label>
                      <textarea
                        required
                        value={newJob.description}
                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[#106EBE] font-semibold mb-1">Budget (R)</label>
                        <input
                          type="number"
                          required
                          value={newJob.budget}
                          onChange={e => setNewJob({ ...newJob, budget: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[#106EBE] font-semibold mb-1">Location</label>
                        <input
                          type="text"
                          required
                          value={newJob.location}
                          onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#106EBE] font-semibold mb-1">Worker Type</label>
                      <select
                        value={newJob.workerType}
                        onChange={e => setNewJob({ ...newJob, workerType: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="handy">Handy Worker</option>
                        <option value="domestic">Domestic Worker</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={postingJob}
                      className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300 mt-4"
                    >
                      {postingJob ? 'Posting...' : 'Post Job'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#0FFCBE] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/80">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-white/60">Start by posting your first job to find workers.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                        <p className="text-white/80">Worker: {job.worker?.full_name || 'Not assigned'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        job.status === 'assigned' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#0FFCBE]" />
                        <span className="text-white/80">{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-[#0FFCBE]" />
                        <span className="text-white/80">R{job.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#0FFCBE]" />
                        <span className="text-white/80">{job.location}</span>
                      </div>
                    </div>

                    <p className="text-white/80 mb-4">{job.description}</p>

                    <div className="flex space-x-3">
                      <button className="bg-[#0FFCBE] text-[#106EBE] px-4 py-2 rounded-lg font-medium hover:bg-[#0FFCBE]/90 transition-all">
                        View Details
                      </button>
                      <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                        Message Worker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Booking Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Calendar className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{jobs.filter(j => j.status === 'assigned' || j.status === 'in_progress').length}</div>
                <div className="text-white/80 text-sm">Active Bookings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{jobs.filter(j => j.status === 'completed').length}</div>
                <div className="text-white/80 text-sm">Completed This Month</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">R{jobs.reduce((sum, job) => sum + (job.budget || 0), 0)}</div>
                <div className="text-white/80 text-sm">Total Spent</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Bookings</h4>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex justify-between items-center py-3 border-b border-white/10">
                      <div>
                        <p className="text-white font-medium">{job.title}</p>
                        <p className="text-white/60 text-sm">{job.worker?.full_name || 'Not assigned'} • {new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0FFCBE] font-bold">R{job.budget}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          job.status === 'assigned' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Payment History</h3>
              <button
                onClick={signOut}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Total Spent</h4>
                <div className="text-3xl font-bold text-[#0FFCBE]">R{jobs.reduce((sum, job) => sum + (job.budget || 0), 0)}</div>
                <p className="text-white/60 text-sm">All time</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">This Month</h4>
                <div className="text-3xl font-bold text-[#0FFCBE]">R{Math.floor(jobs.reduce((sum, job) => sum + (job.budget || 0), 0) * 0.3)}</div>
                <p className="text-green-400 text-sm">{jobs.filter(j => j.status === 'completed').length} transactions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Pending</h4>
                <div className="text-3xl font-bold text-yellow-400">R{jobs.filter(j => j.status === 'in_progress').reduce((sum, job) => sum + (job.budget || 0), 0)}</div>
                <p className="text-white/60 text-sm">{jobs.filter(j => j.status === 'in_progress').length} jobs in progress</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Transactions</h4>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No payment history available yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.filter(j => j.status === 'completed').slice(0, 5).map((job) => (
                    <div key={job.id} className="flex justify-between items-center py-3 border-b border-white/10">
                      <div>
                        <p className="text-white font-medium">{job.title}</p>
                        <p className="text-white/60 text-sm">{job.worker?.full_name} • {new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0FFCBE] font-bold">R{job.budget}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          paid
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Employer Dashboard</h1>
          <p className="text-xl text-white/80">Welcome back, {userProfile?.full_name}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 m-1 ${
                  activeTab === tab.id
                    ? 'bg-[#0FFCBE] text-[#106EBE] font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>

        {/* Worker Profile Modal */}
        {renderWorkerModal()}
      </div>
    </section>
  );
};

export default EmployerDashboard;
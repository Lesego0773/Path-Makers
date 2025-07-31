import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Clock,
  TrendingUp,
  Award,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateWorkerProfile, verifyWorker, uploadFile, getJobsByWorker, Worker } from '../lib/supabase';

const WorkerDashboard: React.FC = () => {
  const { user, userProfile, userType, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [verificationStep, setVerificationStep] = useState('upload');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Partial<Worker>>({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [jobsTab, setJobsTab] = useState<'all' | 'active' | 'completed'>('all'); // NEW: sub-tab state
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile as Worker);
      if ((userProfile as Worker).is_verified) {
        setVerificationStep('verified');
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (user && activeTab === 'jobs') {
      loadJobs();
    }
  }, [user, activeTab]);

  const loadJobs = async () => {
    if (!user) return;
    try {
      const jobsData = await getJobsByWorker(user.id);
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  // Redirect if not authenticated or not a worker
  if (!user || userType !== 'worker') {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-white/80 mb-6">Please log in as a worker to access this dashboard.</p>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'verify', label: 'Verify', icon: CheckCircle },
    { id: 'jobs', label: 'My Jobs', icon: FileText },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdDocument(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setSelfieImage(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const performFaceVerification = async () => {
    if (!idDocument || !selfieImage || !user) return;

    setIsProcessing(true);
    setVerificationStep('processing');

    try {
      // Upload files
      const idDocumentUrl = await uploadFile(
        idDocument, 
        'documents', 
        `${user.id}/id-document-${Date.now()}.${idDocument.name.split('.').pop()}`
      );
      
      const selfieUrl = await uploadFile(
        selfieImage, 
        'selfies', 
        `${user.id}/selfie-${Date.now()}.jpg`
      );

      // Simulate face recognition processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll simulate a successful match
      const isMatch = Math.random() > 0.2; // 80% success rate for demo
      
      if (isMatch) {
        await verifyWorker(user.id, idDocumentUrl, selfieUrl);
        setVerificationResult('verified');
        setVerificationStep('verified');
        await refreshProfile();
      } else {
        setVerificationResult('failed');
        setVerificationStep('failed');
      }
    } catch (error) {
      console.error('Face verification error:', error);
      setVerificationResult('error');
      setVerificationStep('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateWorkerProfile(user.id, profileData);
      await refreshProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyJob = async (jobId: string) => {
    // TODO: Implement job application logic (call supabase or backend)
    alert(`Applied for job ${jobId}`);
    // Optionally reload jobs
    loadJobs();
  };

  const renderVerificationContent = () => {
    switch (verificationStep) {
      case 'upload':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-[#0FFCBE] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h3>
              <p className="text-white/80">Upload your ID document and take a selfie to get verified</p>
            </div>

            {/* ID Document Upload */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Step 1: Upload ID Document</h4>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                {idDocument ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-[#0FFCBE] mx-auto" />
                    <p className="text-white">ID Document uploaded: {idDocument.name}</p>
                    <button
                      onClick={() => setIdDocument(null)}
                      className="text-[#0FFCBE] hover:text-white transition-colors"
                    >
                      Upload different document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-white/60 mx-auto" />
                    <div>
                      <p className="text-white mb-2">Upload your South African ID or Passport</p>
                      <p className="text-white/60 text-sm">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                    <label className="inline-block bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#0FFCBE]/90 transition-all duration-300">
                      Choose File
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Selfie Capture */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Step 2: Take a Selfie</h4>
              
              {!isCameraActive && !selfieImage && (
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <Camera className="w-12 h-12 text-white/60 mx-auto" />
                    <div>
                      <p className="text-white mb-2">Take a clear selfie for face verification</p>
                      <p className="text-white/60 text-sm">Make sure your face is clearly visible and well-lit</p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {selfieImage && !isCameraActive && (
                <div className="space-y-4 text-center">
                  <CheckCircle className="w-12 h-12 text-[#0FFCBE] mx-auto" />
                  <p className="text-white">Selfie captured successfully!</p>
                  <button
                    onClick={() => {
                      setSelfieImage(null);
                      startCamera();
                    }}
                    className="text-[#0FFCBE] hover:text-white transition-colors"
                  >
                    Take new selfie
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {idDocument && selfieImage && (
              <div className="text-center">
                <button
                  onClick={performFaceVerification}
                  className="bg-[#0FFCBE] text-[#106EBE] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Submit for Verification
                </button>
              </div>
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="animate-spin w-16 h-16 border-4 border-[#0FFCBE] border-t-transparent rounded-full mx-auto"></div>
            <h3 className="text-2xl font-bold text-white">Processing Verification</h3>
            <p className="text-white/80">We're verifying your documents and comparing your selfie with your ID photo. This usually takes 2-5 minutes.</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Document Analysis</span>
                  <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Face Recognition</span>
                  <div className="animate-spin w-5 h-5 border-2 border-[#0FFCBE] border-t-transparent rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Final Review</span>
                  <Clock className="w-5 h-5 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'verified':
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="w-24 h-24 text-[#0FFCBE] mx-auto" />
            <h3 className="text-3xl font-bold text-white">Verification Complete!</h3>
            <p className="text-white/80 text-lg">Your identity has been successfully verified. You can now access all premium features.</p>
            <div className="bg-[#0FFCBE]/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Verification Benefits</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
                  <span className="text-white">Access to premium job opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
                  <span className="text-white">Higher visibility to employers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
                  <span className="text-white">Verified badge on your profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
                  <span className="text-white">Priority customer support</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center space-y-6">
            <AlertCircle className="w-24 h-24 text-red-400 mx-auto" />
            <h3 className="text-3xl font-bold text-white">Verification Failed</h3>
            <p className="text-white/80 text-lg">
              {verificationResult === 'failed' 
                ? "The face in your selfie doesn't match your ID document. Please try again with better lighting."
                : "There was an error processing your verification. Please try again."
              }
            </p>
            <button
              onClick={() => {
                setVerificationStep('upload');
                setIdDocument(null);
                setSelfieImage(null);
                setVerificationResult(null);
              }}
              className="bg-[#0FFCBE] text-[#106EBE] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTabContent = () => {
    const workerProfile = userProfile as Worker;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">R{workerProfile?.completed_jobs * 400 || 0}</div>
                <div className="text-white/80 text-sm">Total Earnings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FileText className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{workerProfile?.completed_jobs || 0}</div>
                <div className="text-white/80 text-sm">Jobs Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Star className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{workerProfile?.rating || 0}</div>
                <div className="text-white/80 text-sm">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Award className="w-8 h-8 text-[#0FFCBE] mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{workerProfile?.is_verified ? 'Verified' : 'Pending'}</div>
                <div className="text-white/80 text-sm">Status</div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Profile Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[#0FFCBE] mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <p className="text-white"><span className="text-white/60">Name:</span> {workerProfile?.full_name}</p>
                    <p className="text-white"><span className="text-white/60">Email:</span> {workerProfile?.email}</p>
                    <p className="text-white"><span className="text-white/60">Phone:</span> {workerProfile?.phone}</p>
                    <p className="text-white"><span className="text-white/60">Location:</span> {workerProfile?.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#0FFCBE] mb-2">Work Information</h4>
                  <div className="space-y-2">
                    <p className="text-white"><span className="text-white/60">Skills:</span> {workerProfile?.skills}</p>
                    <p className="text-white"><span className="text-white/60">Experience:</span> {workerProfile?.experience}</p>
                    <p className="text-white"><span className="text-white/60">Availability:</span> {workerProfile?.availability}</p>
                    <p className="text-white">
                      <span className="text-white/60">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        workerProfile?.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {workerProfile?.is_verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'verify':
        return renderVerificationContent();

      case 'jobs':
        // Filter jobs for sub-tabs
        let filteredJobs = jobs;
        if (jobsTab === 'active') {
          filteredJobs = jobs.filter(job => job.status === 'active' || job.status === 'in_progress');
        } else if (jobsTab === 'completed') {
          filteredJobs = jobs.filter(job => job.status === 'completed' || job.applied === true);
        } // 'all' shows all jobs
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">My Jobs</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-lg transition-all ${jobsTab === 'all' ? 'bg-[#0FFCBE]/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setJobsTab('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-all ${jobsTab === 'active' ? 'bg-[#0FFCBE]/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setJobsTab('active')}
                >
                  Active
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-all ${jobsTab === 'completed' ? 'bg-[#0FFCBE]/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setJobsTab('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs yet</h3>
                <p className="text-white/60">{jobsTab === 'active' ? 'No active jobs available.' : jobsTab === 'completed' ? 'No completed jobs yet.' : 'Complete your verification to start receiving job opportunities.'}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                        <p className="text-white/80">Client: {job.employer?.full_name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                        job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
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
                      {jobsTab === 'active' && (
                        <button
                          className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                          onClick={() => handleApplyJob(job.id)}
                        >
                          Apply
                        </button>
                      )}
                      {job.status === 'completed' && (
                        <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                          Download Invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Earnings Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Total Earnings</h4>
                <div className="text-3xl font-bold text-[#0FFCBE]">R{(workerProfile?.completed_jobs || 0) * 400}</div>
                <p className="text-white/60 text-sm">All time</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">This Month</h4>
                <div className="text-3xl font-bold text-[#0FFCBE]">R{Math.floor((workerProfile?.completed_jobs || 0) * 400 * 0.3)}</div>
                <p className="text-green-400 text-sm">+15% from last month</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Pending Payment</h4>
                <div className="text-3xl font-bold text-yellow-400">R0</div>
                <p className="text-white/60 text-sm">No pending payments</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Payment History</h4>
              <div className="text-center py-8">
                <DollarSign className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No payment history available yet.</p>
                <p className="text-white/60 text-sm">Complete jobs to see your payment history here.</p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Profile Settings</h3>
              <button
                onClick={signOut}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-[#0FFCBE] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#106EBE]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{workerProfile?.full_name}</h4>
                  <p className="text-white/80">{workerProfile?.is_verified ? 'Verified Worker' : 'Pending Verification'}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (workerProfile?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
                      ))}
                    </div>
                    <span className="text-white/80 text-sm">({workerProfile?.rating || 0}/5)</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={profileData.full_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Availability</label>
                    <select 
                      name="availability"
                      value={profileData.availability || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    >
                      <option value="full-time" className="text-[#106EBE]">Full-time</option>
                      <option value="part-time" className="text-[#106EBE]">Part-time</option>
                      <option value="weekends" className="text-[#106EBE]">Weekends only</option>
                      <option value="flexible" className="text-[#106EBE]">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-white font-medium mb-2">Skills</label>
                  <textarea
                    name="skills"
                    value={profileData.skills || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-white font-medium mb-2">Experience</label>
                  <textarea
                    name="experience"
                    value={profileData.experience || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-[#106EBE] border-t-transparent rounded-full mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add Sign Out button to dashboard header
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Worker Dashboard</h2>
          <button
            onClick={signOut}
            className="flex items-center bg-[#0FFCBE] text-[#106EBE] px-5 py-2 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id ? 'bg-[#0FFCBE]/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
};

export default WorkerDashboard;
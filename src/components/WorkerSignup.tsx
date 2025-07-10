import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Upload, Camera, CheckCircle, AlertCircle, Phone, MapPin } from 'lucide-react';
import { signUpWorker, uploadFile, verifyWorker } from '../lib/supabase';

interface WorkerSignupProps {
  onSignupComplete: () => void;
  onLoginClick: () => void;
}

const WorkerSignup: React.FC<WorkerSignupProps> = ({ onSignupComplete, onLoginClick }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    skills: '',
    experience: '',
    availability: 'full-time'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
    if (!idDocument || !selfieImage || !userId) return;

    setIsProcessing(true);

    try {
      // Upload files
      const idDocumentUrl = await uploadFile(
        idDocument, 
        'documents', 
        `${userId}/id-document-${Date.now()}.${idDocument.name.split('.').pop()}`
      );
      
      const selfieUrl = await uploadFile(
        selfieImage, 
        'selfies', 
        `${userId}/selfie-${Date.now()}.jpg`
      );

      // Simulate face recognition processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll simulate a successful match
      const isMatch = Math.random() > 0.2; // 80% success rate for demo
      
      if (isMatch) {
        await verifyWorker(userId, idDocumentUrl, selfieUrl);
        setVerificationResult('verified');
        setCurrentStep(4);
      } else {
        setVerificationResult('failed');
      }
    } catch (error) {
      console.error('Face verification error:', error);
      setVerificationResult('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('Attempting to sign up worker with email:', formData.email)
      const result = await signUpWorker(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills,
        experience: formData.experience,
        availability: formData.availability,
        email: formData.email
      });

      const { user } = result
      
      if (user) {
        setUserId(user.id);
        setCurrentStep(2);
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Worker signup error:', err)
      
      // Handle specific Supabase errors
      if (err.message?.includes('User already registered') || err.code === 'user_already_exists') {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.message?.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else if (err.message?.includes('Password')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(err.message || 'Registration failed. An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleStep2Submit = () => {
    if (!idDocument) {
      setError('Please upload your ID document');
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  const handleStep3Submit = () => {
    if (!selfieImage) {
      setError('Please take a selfie');
      return;
    }
    setError(null);
    performFaceVerification();
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-white font-medium mb-2">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Email Address *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Confirm Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Phone Number *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Location *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
            placeholder="Enter your location"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Skills *</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          rows={3}
          required
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
          placeholder="List your skills (e.g., plumbing, cleaning, cooking)"
        />
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Experience</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
          placeholder="Describe your work experience"
        />
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Availability</label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
        >
          <option value="full-time" className="text-[#106EBE]">Full-time</option>
          <option value="part-time" className="text-[#106EBE]">Part-time</option>
          <option value="weekends" className="text-[#106EBE]">Weekends only</option>
          <option value="flexible" className="text-[#106EBE]">Flexible</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105"
      >
        Continue to Verification
      </button>
    </form>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="text-center">
        <Upload className="w-16 h-16 text-[#0FFCBE] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Upload ID Document</h3>
        <p className="text-white/80">Please upload a clear photo of your ID document</p>
      </div>

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

      {idDocument && (
        <button
          onClick={handleStep2Submit}
          className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Selfie
        </button>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="text-center">
        <Camera className="w-16 h-16 text-[#0FFCBE] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Take a Selfie</h3>
        <p className="text-white/80">Take a clear selfie for face verification</p>
      </div>

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

      {selfieImage && (
        <button
          onClick={handleStep3Submit}
          disabled={isProcessing}
          className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-[#106EBE] border-t-transparent rounded-full mr-2"></div>
              Verifying...
            </div>
          ) : (
            'Verify Identity'
          )}
        </button>
      )}

      {verificationResult === 'failed' && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-white">Face verification failed. Please try again with better lighting.</p>
          <button
            onClick={() => {
              setVerificationResult(null);
              setSelfieImage(null);
            }}
            className="mt-2 text-[#0FFCBE] hover:text-white"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-24 h-24 text-[#0FFCBE] mx-auto" />
      <h3 className="text-3xl font-bold text-white">Account Created Successfully!</h3>
      <p className="text-white/80 text-lg">Your worker account has been verified and is ready to use.</p>
      
      <div className="bg-[#0FFCBE]/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">What's Next?</h4>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
            <span className="text-white">Access to verified job opportunities</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
            <span className="text-white">Build your professional profile</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
            <span className="text-white">Connect with trusted employers</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-[#0FFCBE]" />
            <span className="text-white">Secure payment processing</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSignupComplete}
        className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0FFCBE] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#106EBE]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Worker Account</h1>
            <p className="text-white/80">Join Path-Makers to find work opportunities</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step ? 'bg-[#0FFCBE] text-[#106EBE]' : 'bg-white/20 text-white/60'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-1 mx-2 ${
                      currentStep > step ? 'bg-[#0FFCBE]' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {currentStep < 4 && (
            <div className="mt-8 text-center">
              <p className="text-white/80">
                Already have an account?{' '}
                <button
                  onClick={onLoginClick}
                  className="text-[#0FFCBE] hover:text-white font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkerSignup;
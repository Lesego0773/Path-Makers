import React, { useState } from 'react';
import { User, MapPin, Phone, FileText, Camera, CheckCircle, ArrowRight } from 'lucide-react';
import { signUpWorker } from '../lib/supabase';

interface WorkerSectionProps {
  onRegisterComplete: () => void;
}

const WorkerSection: React.FC<WorkerSectionProps> = ({ onRegisterComplete }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await signUpWorker(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills,
        experience: formData.experience,
        availability: formData.availability,
        email: formData.email
      });

      onRegisterComplete();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Access to verified job opportunities',
    'Fair and transparent payment',
    'Skills development programs',
    'Community support network',
    'Micro-insurance options',
    'Financial literacy training'
  ];

  const steps = [
    { icon: User, title: 'Register', description: 'Create your worker profile' },
    { icon: Camera, title: 'Verify', description: 'Complete identity verification' },
    { icon: FileText, title: 'Skills Assessment', description: 'Showcase your abilities' },
    { icon: CheckCircle, title: 'Get Hired', description: 'Start earning with verified jobs' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Join Path-Makers as a Worker</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Take control of your career with dignified work opportunities, fair pay, 
            and the support you need to succeed.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#0FFCBE] text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative">
                    <div className="w-20 h-20 bg-[#0FFCBE] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-[#106EBE]" />
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="absolute top-10 -right-4 w-6 h-6 text-[#0FFCBE] hidden md:block" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Worker Registration</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your location"
                />
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
                disabled={isLoading}
                className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin w-6 h-6 border-2 border-[#106EBE] border-t-transparent rounded-full"></div>
                ) : (
                  'Register as Worker'
                )}
              </button>
            </form>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Worker Benefits</h2>
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#0FFCBE] mt-1 flex-shrink-0" />
                  <span className="text-white/90 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[#0FFCBE] mb-4">Community Hub Support</h3>
              <p className="text-white/80 mb-4">
                Don't have a smartphone? No problem! Visit our community hubs where our staff 
                will help you register, find jobs, and communicate with employers.
              </p>
              <div className="flex items-center space-x-2 text-white/90">
                <MapPin className="w-5 h-5 text-[#0FFCBE]" />
                <span>Find hubs in Johannesburg, Cape Town, and Durban</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkerSection;
import React, { useState } from 'react';
import { Briefcase, Search, Star, Shield, Clock, DollarSign } from 'lucide-react';

const EmployerSection: React.FC = () => {
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'cleaning',
    description: '',
    location: '',
    budget: '',
    duration: 'one-time',
    urgency: 'flexible'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    { icon: Shield, title: 'Verified Workers', description: 'All workers undergo multi-layer verification' },
    { icon: Star, title: 'Rated Professionals', description: 'Choose from highly-rated service providers' },
    { icon: Clock, title: 'Quick Matching', description: 'Get matched with available workers instantly' },
    { icon: DollarSign, title: 'Transparent Pricing', description: 'Clear pricing with no hidden fees' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Find Trusted Workers</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Connect with verified, skilled professionals for all your handy work and domestic service needs. 
            Safe, reliable, and convenient.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                <Icon className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Job Posting Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Post a Job</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="e.g., House Cleaning, Plumbing Repair"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Service Category</label>
                <select
                  name="category"
                  value={jobForm.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                >
                  <option value="cleaning" className="text-[#106EBE]">Cleaning</option>
                  <option value="plumbing" className="text-[#106EBE]">Plumbing</option>
                  <option value="electrical" className="text-[#106EBE]">Electrical</option>
                  <option value="painting" className="text-[#106EBE]">Painting</option>
                  <option value="gardening" className="text-[#106EBE]">Gardening</option>
                  <option value="cooking" className="text-[#106EBE]">Cooking</option>
                  <option value="childcare" className="text-[#106EBE]">Childcare</option>
                  <option value="elderly-care" className="text-[#106EBE]">Elderly Care</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Job Description</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Describe what you need done..."
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobForm.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Budget (ZAR)</label>
                  <input
                    type="number"
                    name="budget"
                    value={jobForm.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="e.g., 400"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Job Type</label>
                  <select
                    name="duration"
                    value={jobForm.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  >
                    <option value="one-time" className="text-[#106EBE]">One-time</option>
                    <option value="recurring" className="text-[#106EBE]">Recurring</option>
                    <option value="project" className="text-[#106EBE]">Project-based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Urgency</label>
                <select
                  name="urgency"
                  value={jobForm.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                >
                  <option value="flexible" className="text-[#106EBE]">Flexible timing</option>
                  <option value="this-week" className="text-[#106EBE]">This week</option>
                  <option value="urgent" className="text-[#106EBE]">Urgent (24-48 hours)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105"
              >
                Post Job
              </button>
            </form>
          </div>

          {/* Search Workers & Pricing */}
          <div className="space-y-8">
            {/* Search Workers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Search Workers</h2>
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="Search by skill or location..."
                  />
                </div>
                <button className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-3 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300">
                  Search Workers
                </button>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Premium Features</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Background-checked workers</span>
                    <span className="text-[#0FFCBE]">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Priority job matching</span>
                    <span className="text-[#0FFCBE]">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">24/7 support</span>
                    <span className="text-[#0FFCBE]">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Transparent Pricing</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-white">Service Fee</span>
                  <span className="text-[#0FFCBE] font-semibold">R50 per job</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-white">Worker Commission</span>
                  <span className="text-[#0FFCBE] font-semibold">10% (paid by worker)</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white">Premium Access</span>
                  <span className="text-[#0FFCBE] font-semibold">R200/month</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#0FFCBE]/20 rounded-lg">
                <p className="text-white/90 text-sm">
                  <strong>No hidden fees!</strong> What you see is what you pay. 
                  Workers set their own rates, and you know the total cost upfront.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerSection;
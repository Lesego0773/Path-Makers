import React from 'react';
import { ArrowRight, CheckCircle, Users, Briefcase, Shield } from 'lucide-react';

interface HeroProps {
  onJoinAsWorker: () => void;
  onFindWorkers: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinAsWorker, onFindWorkers }) => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Connecting 
                <span className="text-[#0FFCBE] block">Handy & Domestic</span>
                Workers with Opportunities
              </h1>
              <p className="text-xl text-white/90 mt-6 leading-relaxed">
                Empowering individuals seeking employment while providing employers with 
                a trustworthy source for skilled and vetted workers.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4">
              {[
                'Verified and trusted workers',
                'Secure payment processing',
                'Community-centered approach',
                'Skills development programs'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#0FFCBE] mt-1 flex-shrink-0" />
                  <span className="text-white/90 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onFindWorkers}
                className="bg-[#0FFCBE] text-[#106EBE] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Find Workers
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onJoinAsWorker}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#106EBE] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Join as Worker
              </button>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <Users className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Skilled Workers</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105 mt-8">
              <Briefcase className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-white/80">Jobs Completed</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105 -mt-8">
              <Shield className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80">Verified</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CheckCircle className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
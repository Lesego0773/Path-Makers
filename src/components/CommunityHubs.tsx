import React from 'react';
import { MapPin, Clock, Phone, Users, Wifi, BookOpen, Heart } from 'lucide-react';

const CommunityHubs: React.FC = () => {
  const hubs = [
    {
      name: 'Johannesburg Hub',
      address: '123 Main Street, Soweto, Johannesburg',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      phone: '+27 11 123 4567',
      services: ['Registration', 'Job Matching', 'Skills Training', 'Financial Literacy']
    },
    {
      name: 'Cape Town Hub',
      address: '456 Community Road, Khayelitsha, Cape Town',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      phone: '+27 21 123 4567',
      services: ['Registration', 'Job Matching', 'Skills Training', 'Insurance Help']
    },
    {
      name: 'Durban Hub',
      address: '789 Unity Avenue, Umlazi, Durban',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      phone: '+27 31 123 4567',
      services: ['Registration', 'Job Matching', 'Micro-finance', 'Career Counseling']
    }
  ];

  const partners = [
    { name: 'Local Churches', icon: Heart, description: 'Community outreach and support' },
    { name: 'NGOs', icon: Users, description: 'Skills development partnerships' },
    { name: 'Community Centers', icon: MapPin, description: 'Local gathering spaces' },
    { name: 'Vocational Schools', icon: BookOpen, description: 'Training and certification' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Community Hubs</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Physical locations where workers can access our services, get help with registration, 
            and receive support - even without smartphones or internet access.
          </p>
        </div>

        {/* Hub Locations */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {hubs.map((hub, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-[#0FFCBE] mb-6">{hub.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0FFCBE] mt-1 flex-shrink-0" />
                  <span className="text-white/90">{hub.address}</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#0FFCBE] mt-1 flex-shrink-0" />
                  <span className="text-white/90">{hub.hours}</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#0FFCBE] mt-1 flex-shrink-0" />
                  <span className="text-white/90">{hub.phone}</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Services Available</h4>
                <div className="space-y-2">
                  {hub.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#0FFCBE] rounded-full"></div>
                      <span className="text-white/80">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How Hubs Work */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Community Hubs Work</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#0FFCBE] mb-6">For Workers Without Smartphones</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#0FFCBE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#106EBE] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Visit a Hub</h4>
                    <p className="text-white/80">Come to any of our community hubs during operating hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#0FFCBE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#106EBE] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Get Help Registering</h4>
                    <p className="text-white/80">Our staff will help you create your profile and verify your identity</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#0FFCBE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#106EBE] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Receive Job Alerts</h4>
                    <p className="text-white/80">Get notified of jobs via SMS or return to the hub to check opportunities</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <Wifi className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Free Internet</h4>
                <p className="text-white/80 text-sm">Access our platform online</p>
              </div>
              
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Staff Support</h4>
                <p className="text-white/80 text-sm">Dedicated help available</p>
              </div>
              
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <BookOpen className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Skills Training</h4>
                <p className="text-white/80 text-sm">Improve your abilities</p>
              </div>
              
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <Heart className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Community</h4>
                <p className="text-white/80 text-sm">Connect with others</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Community Partners</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {partners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                >
                  <Icon className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{partner.name}</h3>
                  <p className="text-white/80 text-sm">{partner.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHubs;
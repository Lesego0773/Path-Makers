import React from 'react';
import { Wrench, Home, Paintbrush, Zap, Trees, Users, Baby, HeartHandshake } from 'lucide-react';

const Services: React.FC = () => {
  const handyServices = [
    { icon: Wrench, title: 'Plumbing', description: 'Expert plumbing repairs and installations' },
    { icon: Zap, title: 'Electrical', description: 'Safe electrical work and maintenance' },
    { icon: Paintbrush, title: 'Painting', description: 'Professional interior and exterior painting' },
    { icon: Trees, title: 'Gardening', description: 'Garden maintenance and landscaping' },
  ];

  const domesticServices = [
    { icon: Home, title: 'Cleaning', description: 'Thorough home and office cleaning' },
    { icon: Users, title: 'Cooking', description: 'Meal preparation and catering services' },
    { icon: Baby, title: 'Childcare', description: 'Trusted childcare and babysitting' },
    { icon: HeartHandshake, title: 'Elderly Care', description: 'Compassionate care for seniors' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We connect you with skilled professionals across handy work and domestic services, 
            ensuring quality and reliability in every job.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Handy Work Services */}
          <div>
            <h3 className="text-2xl font-bold text-[#0FFCBE] mb-8 text-center">Handy Work</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {handyServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Icon className="w-12 h-12 text-[#0FFCBE] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-semibold text-white mb-2">{service.title}</h4>
                    <p className="text-white/80">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domestic Services */}
          <div>
            <h3 className="text-2xl font-bold text-[#0FFCBE] mb-8 text-center">Domestic Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {domesticServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Icon className="w-12 h-12 text-[#0FFCBE] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-semibold text-white mb-2">{service.title}</h4>
                    <p className="text-white/80">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
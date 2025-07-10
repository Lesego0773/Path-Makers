import React from 'react';
import { Target, Eye, Heart, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect individuals seeking informal work with suitable opportunities by leveraging technology and community partnerships.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading platform for handy and informal domestic work, fostering economic empowerment, security, and dignity.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in dignity, fairness, security, and creating opportunities for everyone in the informal labor market.'
    }
  ];

  const achievements = [
    'Multi-layered worker verification system',
    'Community hub partnerships across South Africa',
    'Micro-insurance and benefits integration',
    'Financial literacy and skills development programs'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">About Path-Makers</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We're more than just a platform - we're a movement towards dignified work, 
            fair opportunities, and stronger communities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-[#0FFCBE] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-[#106EBE]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-white/80 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Why Choose Path-Makers?</h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                We address the unique challenges of the informal labor market through innovative 
                solutions that benefit both workers and employers. Our comprehensive approach 
                ensures safety, reliability, and growth opportunities for all.
              </p>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-[#0FFCBE] mt-1 flex-shrink-0" />
                    <span className="text-white/90">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#0FFCBE] mb-2">R20,000</div>
                <div className="text-white/80">Monthly Job Value</div>
              </div>
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#0FFCBE] mb-2">50</div>
                <div className="text-white/80">Jobs per Month</div>
              </div>
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#0FFCBE] mb-2">R3,500</div>
                <div className="text-white/80">Monthly Revenue</div>
              </div>
              <div className="bg-[#0FFCBE]/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-[#0FFCBE] mb-2">5</div>
                <div className="text-white/80">Dedicated Founders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
import React from 'react';
import { Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    'For Workers': [
      'Register as Worker',
      'Find Jobs',
      'Skills Training',
      'Worker Benefits',
      'Community Hubs'
    ],
    'For Employers': [
      'Post a Job',
      'Find Workers',
      'Pricing',
      'Safety & Security',
      'Premium Features'
    ],
    'Company': [
      'About Us',
      'Our Mission',
      'Community Impact',
      'Careers',
      'Press'
    ],
    'Support': [
      'Help Center',
      'Contact Us',
      'Live Chat',
      'Report Issue',
      'Safety Guidelines'
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-[#106EBE]/95 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0FFCBE] rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-7 h-7 text-[#106EBE]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Path-Makers</h3>
                  <p className="text-[#0FFCBE] text-sm">Connecting Opportunities</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Empowering individuals seeking employment in handy work and domestic services 
                while providing employers with trusted, verified professionals.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#0FFCBE]" />
                  <span className="text-white/80">support@pathmakers.co.za</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#0FFCBE]" />
                  <span className="text-white/80">+27 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-[#0FFCBE]" />
                  <span className="text-white/80">Johannesburg, South Africa</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold text-white mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-white/70 hover:text-[#0FFCBE] transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-white/70 text-sm">
              © 2025 Path-Makers. All rights reserved. | 
              <a href="#" className="hover:text-[#0FFCBE] ml-1">Privacy Policy</a> | 
              <a href="#" className="hover:text-[#0FFCBE] ml-1">Terms of Service</a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#0FFCBE] hover:bg-white/20 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex space-x-6 text-sm text-white/70">
              <span>50+ Workers</span>
              <span>200+ Jobs Completed</span>
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact Bar */}
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
            <span className="text-white font-medium">Emergency Support Available 24/7:</span>
            <span className="text-[#0FFCBE] font-bold">+27 11 EMERGENCY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
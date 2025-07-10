import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: '+27 11 123 4567',
      description: 'Available Monday - Friday, 8AM - 6PM'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@pathmakers.co.za',
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Head Office',
      details: '123 Business Park, Johannesburg',
      description: 'South Africa, 2000'
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      details: 'Mon-Fri: 8AM-6PM',
      description: 'Saturday: 9AM-4PM'
    }
  ];

  const supportOptions = [
    { title: 'For Workers', description: 'Registration help, job search, payments' },
    { title: 'For Employers', description: 'Hiring support, worker verification, billing' },
    { title: 'Technical Issues', description: 'Platform problems, login issues, bugs' },
    { title: 'Partnership', description: 'Community partnerships, business inquiries' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Get in touch with our support team. We're here to help workers and employers 
            make the most of the Path-Makers platform.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                <Icon className="w-12 h-12 text-[#0FFCBE] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-[#0FFCBE] font-medium mb-1">{info.details}</p>
                <p className="text-white/80 text-sm">{info.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                >
                  <option value="general" className="text-[#106EBE]">General Inquiry</option>
                  <option value="worker-support" className="text-[#106EBE]">Worker Support</option>
                  <option value="employer-support" className="text-[#106EBE]">Employer Support</option>
                  <option value="technical" className="text-[#106EBE]">Technical Issue</option>
                  <option value="partnership" className="text-[#106EBE]">Partnership</option>
                  <option value="feedback" className="text-[#106EBE]">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                Send Message
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Support Options & FAQ */}
          <div className="space-y-8">
            {/* Support Categories */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How Can We Help?</h2>
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <div
                    key={index}
                    className="border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold text-[#0FFCBE] mb-2">{option.title}</h3>
                    <p className="text-white/80">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full bg-[#0FFCBE]/20 text-white px-6 py-4 rounded-lg font-medium hover:bg-[#0FFCBE]/30 transition-all duration-300 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3 text-[#0FFCBE]" />
                  Live Chat Support
                </button>
                
                <button className="w-full bg-[#0FFCBE]/20 text-white px-6 py-4 rounded-lg font-medium hover:bg-[#0FFCBE]/30 transition-all duration-300 flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-[#0FFCBE]" />
                  Schedule a Call
                </button>
                
                <button className="w-full bg-[#0FFCBE]/20 text-white px-6 py-4 rounded-lg font-medium hover:bg-[#0FFCBE]/30 transition-all duration-300 flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-[#0FFCBE]" />
                  Find Nearest Hub
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Emergency Support</h3>
              <p className="text-white/80 mb-4">
                For urgent safety concerns or disputes requiring immediate attention:
              </p>
              <p className="text-[#0FFCBE] font-semibold text-lg">+27 11 EMERGENCY (24/7)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
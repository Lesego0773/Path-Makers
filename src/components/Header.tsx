import React, { useState } from 'react';
import { Menu, X, Users, Briefcase, Building, Phone, User, LogIn } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Building },
    { id: 'community', label: 'Community Hubs', icon: Building },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const authItems = [
    { id: 'worker-auth', label: 'Worker Login', icon: User },
    { id: 'employer-auth', label: 'Employer Login', icon: Briefcase },
  ];

  return (
    <header className="bg-[#106EBE]/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveSection('home')}>
            <img src="/logo-transparent.png" alt="Path-Makers Logo" className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Path-Makers</h1>
              <p className="text-[#0FFCBE] text-xs">Connecting Opportunities</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Main Menu Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-[#0FFCBE] text-[#106EBE] font-medium'
                      : 'text-white hover:bg-white/10 hover:text-[#0FFCBE]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Join as Worker Button */}
            <button
              onClick={() => setActiveSection('worker-auth')}
              className="bg-[#0FFCBE] text-[#106EBE] px-4 py-2 rounded-lg font-semibold hover:bg-[#0FFCBE]/90 transition-all duration-300 flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Join as Worker</span>
            </button>

            {/* Find Workers Button */}
            <button
              onClick={() => setActiveSection('employer-auth')}
              className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#106EBE] transition-all duration-300 flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Workers</span>
            </button>
            
            {/* Login Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 hover:text-[#0FFCBE] transition-all duration-300">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#0FFCBE]/20 transition-all duration-300 first:rounded-t-lg last:rounded-b-lg ${
                        activeSection === item.id
                          ? 'bg-[#0FFCBE]/30 text-[#106EBE] font-medium'
                          : 'text-[#106EBE]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-[#0FFCBE] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4">
            <div className="space-y-2">
              {/* Main Menu Items */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-[#0FFCBE] text-[#106EBE] font-medium'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Action Buttons */}
              <div className="border-t border-white/20 pt-4 mt-4">
                <button
                  onClick={() => {
                    setActiveSection('worker-auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-[#0FFCBE] text-[#106EBE] px-4 py-3 rounded-lg font-semibold mb-2 flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Join as Worker</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('employer-auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full border-2 border-white text-white px-4 py-3 rounded-lg font-semibold mb-4 flex items-center justify-center space-x-2"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Find Workers</span>
                </button>
              </div>

              {/* Mobile Auth Items */}
              <div className="border-t border-white/20 pt-4">
                <p className="text-white/60 text-sm mb-2 px-4">Login Options:</p>
                {authItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-[#0FFCBE] text-[#106EBE] font-medium'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
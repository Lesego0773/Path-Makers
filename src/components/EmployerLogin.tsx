import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { signInUser } from '../lib/supabase';

interface EmployerLoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const EmployerLogin: React.FC<EmployerLoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); 

    try {
      console.log('Attempting to sign in employer with email:', formData.email);
      const { user } = await signInUser(formData.email, formData.password);
      
      if (!user) {
        throw new Error('Login failed. Please check your credentials.')
      }
      
      // Check if user is an employer
      const userType = user.user_metadata?.user_type
      if (userType && userType !== 'employer') {
        throw new Error('This account is registered as a worker. Please use the worker login.')
      }
      
      onLoginSuccess();
    } catch (err: any) {
      console.error('Employer login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0FFCBE] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-[#106EBE]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Employer Login</h1>
            <p className="text-white/80">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#0FFCBE] focus:border-transparent"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-white/30 text-[#0FFCBE] focus:ring-[#0FFCBE]" />
                <span className="ml-2 text-white/80 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-[#0FFCBE] hover:text-white text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0FFCBE] text-[#106EBE] px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#0FFCBE]/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin w-6 h-6 border-2 border-[#106EBE] border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Sign In
                  <LogIn className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <button
                onClick={onSignupClick}
                className="text-[#0FFCBE] hover:text-white font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerLogin;
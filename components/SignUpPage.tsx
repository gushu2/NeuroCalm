
import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, ArrowRight, Loader2, FileBadge } from 'lucide-react';
import { authService } from '../services/authService';

interface SignUpPageProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (error) setError('');
  };

  const validateEmail = (email: string): boolean => {
    // 1. Length Check (Max 30 characters total)
    if (email.length > 30) return false;

    // 2. Format & Character Check
    // ^[a-zA-Z0-9]       -> Must start with a letter or number
    // [a-zA-Z0-9._]*     -> Only letters, numbers, dots, and underscores allowed
    // @gmail\.com$       -> Must end with @gmail.com
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]*@gmail\.com$/;
    
    if (!emailRegex.test(email)) return false;

    // Double check for spaces (Regex handles it, but explicit check for safety)
    if (email.includes(' ')) return false;

    return true;
  };

  const validatePassword = (password: string): boolean => {
    // 1. Minimum Length
    if (password.length < 8) return false;

    // 2. No Spaces
    if (/\s/.test(password)) return false;

    // 3. Complexity Checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&#]/.test(password); // e.g. @, #, $, etc.

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) return false;

    // 4. Weak Password Check (Not easily guessable)
    const weakPasswords = ["password", "123456", "12345678", "admin123", "qwerty"];
    if (weakPasswords.some(w => password.toLowerCase().includes(w))) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic Field check
    if (!formData.name || !formData.usn || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // --- EMAIL VALIDATION ---
    if (!validateEmail(formData.email)) {
        setError('Please enter a valid Gmail address.');
        return;
    }

    // --- PASSWORD VALIDATION ---
    if (!validatePassword(formData.password)) {
        setError('Please enter a strong password that meets the criteria.');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(
        formData.name,
        formData.usn,
        formData.email,
        formData.password
      );

      if (response.success) {
        setSuccessMsg('Registration successful!');
        setTimeout(() => {
            onRegister();
        }, 1000);
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner ring-1 ring-white/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Join NeuroCalm</h1>
            <p className="text-emerald-50 mt-1 text-xs font-medium opacity-90">Create your wellness profile</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">USN / ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileBadge className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="4MW23CS..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Gmail Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="student@gmail.com"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 ml-1">Must be @gmail.com, max 30 chars, no special chars.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
               <p className="text-[10px] text-slate-400 mt-1 ml-1">Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2 animate-fade-in font-medium">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="text-emerald-600 text-xs bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2 animate-fade-in font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-emerald-500/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <button 
                onClick={onNavigateToLogin} 
                className="text-emerald-600 font-semibold hover:text-emerald-700 hover:text-emerald-700 hover:underline transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

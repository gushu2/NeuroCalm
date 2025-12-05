import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, ArrowRight, Loader2, FileBadge, Activity, CheckCircle2 } from 'lucide-react';
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
    if (email.length > 30) return false;
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]*@gmail\.com$/;
    if (!emailRegex.test(email)) return false;
    if (email.includes(' ')) return false;
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false;
    if (/\s/.test(password)) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&#]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) return false;

    const weakPasswords = ["password", "123456", "12345678", "admin123", "qwerty"];
    if (weakPasswords.some(w => password.toLowerCase().includes(w))) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.usn || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(formData.email)) {
        setError('Please enter a valid Gmail address.');
        return;
    }

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
        }, 1500);
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
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-stone-900">
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-stone-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden m-4 border border-white/20">
        
        {/* Left Side: Brand Visuals */}
        <div className="lg:w-5/12 bg-gradient-to-br from-stone-900 to-stone-800 text-white p-12 flex flex-col justify-between relative overflow-hidden order-last lg:order-first">
           <div className="absolute top-0 left-0 w-full h-full">
               <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <defs>
                   <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                   </pattern>
                 </defs>
                 <rect width="100" height="100" fill="url(#grid)" />
               </svg>
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-tr from-orange-400 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-wide">NeuroCalm</span>
              </div>
              
              <h1 className="text-3xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-200">
                Join the Future of<br/> Student Wellness.
              </h1>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Create your account to access real-time stress monitoring, AI coaching, and personalized wellness plans designed for academic success.
              </p>

              <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                      <div className="p-1 rounded-full bg-orange-500/20 text-orange-400"><CheckCircle2 className="w-4 h-4" /></div>
                      <span>Real-time Heart Rate Analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                      <div className="p-1 rounded-full bg-orange-500/20 text-orange-400"><CheckCircle2 className="w-4 h-4" /></div>
                      <span>Personalized Yoga & Music</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                      <div className="p-1 rounded-full bg-orange-500/20 text-orange-400"><CheckCircle2 className="w-4 h-4" /></div>
                      <span>Offline First & Privacy Focused</span>
                  </div>
              </div>
           </div>

           <div className="relative z-10 mt-12 text-xs text-stone-500 font-medium">
              © 2025 NeuroCalm System
           </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Create Account</h2>
                <p className="text-stone-500 text-sm mt-1">Register with your student details to begin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                                placeholder="John Doe"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 ml-1">USN / ID</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FileBadge className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="text"
                                name="usn"
                                value={formData.usn}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                                placeholder="4MW23CS..."
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 ml-1">Gmail Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                            placeholder="student@gmail.com"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-[10px] text-stone-400 ml-1">Must be @gmail.com</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-[10px] text-stone-400 ml-1">Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special.</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 ml-1">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2 border border-red-100 animate-fade-in">
                        <Activity className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                )}
                
                {successMsg && (
                    <div className="p-3 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg flex items-center gap-2 border border-orange-100 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMsg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 transform active:scale-[0.98] mt-2"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-stone-500">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
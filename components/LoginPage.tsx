
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Activity, Wifi, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLogin: (role: 'student' | 'admin') => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Strict Google Email Validator (Matching Registration Logic)
  const isValidGoogleEmail = (email: string) => {
    // 1. Length Check
    if (email.length > 30) return false;
    // 2. Format: Alphanumeric start, only . _ allowed special chars, ends in @gmail.com
    const googleEmailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]*@gmail\.com$/;
    return googleEmailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Strict Input Validation
    if (!email.trim()) {
        setError('Email address is required.');
        return;
    }
    
    if (!password.trim()) {
        setError('Password is required.');
        return;
    }

    if (!isValidGoogleEmail(email.trim())) {
        setError('Please enter a valid Gmail address.');
        return;
    }

    setIsLoading(true);

    try {
      // 2. Call Authentication Service (Simulating Google Identity API)
      const response = await authService.login(email, password);
      
      if (response.success && response.user) {
        onLogin(response.user.role);
      } else {
        setError(response.error || 'Authentication failed. Verify credentials.');
      }
    } catch (err) {
      setError('Network Error: Unable to reach Google Identity servers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    
    try {
      const response = await authService.googleLogin();
      if (response.success && response.user) {
        onLogin(response.user.role);
      } else {
        setError(response.error || 'Google Sign-In failed');
      }
    } catch (err) {
      setError('Unable to connect to Google OAuth service.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      
      {/* Left Column: Key Features Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative flex-col justify-between p-16 overflow-hidden">
        
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad)" />
             <defs>
               <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                 <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
               </linearGradient>
             </defs>
           </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">NeuroCalm</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-6">
            Intelligent Stress <br/> Monitoring & Regulation
          </h1>
          <p className="text-slate-400 text-lg mb-12 max-w-md">
            Secure, real-time bio-feedback analysis for student wellness powered by AI.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
               <CheckCircle2 className="w-6 h-6 text-blue-500 mt-1" />
               <div>
                 <h3 className="font-semibold">Secure Authentication</h3>
                 <p className="text-sm text-slate-400">Powered by Google Identity Platform.</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <Wifi className="w-6 h-6 text-emerald-500 mt-1" />
               <div>
                 <h3 className="font-semibold">Real-time IoT Sync</h3>
                 <p className="text-sm text-slate-400">Instant ESP32 Sensor Data Processing.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono">
           System Status: Online | v2.4.0
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="max-w-md w-full">
           {/* Mobile Header */}
           <div className="lg:hidden mb-8 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900">NeuroCalm</h2>
           </div>

           <div className="mb-8">
             <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
             <p className="text-slate-500 mt-2 text-sm">Please sign in with your Google Account</p>
           </div>

           {/* Google Sign In */}
           <button 
             onClick={handleGoogleLogin}
             disabled={isLoading || isGoogleLoading}
             className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-6 relative shadow-sm"
           >
              {isGoogleLoading ? (
                 <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </>
              )}
           </button>

           <div className="relative mb-6">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-slate-200"></div>
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-white text-slate-500">Or sign in with email</span>
             </div>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Google Email Address</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                 </div>
                 <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="student@gmail.com"
                    disabled={isLoading || isGoogleLoading}
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                 </div>
                 <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    disabled={isLoading || isGoogleLoading}
                 />
               </div>
             </div>

             {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 animate-fade-in">
                    <Activity className="w-4 h-4" /> {error}
                </div>
             )}

             <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
             </button>
           </form>

           <div className="mt-6 text-center text-sm text-slate-500">
             Don't have an account? <button onClick={onNavigateToSignup} className="text-blue-600 font-semibold hover:underline">Register</button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <div className="inline-block px-3 py-1 bg-slate-50 rounded text-xs text-slate-400 border border-slate-200 font-mono">
                API Key: AIzaSyD... (Simulated)
             </div>
             <p className="text-[10px] text-slate-400 mt-2">
                Use <b>admin@gmail.com</b> / <b>admin</b> for Demo Admin Access
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

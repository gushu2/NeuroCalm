import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Activity, Brain, Music, Wifi } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'student' | 'admin') => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple mock authentication logic
      if (email.toLowerCase().includes('admin')) {
        if (password === 'admin') {
          onLogin('admin');
        } else {
          setError('Invalid admin credentials (try password: admin)');
        }
      } else {
        // Default to student for any other input (for demo purposes)
        if (password.length > 0) {
            onLogin('student');
        } else {
            setError('Please enter a password');
        }
      }
    }, 1000);
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
            Empowering students with real-time bio-feedback and AI-driven wellness interventions.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                <Wifi className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">IoT Connectivity</h3>
                <p className="text-slate-400 text-sm mt-1">Seamless ESP32 integration for precise, real-time heart rate data collection.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Analysis Engine</h3>
                <p className="text-slate-400 text-sm mt-1">Advanced algorithms instantly classify stress levels (Normal, Mild, High).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <Music className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Wellness Toolkit</h3>
                <p className="text-slate-400 text-sm mt-1">Automated, personalized recommendations for Yoga poses and Lo-Fi music therapy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
           © 2025 NeuroCalm. Optimized for ESP32 DevKit & Chrome Desktop.
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
             <p className="text-slate-500 text-sm">Student Wellness Portal</p>
           </div>

           <div className="mb-8">
             <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
             <p className="text-slate-500 mt-2 text-sm">Access your wellness dashboard</p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email Address or USN</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                 </div>
                 <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="student@example.com"
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
                 />
               </div>
             </div>

             {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 animate-fade-in">
                    <Activity className="w-4 h-4" /> {error}
                </div>
             )}

             <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
             </button>
           </form>

           <div className="mt-6 text-center text-sm text-slate-500">
             Don't have an account? <button onClick={onNavigateToSignup} className="text-blue-600 font-semibold hover:underline">Register</button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">Demo Access: Admin / Admin</span>
           </div>
        </div>
      </div>
    </div>
  );
};
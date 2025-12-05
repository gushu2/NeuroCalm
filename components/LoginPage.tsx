import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Activity } from 'lucide-react';
import { authService } from '../services/authService';
import { GoogleLoginModal } from './GoogleLoginModal';

interface LoginPageProps {
  onLogin: (role: 'student' | 'admin') => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Strict Google Email Validator (Matching Registration Logic)
  const isValidGoogleEmail = (email: string) => {
    if (email.length > 30) return false;
    const googleEmailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]*@gmail\.com$/;
    return googleEmailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

  const handleGoogleSuccess = async (googleEmail: string) => {
    setShowGoogleModal(false);
    setIsLoading(true); 
    
    try {
      const response = await authService.googleLogin(googleEmail);
      if (response.success && response.user) {
        onLogin(response.user.role);
      } else {
        setError(response.error || 'Google Sign-In failed');
      }
    } catch (err) {
      setError('Unable to connect to Google OAuth service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-stone-900">
      <GoogleLoginModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)}
        onSuccess={handleGoogleSuccess}
      />

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-stone-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl h-auto lg:h-[600px] flex flex-col lg:flex-row bg-stone-50/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden m-4 border border-white/20">
        
        {/* Left Side: Brand Visuals */}
        <div className="lg:w-5/12 bg-gradient-to-br from-stone-900 to-stone-800 text-white p-12 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full">
               <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5" />
                 <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
                 <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
               </svg>
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-tr from-orange-500 to-amber-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-wide">NeuroCalm</span>
              </div>
              
              <h1 className="text-3xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100">
                Focus on Learning,<br/> Not Stress.
              </h1>
              <p className="text-stone-400 text-sm leading-relaxed">
                Our AI-driven system monitors your physiological signals in real-time to provide instant, personalized wellness support.
              </p>
           </div>

           <div className="relative z-10 mt-12">
              <div className="flex -space-x-3 mb-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`w-8 h-8 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center text-[10px]`}>
                      <span className="opacity-50">U{i}</span>
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-stone-800 bg-orange-600 flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-orange-900/50">
                    +1k
                 </div>
              </div>
              <p className="text-xs text-stone-500 font-medium">Join thousands of students managing wellness.</p>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-7/12 p-10 lg:p-12 flex flex-col justify-center bg-white">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Welcome Back</h2>
                <p className="text-stone-500 text-sm mt-1">Please enter your details to sign in.</p>
            </div>

            {/* Google Button */}
            <button 
                onClick={() => setShowGoogleModal(true)}
                disabled={isLoading}
                className="w-full bg-white border border-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm group"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                ) : (
                    <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
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
                    <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-3 bg-white text-stone-400 font-medium">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-stone-400 text-sm font-medium"
                            placeholder="student@gmail.com"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 transform active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-stone-500">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToSignup} className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all">
                        Create Account
                    </button>
                </p>
            </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full text-center z-20">
          <p className="text-[10px] text-stone-400/50">Protected by Google Identity Platform • Privacy Policy</p>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'processing'>('email');

  if (!isOpen) return null;

  const validateGoogleEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleNext = () => {
    setError('');
    
    if (!email.trim()) {
      setError('Enter an email or phone number');
      return;
    }

    if (!validateGoogleEmail(email.trim())) {
      setError('Couldn\'t find your Google Account. Please enter a valid @gmail.com address.');
      return;
    }

    setStep('processing');
    
    // Simulate network delay for authentication
    setTimeout(() => {
      onSuccess(email);
      setStep('email'); // Reset for next time
      setEmail('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[450px] rounded-lg shadow-2xl overflow-hidden relative flex flex-col min-h-[500px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="pt-10 px-10 pb-2 flex flex-col items-center text-center">
            <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h2 className="text-2xl font-medium text-slate-800 mb-2">Sign in</h2>
            <p className="text-base text-slate-600">to continue to NeuroCalm</p>
        </div>

        {/* Form Body */}
        <div className="px-10 py-6 flex-1 flex flex-col">
            {step === 'email' ? (
                <>
                    <div className="relative mt-4 mb-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-3.5 border rounded-md text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all peer ${error ? 'border-red-600' : 'border-slate-300'}`}
                            placeholder=" "
                            autoFocus
                        />
                        <label className={`absolute left-3 px-1 bg-white transition-all duration-200 pointer-events-none ${email ? '-top-2.5 text-xs text-blue-600' : 'top-3.5 text-slate-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600'}`}>
                            Email or phone
                        </label>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mt-2">
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                            Forgot email?
                        </button>
                    </div>

                    <div className="mt-10 text-sm text-slate-500">
                        Not your computer? Use Guest mode to sign in privately. <br/>
                        <a href="#" className="text-blue-600 font-medium hover:text-blue-700">Learn more</a>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 pb-10">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-slate-600">Verifying account...</p>
                </div>
            )}
        </div>

        {/* Footer */}
        {step === 'email' && (
            <div className="px-10 py-6 flex justify-between items-center mt-auto">
                <button 
                    onClick={onClose}
                    className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                >
                    Create account
                </button>
                <button 
                    onClick={handleNext}
                    className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-all shadow-sm"
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { LayoutDashboard, Users, ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');

  // Handle successful login
  const handleLogin = (role: 'student' | 'admin') => {
    setIsAuthenticated(true);
    setCurrentView(role);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('student'); // Reset default view
    setAuthView('login');
  };

  // Authentication Flow
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigateToSignup={() => setAuthView('signup')} 
        />
      );
    } else {
      return (
        <SignUpPage 
          onRegister={() => handleLogin('student')} 
          onNavigateToLogin={() => setAuthView('login')} 
        />
      );
    }
  }

  // Main Application Layout
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex-shrink-0 md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-orange-600">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">NeuroCalm</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1 pl-10">Student Well-Being System</p>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('student')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === 'student' 
                ? 'bg-orange-50 text-orange-700 font-medium shadow-sm ring-1 ring-orange-100' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Student Dashboard
          </button>

          <button 
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === 'admin' 
                ? 'bg-orange-50 text-orange-700 font-medium shadow-sm ring-1 ring-orange-100' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Admin Panel
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${currentView === 'admin' ? 'bg-stone-200 text-stone-600' : 'bg-white text-stone-600'}`}>
              {currentView === 'admin' ? 'A' : 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate">
                {currentView === 'admin' ? 'System Admin' : 'Guruganesh N Bhat'}
              </p>
              <p className="text-xs text-stone-400 truncate">
                {currentView === 'admin' ? 'Administrator' : '4MW23CS044'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800">
            {currentView === 'student' ? 'My Wellness Dashboard' : 'Administrator Control Center'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-xs font-medium text-stone-600">System Operational</span>
            </div>
            <span className="text-sm text-stone-500 hidden md:block font-medium">{new Date().toDateString()}</span>
          </div>
        </header>

        <div className="animate-fade-in p-6 md:p-8">
          {currentView === 'student' ? <Dashboard /> : <AdminPanel />}
        </div>
        
        <footer className="px-6 py-4 text-center text-stone-400 text-xs border-t border-stone-100">
          © 2025 SMVITM Department of CSE. NeuroCalm Project. All rights reserved.
        </footer>
      </main>

    </div>
  );
};

export default App;
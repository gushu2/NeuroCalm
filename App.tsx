import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { LayoutDashboard, Users, ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">NeuroCalm</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10">Student Well-Being System</p>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('student')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === 'student' 
                ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Student Dashboard
          </button>

          <button 
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === 'admin' 
                ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Admin Panel
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
              G
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Guruganesh N Bhat</p>
              <p className="text-xs text-slate-400">4MW23CS044</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentView === 'student' ? 'My Wellness Dashboard' : 'Administrator Control Center'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:block">{new Date().toDateString()}</span>
          </div>
        </header>

        <div className="animate-fade-in">
          {currentView === 'student' ? <Dashboard /> : <AdminPanel />}
        </div>
        
        <footer className="p-6 text-center text-slate-400 text-xs">
          © 2025 SMVITM Department of CSE. NeuroCalm Project.
        </footer>
      </main>

    </div>
  );
};

export default App;

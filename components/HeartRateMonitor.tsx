import React from 'react';
import { Heart, Activity } from 'lucide-react';
import { StressLevel } from '../types';

interface HeartRateMonitorProps {
  bpm: number;
  stressLevel: StressLevel;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({ 
  bpm, 
  stressLevel, 
  isConnected, 
  onConnect, 
  onDisconnect 
}) => {
  
  // Determine colors based on stress level
  let colorClass = "text-green-500";
  let bgClass = "bg-green-50";
  let statusText = "Relaxed";

  if (stressLevel === StressLevel.MILD) {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-50";
    statusText = "Mild Stress";
  } else if (stressLevel === StressLevel.HIGH) {
    colorClass = "text-red-500";
    bgClass = "bg-red-50";
    statusText = "High Stress";
  }

  if (!isConnected) {
    colorClass = "text-slate-400";
    bgClass = "bg-slate-50";
    statusText = "Disconnected";
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          {isConnected ? 'Sensor Active' : 'Sensor Offline'}
        </div>
      </div>

      <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-6">Heart Rate Monitor</h2>

      <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 ${isConnected ? `border-current ${colorClass}` : 'border-slate-200'}`}>
        {isConnected && (
            <div className={`absolute inset-0 rounded-full opacity-20 ${bgClass} animate-ping`} style={{ animationDuration: `${60 / (bpm || 60)}s` }}></div>
        )}
        
        <div className="flex flex-col items-center z-10">
           <Heart 
            className={`w-12 h-12 mb-2 transition-transform duration-100 ${isConnected ? 'animate-heartbeat' : 'text-slate-300'}`} 
            style={{ animationDuration: isConnected ? `${60 / bpm}s` : '0s' }}
            fill={isConnected ? "currentColor" : "none"}
           />
           <span className={`text-5xl font-bold tabular-nums ${isConnected ? 'text-slate-800' : 'text-slate-300'}`}>
             {isConnected ? bpm : '--'}
           </span>
           <span className="text-slate-400 text-sm mt-1">BPM</span>
        </div>
      </div>

      <div className={`mt-6 px-6 py-3 rounded-xl ${bgClass} ${colorClass} font-medium text-lg transition-colors duration-300`}>
        {statusText}
      </div>

      <div className="mt-6 w-full">
        {!isConnected ? (
          <button 
            onClick={onConnect}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
          >
            <Activity className="w-5 h-5" />
            Connect Sensor
          </button>
        ) : (
          <button 
            onClick={onDisconnect}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};

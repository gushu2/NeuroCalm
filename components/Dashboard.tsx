import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HeartRateMonitor } from './HeartRateMonitor';
import { StressLevel, HeartRateData } from '../types';
import { WellnessToolkit } from './WellnessToolkit';
import { AICoach } from './AICoach';

export const Dashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [stressLevel, setStressLevel] = useState<StressLevel>(StressLevel.NORMAL);
  const [history, setHistory] = useState<HeartRateData[]>([]);
  
  // Timer for simulation
  const intervalRef = useRef<number | null>(null);

  // Simulation Logic
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = window.setInterval(() => {
        setBpm((prev) => {
          // Simulate fluctuation
          const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
          let newBpm = prev + change;
          
          // Occasional spikes for demonstration
          if (Math.random() > 0.95) newBpm += 15;
          if (Math.random() > 0.95) newBpm -= 10;
          
          // Clamp values
          if (newBpm < 45) newBpm = 45;
          if (newBpm > 140) newBpm = 140;

          return newBpm;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  // Update Stress Level and History based on BPM
  useEffect(() => {
    if (!isConnected) return;

    // Classification Logic from Report
    let currentLevel = StressLevel.NORMAL;
    if (bpm >= 80 && bpm < 120) {
      currentLevel = StressLevel.MILD;
    } else if (bpm >= 120) {
      currentLevel = StressLevel.HIGH;
    }
    setStressLevel(currentLevel);

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setHistory(prev => {
      const newData = [...prev, { timestamp: timeStr, bpm }];
      // Keep last 30 data points for the live chart
      if (newData.length > 30) return newData.slice(newData.length - 30);
      return newData;
    });

  }, [bpm, isConnected]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
        // Reset for new session
        setHistory([]); 
        setBpm(72);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Row: Monitor & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Heart Rate Monitor */}
        <div className="lg:col-span-1">
          <HeartRateMonitor 
            bpm={bpm} 
            stressLevel={stressLevel} 
            isConnected={isConnected} 
            onConnect={toggleConnection}
            onDisconnect={toggleConnection}
          />
        </div>

        {/* Right Col: Live Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-slate-800 font-semibold text-lg">Real-time Analysis</h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-green-500"></div> <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-yellow-500"></div> <span>Mild</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-red-500"></div> <span>High</span>
                </div>
              </div>
           </div>
           
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                    tickLine={false}
                    axisLine={false}
                    interval={5}
                  />
                  <YAxis 
                    domain={[40, 160]} 
                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                    isAnimationActive={false}
                  />
                  {/* Reference Lines for Zones */}
                  {/* These could be added using ReferenceArea if desired, but kept simple for now */}
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Middle Row: Wellness Recommendations & Actions */}
      <WellnessToolkit stressLevel={stressLevel} />

      {/* Bottom Row: AI Coach */}
      <div className="grid grid-cols-1 gap-6">
        <AICoach currentBpm={isConnected ? bpm : undefined} stressLevel={isConnected ? stressLevel : undefined} />
      </div>

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HeartRateMonitor } from './HeartRateMonitor';
import { StressLevel, HeartRateData } from '../types';
import { WellnessToolkit } from './WellnessToolkit';
import { AICoach } from './AICoach';
import { Download, Bell, Zap, Shield, Brain, Activity, FileText, Trash2, Database } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [stressLevel, setStressLevel] = useState<StressLevel>(StressLevel.NORMAL);
  const [history, setHistory] = useState<HeartRateData[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Notifications State
  const [notifications, setNotifications] = useState<{id: number, text: string, time: string, type: 'alert' | 'info'}[]>([
    { id: 1, text: "System ready. Connect ESP32 to begin.", time: new Date().toLocaleTimeString(), type: 'info' }
  ]);
  
  // References for Web Serial API
  const portRef = useRef<any>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const readableStreamClosedRef = useRef<Promise<void> | null>(null);
  const prevStressRef = useRef<StressLevel>(StressLevel.NORMAL);

  // Update Stress Level based on real BPM
  useEffect(() => {
    let currentLevel = StressLevel.NORMAL;
    
    // Logic: Only classify if we have a valid heart rate reading
    if (bpm > 40) {
      if (bpm >= 80 && bpm < 120) {
        currentLevel = StressLevel.MILD;
      } else if (bpm >= 120) {
        currentLevel = StressLevel.HIGH;
      }
    } else {
        currentLevel = StressLevel.NORMAL;
    }
    
    setStressLevel(currentLevel);

    // Handle Notifications for Stress Changes
    if (isConnected && currentLevel !== prevStressRef.current && currentLevel !== StressLevel.NORMAL) {
        const msg = currentLevel === StressLevel.HIGH 
            ? `High Stress detected (${bpm} BPM). AI Coach activated.`
            : `Mild Stress level rising (${bpm} BPM).`;
            
        setNotifications(prev => [
            { id: Date.now(), text: msg, time: new Date().toLocaleTimeString(), type: 'alert' as const },
            ...prev
        ].slice(0, 5));
    }
    prevStressRef.current = currentLevel;

    if (isConnected && bpm > 0) {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        setHistory(prev => {
          const newData = [...prev, { timestamp: timeStr, bpm }];
          // Keep last 30 data points for the live chart
          if (newData.length > 30) return newData.slice(newData.length - 30);
          return newData;
        });
    }

  }, [bpm, isConnected]);

  // Connect to ESP32 via USB Serial
  const connectSerial = async () => {
    setConnectionError(null);
    if (!("serial" in navigator)) {
      setConnectionError("Your browser does not support Web Serial.");
      return;
    }

    try {
      const navSerial = (navigator as any).serial;
      const port = await navSerial.requestPort();
      await port.open({ baudRate: 115200 });
      
      portRef.current = port;
      setIsConnected(true);
      setHistory([]); 
      setNotifications(prev => [{ id: Date.now(), text: "ESP32 Device Connected Successfully", time: new Date().toLocaleTimeString(), type: 'info' as const }, ...prev]);

      const textDecoder = new TextDecoderStream();
      readableStreamClosedRef.current = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          if (value) {
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              
              // Robust regex matching for "Heart Rate: 72", "BPM:72", "72.00"
              const match = trimmed.match(/(?:Heart Rate|BPM|Rate):\s*([0-9.]+)/i);
              
              if (match && match[1]) {
                 const newBpm = parseFloat(match[1]);
                 if (!isNaN(newBpm)) setBpm(Math.round(newBpm));
              } else if (trimmed.includes("FAILED")) {
                 setConnectionError("Sensor Init Failed. Check Wiring.");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error reading from serial port:", error);
        setConnectionError("Lost connection to device.");
        setNotifications(prev => [{ id: Date.now(), text: "Connection lost to ESP32.", time: new Date().toLocaleTimeString(), type: 'alert' as const }, ...prev]);
      } finally {
        reader.releaseLock();
      }

    } catch (err: any) {
      console.error("Failed to connect:", err);
      setIsConnected(false);
      
      let errorMessage = "Failed to connect.";
      // Check for common "Port already open" errors
      if (err.name === "NetworkError" || (err.message && err.message.includes("Failed to open"))) {
          errorMessage = "Port busy. Close Arduino IDE or other tabs.";
      } else if (err.name === "NotFoundError") {
          errorMessage = "No device selected.";
      } else {
          errorMessage = `Connection error: ${err.message}`;
      }
      setConnectionError(errorMessage);
    }
  };

  const disconnectSerial = async () => {
    try {
        if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current = null;
        }
        if (readableStreamClosedRef.current) {
            await readableStreamClosedRef.current.catch(() => {});
            readableStreamClosedRef.current = null;
        }
        if (portRef.current) {
            await portRef.current.close();
            portRef.current = null;
        }
    } catch (e) {
        console.error("Error during disconnect:", e);
    }
    setIsConnected(false);
    setBpm(0);
    setNotifications(prev => [{ id: Date.now(), text: "Device Disconnected", time: new Date().toLocaleTimeString(), type: 'info' as const }, ...prev]);
  };

  const downloadData = () => {
    if (history.length === 0) {
        alert("No data to download yet.");
        return;
    }
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,BPM,Stress Level\n" 
        + history.map(row => {
            let level = "Normal";
            if(row.bpm >= 80 && row.bpm < 120) level = "Mild";
            if(row.bpm >= 120) level = "High";
            return `${row.timestamp},${row.bpm},${level}`;
        }).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `neurocalm_session_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearSession = () => {
      if(window.confirm("Clear all session history?")) {
          setHistory([]);
          setNotifications(prev => [{ id: Date.now(), text: "Session history cleared.", time: new Date().toLocaleTimeString(), type: 'info' as const }, ...prev]);
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Row: Monitor, Chart, Notifications/Data */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Heart Rate Monitor */}
        <div className="lg:col-span-1">
          <HeartRateMonitor 
            bpm={bpm} 
            stressLevel={stressLevel} 
            isConnected={isConnected} 
            onConnect={connectSerial}
            onDisconnect={disconnectSerial}
            error={connectionError}
          />
        </div>

        {/* Middle Col: Live Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 p-6 relative">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-stone-800 font-semibold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Real-time Analysis
              </h2>
              <div className="flex items-center gap-2">
                 <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                 </span>
                 <span className="text-xs text-stone-500 font-medium">Live Feed</span>
              </div>
           </div>
           
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{fontSize: 12, fill: '#a8a29e'}} 
                    tickLine={false}
                    axisLine={false}
                    interval={5}
                  />
                  <YAxis 
                    domain={[40, 160]} 
                    tick={{fontSize: 12, fill: '#a8a29e'}} 
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#ea580c" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#c2410c' }}
                    isAnimationActive={false}
                  />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Right Col: Notifications & Data Management */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-0 overflow-hidden flex flex-col flex-1 max-h-[250px]">
                <div className="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                    <h3 className="font-semibold text-stone-800 flex items-center gap-2 text-sm">
                        <Bell className="w-4 h-4 text-stone-500" /> Live Alerts
                    </h3>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notifications.length === 0 && (
                        <p className="text-center text-stone-400 text-xs py-4">No recent alerts</p>
                    )}
                    {notifications.map((note) => (
                        <div key={note.id} className={`p-3 rounded-lg border text-xs ${note.type === 'alert' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                            <div className="flex justify-between mb-1">
                                <span className={`font-bold ${note.type === 'alert' ? 'text-red-700' : 'text-orange-700'}`}>
                                    {note.type === 'alert' ? 'Alert' : 'System'}
                                </span>
                                <span className="text-stone-400">{note.time}</span>
                            </div>
                            <p className="text-stone-600 leading-relaxed">{note.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2 text-sm mb-3">
                    <Database className="w-4 h-4 text-stone-500" /> Data & Reports
                </h3>
                <div className="space-y-2">
                    <button 
                        onClick={downloadData}
                        className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 border border-stone-100 rounded-xl transition-colors group"
                    >
                        <span className="text-xs font-medium text-stone-600">Export Session CSV</span>
                        <Download className="w-4 h-4 text-stone-400 group-hover:text-orange-600" />
                    </button>
                    <button 
                        onClick={clearSession}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-red-50 border border-stone-100 hover:border-red-100 rounded-xl transition-colors group"
                    >
                        <span className="text-xs font-medium text-stone-600 group-hover:text-red-600">Clear History</span>
                        <Trash2 className="w-4 h-4 text-stone-400 group-hover:text-red-600" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Middle Row: Wellness Recommendations & Actions */}
      <WellnessToolkit stressLevel={stressLevel} />

      {/* Bottom Row: AI Coach */}
      <div className="grid grid-cols-1 gap-6">
        <AICoach currentBpm={isConnected ? bpm : undefined} stressLevel={isConnected ? stressLevel : undefined} />
      </div>

      {/* Footer: Key Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
         <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                <Zap className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-stone-800">Real-time Analysis</h4>
                <p className="text-sm text-stone-500 mt-1">Instant heart rate processing via ESP32 sensors with ms-latency.</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                <Brain className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-stone-800">AI Coaching</h4>
                <p className="text-sm text-stone-500 mt-1">Personalized stress relief with yoga and music recommendations.</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-stone-100 rounded-lg text-stone-600">
                <Shield className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-bold text-stone-800">Privacy First</h4>
                <p className="text-sm text-stone-500 mt-1">Your physiological data is processed locally and never stored on cloud.</p>
            </div>
         </div>
      </div>

    </div>
  );
};
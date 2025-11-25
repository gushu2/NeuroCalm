import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Music, Activity, Play, Pause, AlertCircle } from 'lucide-react';
import { StressLevel, ChatMessage } from '../types';
import { sendMessage } from '../services/geminiService';

interface AICoachProps {
  currentBpm?: number;
  stressLevel?: StressLevel;
}

// Local Database of Solutions
const OFFLINE_SOLUTIONS = {
  [StressLevel.HIGH]: [
    {
      type: 'yoga',
      title: "Child's Pose (Balasana)",
      description: "A deep resting pose that calms the brain and relieves stress.",
      instruction: "Kneel on the floor, touch big toes together, sit on heels, and lay your torso down between your thighs.",
      duration: "Hold for 3 minutes"
    },
    {
      type: 'song',
      title: "Weightless - Marconi Union",
      description: "Ambient therapy track designed to lower heart rate.",
      durationStr: "08:00",
      durationSec: 480
    }
  ],
  [StressLevel.MILD]: [
    {
      type: 'yoga',
      title: "Seated Neck Release",
      description: "Relieves immediate tension in the neck and shoulders.",
      instruction: "Sit comfortably. Drop right ear to right shoulder. Breathe deeply. Repeat on left side.",
      duration: "1 minute per side"
    },
    {
      type: 'song',
      title: "River Flows in You",
      description: "Gentle piano melody to bring your mind back to center.",
      durationStr: "03:45",
      durationSec: 225
    }
  ]
};

export const AICoach: React.FC<AICoachProps> = ({ currentBpm, stressLevel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "NeuroCalm Monitoring Active. I will notify you with a Song or Yoga solution if I detect stress.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const playbackInterval = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevStressLevel = useRef<StressLevel | undefined>(StressLevel.NORMAL);

  // Auto-Response Logic for Stress Notifications
  useEffect(() => {
    // Skip if undefined or normal (unless we want to confirm return to normal)
    if (!stressLevel || stressLevel === StressLevel.NORMAL) {
      prevStressLevel.current = stressLevel;
      return;
    }

    // Trigger notification if stress level CHANGED to MILD or HIGH
    // Or if it persists at HIGH for a long time (logic simplified here to change-based)
    if (stressLevel !== prevStressLevel.current) {
        const solutions = OFFLINE_SOLUTIONS[stressLevel];
        // Pick a solution (alternate or random)
        const solution = solutions[Math.floor(Math.random() * solutions.length)];
        
        // 1. Notification Message
        const alertMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'model',
            text: `⚠️ ALERT: ${stressLevel} Stress Detected (${currentBpm} BPM).`,
            timestamp: new Date()
        };
        
        // 2. Solution Card Message
        const solutionMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: JSON.stringify(solution), // Pass object as string to render card
            timestamp: new Date()
        };

        setMessages(prev => [...prev, alertMsg, solutionMsg]);
    }

    prevStressLevel.current = stressLevel;
  }, [stressLevel, currentBpm]);

  // Audio Playback Simulation Logic
  useEffect(() => {
    if (playingId) {
        playbackInterval.current = window.setInterval(() => {
            setProgress(prev => {
                const currentVal = prev[playingId] || 0;
                if (currentVal >= 100) {
                    setPlayingId(null); // Stop when done
                    return { ...prev, [playingId]: 0 };
                }
                return { ...prev, [playingId]: currentVal + 1 }; // Increment 1% per tick (fast for demo)
            });
        }, 100); // Fast simulation
    } else {
        if (playbackInterval.current) clearInterval(playbackInterval.current);
    }
    return () => {
        if (playbackInterval.current) clearInterval(playbackInterval.current);
    };
  }, [playingId]);

  const toggleAudio = (msgId: string) => {
    if (playingId === msgId) {
        setPlayingId(null); // Pause
    } else {
        setPlayingId(msgId); // Play
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, playingId]); // Scroll when messages arrive or player state changes

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Use offline service
    const responseText = await sendMessage(null, userMsg.text, currentBpm, stressLevel);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render logic for cards
  const renderMessageContent = (msg: ChatMessage) => {
    const text = msg.text;
    try {
        // Detect JSON object for Solution Cards
        if (text.startsWith('{') && text.includes('title')) {
            const data = JSON.parse(text);
            const isYoga = data.type === 'yoga';
            const isPlaying = playingId === msg.id;
            const currentProgress = progress[msg.id] || 0;

            return (
                <div className="bg-white rounded-xl p-4 mt-2 border border-slate-200 shadow-md w-full max-w-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${isYoga ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                            {isYoga ? <Activity className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recommended Solution</span>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{data.title}</h3>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{data.description}</p>
                    
                    {isYoga ? (
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <p className="text-sm text-orange-800 italic">"{data.instruction}"</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 font-semibold">
                                <Activity className="w-3 h-3" />
                                {data.duration}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                            {/* Audio Player UI */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => toggleAudio(msg.id)}
                                    className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-sm"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                                </button>
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs text-purple-700 mb-1 font-medium">
                                        <span>{isPlaying ? 'Now Playing...' : 'Paused'}</span>
                                        <span>{data.durationStr}</span>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-purple-600 h-full transition-all duration-100 ease-linear"
                                            style={{ width: `${currentProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        
        // Render simple alert text differently
        if (text.startsWith('⚠️')) {
             return (
                 <div className="flex items-start gap-2 text-red-600 font-medium">
                     <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                     <span>{text}</span>
                 </div>
             );
        }

        return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
    } catch (e) {
        return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex items-center gap-3 text-white shadow-md z-10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Wellness Assistant</h2>
          <p className="text-teal-100 text-xs">Real-time Stress Monitoring • Offline</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-2xl rounded-tr-none px-4 py-3' 
                : 'w-full' // Full width container for bot to allow left alignment logic within
            }`}>
               {/* Wrapper for Bot messages to handle the card width naturally */}
               <div className={`${msg.role === 'user' ? '' : 'flex flex-col items-start'}`}>
                  {msg.role === 'model' && !msg.text.startsWith('{') && (
                      <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm mb-1">
                          {renderMessageContent(msg)}
                      </div>
                  )}
                  {msg.role === 'model' && msg.text.startsWith('{') && (
                      // Render cards directly without the bubble wrapper style
                      renderMessageContent(msg)
                  )}
                   {msg.role === 'user' && renderMessageContent(msg)}
               </div>
               
              <p className={`text-[10px] mt-1 opacity-60 text-right ${msg.role === 'user' ? 'text-teal-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-slate-200 rounded-full h-8 w-12 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for a song or yoga pose..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none text-slate-700"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Music, Activity, Play, Pause, AlertCircle, Volume2, Wind, Timer, VolumeX, Volume1, Disc } from 'lucide-react';
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
      title: "Weightless",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmissions Vol. 2)",
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
      artist: "Yiruma",
      album: "First Love",
      description: "Gentle piano melody to bring your mind back to center.",
      durationStr: "03:45",
      durationSec: 225
    }
  ],
  [StressLevel.NORMAL]: [] // Add empty array to prevent undefined errors
};

// Breathing Techniques Configuration
const BREATHING_TECHNIQUES = {
  'box': {
    title: "Box Breathing",
    description: "Equal duration breathing for focus and calm. Used by Navy SEALs.",
    phases: [
      { label: "Inhale", duration: 4, scale: 1.25, text: "Breathe In...", color: "bg-teal-500" },
      { label: "Hold", duration: 4, scale: 1.25, text: "Hold Breath", color: "bg-teal-600" },
      { label: "Exhale", duration: 4, scale: 1.0, text: "Breathe Out...", color: "bg-teal-400" },
      { label: "Hold", duration: 4, scale: 1.0, text: "Hold Empty", color: "bg-teal-600" }
    ]
  },
  '478': {
    title: "4-7-8 Breathing",
    description: "Dr. Weil's technique for deep relaxation and anxiety reduction.",
    phases: [
      { label: "Inhale", duration: 4, scale: 1.25, text: "Inhale (Nose)", color: "bg-indigo-500" },
      { label: "Hold", duration: 7, scale: 1.25, text: "Hold Breath", color: "bg-indigo-600" },
      { label: "Exhale", duration: 8, scale: 1.0, text: "Exhale (Mouth)", color: "bg-indigo-400" }
    ]
  }
};

// CSS Styles for SVG Animations
const animationStyles = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes tilt {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  .animate-breathe {
    animation: breathe 4s ease-in-out infinite;
    transform-origin: center center;
  }
  .animate-tilt {
    animation: tilt 3s ease-in-out infinite;
    transform-origin: bottom center;
  }
`;

// Visual Component for Yoga Poses
const YogaVisual: React.FC<{ title: string }> = ({ title }) => {
    if (title.includes("Child's Pose")) {
        return (
            <div className="w-full h-40 bg-orange-50 rounded-xl mb-4 border border-orange-100 overflow-hidden relative flex items-center justify-center">
                <style>{animationStyles}</style>
                <div className="absolute top-2 right-2 bg-orange-200/50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Animated Guide</div>
                <svg viewBox="0 0 200 120" className="w-48 h-auto text-orange-600">
                    <line x1="20" y1="105" x2="180" y2="105" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
                    <g className="animate-breathe">
                        <path d="M50,103 L90,103 L100,75 L60,75 Z" fill="#fdba74" />
                        <path d="M60,75 Q90,55 130,95" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="135" cy="98" r="9" fill="currentColor" />
                        <line x1="130" y1="95" x2="170" y2="103" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                    </g>
                </svg>
            </div>
        );
    }
    if (title.includes("Neck")) {
        return (
            <div className="w-full h-40 bg-orange-50 rounded-xl mb-4 border border-orange-100 overflow-hidden relative flex items-center justify-center">
                <style>{animationStyles}</style>
                <div className="absolute top-2 right-2 bg-orange-200/50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Animated Guide</div>
                <svg viewBox="0 0 200 150" className="w-40 h-auto text-orange-600">
                    <defs>
                         <marker id="arrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                           <path d="M0,0 L0,6 L9,3 z" fill="#ea580c" />
                         </marker>
                    </defs>
                    <path d="M60,150 Q100,140 140,150 L140,160 L60,160 Z" fill="#fdba74" />
                    <rect x="85" y="110" width="30" height="40" fill="#fdba74" rx="5" />
                    <g className="animate-tilt" style={{ transformBox: 'fill-box', transformOrigin: 'center 90%' }}>
                         <rect x="92" y="90" width="16" height="25" fill="#fdba74" />
                         <circle cx="100" cy="80" r="28" fill="currentColor" />
                         <path d="M100,70 L100,90" stroke="white" strokeWidth="2" opacity="0.3" />
                    </g>
                    <path d="M140,50 Q160,70 150,90" fill="none" stroke="#ea580c" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="4,4" opacity="0.6" />
                    <path d="M60,50 Q40,70 50,90" fill="none" stroke="#ea580c" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="4,4" opacity="0.6" />
                </svg>
            </div>
        );
    }
    return (
        <div className="w-full h-32 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
             <Activity className="w-12 h-12 text-orange-300 opacity-50" />
        </div>
    );
};

// Interactive Breathing Visual Component
const BreathingVisual: React.FC<{ type: 'box' | '478' }> = ({ type }) => {
    const config = BREATHING_TECHNIQUES[type];
    const [isActive, setIsActive] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(config.phases[0].duration);
    
    useEffect(() => {
        let interval: number;
        if (isActive) {
            interval = window.setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        // Move to next phase
                        const nextPhase = (phaseIndex + 1) % config.phases.length;
                        setPhaseIndex(nextPhase);
                        return config.phases[nextPhase].duration;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, phaseIndex, config.phases]);

    const handleToggle = () => {
        if (!isActive) {
            setIsActive(true);
            if (secondsLeft === 0) { 
                setPhaseIndex(0);
                setSecondsLeft(config.phases[0].duration);
            }
        } else {
            setIsActive(false);
        }
    };

    const currentPhase = config.phases[phaseIndex];

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 w-full mt-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-800 font-bold flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-500" />
                    {config.title}
                </h3>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                    {isActive ? 'Session Active' : 'Ready'}
                </span>
            </div>
            
            <div className="relative h-48 flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-400"></div>
                    <div className="absolute w-24 h-24 rounded-full border-4 border-slate-400"></div>
                </div>

                <div 
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-[1000ms] ease-in-out ${currentPhase.color}`}
                    style={{ 
                        transform: isActive ? `scale(${currentPhase.scale})` : 'scale(1)',
                        transitionDuration: isActive ? `${currentPhase.duration}s` : '0.5s',
                        opacity: isActive ? 1 : 0.5
                    }}
                >
                     <span className="text-white font-bold text-2xl tabular-nums">
                         {isActive ? secondsLeft : <Wind className="w-8 h-8 opacity-50"/>}
                     </span>
                </div>

                <div className="absolute bottom-2 text-center w-full">
                    <p className={`text-lg font-bold transition-all duration-300 ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                        {isActive ? currentPhase.text : "Press Start"}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={handleToggle}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                        isActive 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'
                    }`}
                >
                    {isActive ? <><Pause className="w-4 h-4"/> Pause</> : <><Play className="w-4 h-4"/> Start Exercise</>}
                </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-3 text-center leading-relaxed px-2">
                {config.description}
            </p>
        </div>
    );
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
  const [volume, setVolume] = useState(0.5); // Default 50% volume
  const playbackInterval = useRef<number | null>(null);

  // Web Audio API Refs (for offline sound generation)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodes = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevStressLevel = useRef<StressLevel | undefined>(StressLevel.NORMAL);

  // Initialize Audio Context
  const initAudio = async () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Real-time volume control
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        // Smooth transition for volume change to prevent clicking
        gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1);
      } catch (e) {
        // Fallback if gain node not active
      }
    }
  }, [volume]);

  const stopSound = () => {
    // 1. Clear Interval for melodies immediately
    if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
    }

    // 2. Snapshot current nodes to stop them
    const nodesToStop = [...oscillatorNodes.current];
    oscillatorNodes.current = []; // Reset current list

    // 3. Handle Gain Node fade out
    if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const oldGainNode = gainNodeRef.current;
        
        try {
            oldGainNode.gain.cancelScheduledValues(ctx.currentTime);
            // Ramp down from current volume
            oldGainNode.gain.setValueAtTime(oldGainNode.gain.value, ctx.currentTime);
            oldGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        } catch(e) {}
        
        setTimeout(() => {
            nodesToStop.forEach(node => {
                try { node.stop(); } catch(e){}
            });
            try { oldGainNode.disconnect(); } catch(e) {}
        }, 350);
    } else {
        nodesToStop.forEach(node => {
            try { node.stop(); } catch(e){}
        });
    }
    
    gainNodeRef.current = null;
  };

  // Generate Sounds (Offline)
  const playSound = async (type: 'alert' | 'deep' | 'light') => {
    const ctx = await initAudio();
    
    stopSound();

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain; // Assign new gain node
    
    if (type === 'alert') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        
        masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        
        osc.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'deep') {
        // "Weightless" Simulation - Ambient Drone
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        // Ramp up to current volume setting
        masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);

        const freqs = [92.50, 116.54, 138.59, 185.00]; 
        
        freqs.forEach(f => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            osc.detune.value = Math.random() * 10 - 5;

            osc.connect(masterGain);
            osc.start();
            oscillatorNodes.current.push(osc);
        });

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.15;
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);
        lfo.start();
        oscillatorNodes.current.push(lfo);

    } else {
        // "River Flows" - Light Melody
        // Set master gain to current volume
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);

        const notes = [261.63, 329.63, 392.00, 523.25]; 
        let noteIndex = 0;

        const playNote = () => {
            if (!gainNodeRef.current) return;

            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = notes[noteIndex];
            
            noteGain.gain.setValueAtTime(0, ctx.currentTime);
            noteGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05); // Attack relative to master
            noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

            osc.connect(noteGain);
            noteGain.connect(masterGain);
            
            osc.start();
            osc.stop(ctx.currentTime + 1.2);

            noteIndex = (noteIndex + 1) % notes.length;
        };

        playNote();
        const intervalId = window.setInterval(playNote, 500); 
        audioIntervalRef.current = intervalId;
    }
  };

  // Auto-Response Logic
  useEffect(() => {
    if (!stressLevel || stressLevel === StressLevel.NORMAL) {
      prevStressLevel.current = stressLevel;
      return;
    }

    if (stressLevel !== prevStressLevel.current) {
        // Use default fallback if no solutions for stress level (e.g. Normal)
        const solutions = OFFLINE_SOLUTIONS[stressLevel] || [];
        if (solutions.length > 0) {
            const solution = solutions[Math.floor(Math.random() * solutions.length)];
            
            try { playSound('alert'); } catch (e) { console.log('Audio requires interaction first'); }

            const alertMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'model',
                text: `⚠️ ALERT: ${stressLevel} Stress Detected (${currentBpm} BPM).`,
                timestamp: new Date()
            };
            
            const solutionMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: JSON.stringify(solution),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, alertMsg, solutionMsg]);
        }
    }

    prevStressLevel.current = stressLevel;
  }, [stressLevel, currentBpm]);

  // Audio Playback UI Progress
  useEffect(() => {
    if (playingId) {
        playbackInterval.current = window.setInterval(() => {
            setProgress(prev => {
                const currentVal = prev[playingId] || 0;
                if (currentVal >= 100) {
                    toggleAudio(playingId, ''); 
                    return { ...prev, [playingId]: 0 };
                }
                return { ...prev, [playingId]: currentVal + 0.5 };
            });
        }, 100); 
    } else {
        if (playbackInterval.current) clearInterval(playbackInterval.current);
    }
    return () => {
        if (playbackInterval.current) clearInterval(playbackInterval.current);
    };
  }, [playingId]);

  const toggleAudio = (msgId: string, title: string) => {
    if (playingId === msgId) {
        setPlayingId(null); // Pause
        stopSound();
    } else {
        setPlayingId(msgId); // Play
        if (title.includes('Weightless')) {
            playSound('deep');
        } else {
            playSound('light');
        }
    }
  };

  const triggerBreathing = (type: 'box' | '478') => {
      const msg: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: JSON.stringify({ type: 'breathing', technique: type }),
          timestamp: new Date()
      };
      setMessages(prev => [...prev, msg]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, playingId]);

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

  const renderMessageContent = (msg: ChatMessage) => {
    const text = msg.text.trim();
    try {
        if (text.startsWith('{')) {
            const data = JSON.parse(text);
            
            if (data.type === 'breathing') {
                return (
                    <div className="bg-white rounded-xl p-3 mt-2 border border-slate-200 shadow-md w-full max-w-sm">
                         <BreathingVisual type={data.technique} />
                    </div>
                );
            }

            if (data.title || data.type === 'yoga' || data.type === 'song') {
                const isYoga = data.type === 'yoga';
                const isPlaying = playingId === msg.id;
                const currentProgress = progress[msg.id] || 0;

                return (
                    <div className="bg-white rounded-xl p-4 mt-2 border border-slate-200 shadow-md w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-full ${isYoga ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                {isYoga ? <Activity className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recommended Solution</span>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{data.title}</h3>
                                {data.artist && <p className="text-xs text-slate-500 font-medium">{data.artist}</p>}
                                {data.album && <p className="text-[10px] text-slate-400 italic mb-2 flex items-center gap-1"><Disc className="w-3 h-3"/> {data.album}</p>}
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-4">{data.description}</p>
                        
                        {isYoga ? (
                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <YogaVisual title={data.title} />
                                <p className="text-sm text-orange-800 italic">"{data.instruction}"</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 font-semibold">
                                    <Activity className="w-3 h-3" />
                                    {data.duration}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => toggleAudio(msg.id, data.title)}
                                        className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-sm"
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs text-purple-700 mb-1 font-medium">
                                            <span>{isPlaying ? 'Playing Audio...' : 'Paused'}</span>
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
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-400">
                                    <Volume2 className="w-3 h-3" />
                                    <span>Generating offline soothing audio...</span>
                                </div>
                                
                                {/* Volume Slider Control */}
                                <div className="mt-3 pt-2 border-t border-purple-100 flex items-center gap-2">
                                     <div className="text-purple-400">
                                         {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume1 className="w-3.5 h-3.5" />}
                                     </div>
                                     <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-purple-700 transition-colors"
                                     />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }
        
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
          <p className="text-teal-100 text-xs">Real-time Stress Monitoring • Audio & Video Guides</p>
        </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Relief Tools</p>
          <div className="flex gap-2">
              <button 
                onClick={() => triggerBreathing('box')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm"
              >
                  <Wind className="w-3.5 h-3.5" /> Box Breathing
              </button>
              <button 
                onClick={() => triggerBreathing('478')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors shadow-sm"
              >
                  <Timer className="w-3.5 h-3.5" /> 4-7-8 Breathing
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-2xl rounded-tr-none px-4 py-3' 
                : 'w-full'
            }`}>
               <div className={`${msg.role === 'user' ? '' : 'flex flex-col items-start'}`}>
                  {msg.role === 'model' && !msg.text.startsWith('{') && (
                      <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm mb-1">
                          {renderMessageContent(msg)}
                      </div>
                  )}
                  {msg.role === 'model' && msg.text.startsWith('{') && (
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
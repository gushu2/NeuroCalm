import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Music, Activity, Play, Pause, AlertCircle, Volume2, Wind, Timer } from 'lucide-react';
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
      instruction: "Kneel on the floor, touch big toes together, sit on heels, and lay your torso between your thighs."
    },
    {
      type: 'music',
      title: "Weightless - Marconi Union",
      description: "Scientifically proven to reduce anxiety by up to 65%.",
      instruction: "Close your eyes and focus on the rhythm."
    }
  ],
  [StressLevel.MILD]: [
    {
      type: 'yoga',
      title: "Neck Rolls",
      description: "Simple movement to release tension in the neck and shoulders.",
      instruction: "Gently roll your head in a circular motion, 5 times clockwise and 5 times counter-clockwise."
    },
    {
      type: 'music',
      title: "Lo-Fi Beats",
      description: "Relaxing background music to help you focus without stress.",
      instruction: "Listen at a low volume while you continue your tasks."
    }
  ],
  [StressLevel.NORMAL]: [
     {
      type: 'yoga',
      title: "Tree Pose (Vrksasana)",
      description: "Improves balance and focus.",
      instruction: "Stand on one leg, place the other foot on your inner thigh, and hold your hands in prayer position."
    },
    {
      type: 'music',
      title: "Nature Sounds",
      description: "Rain or forest sounds for deep work.",
      instruction: "Use headphones for an immersive experience."
    }
  ]
};

export const AICoach: React.FC<AICoachProps> = ({ currentBpm, stressLevel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your AI Wellness Coach. I monitor your heart rate and suggest Yoga poses or Music to help you regulate stress. How are you feeling right now?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // React to stress level changes
  useEffect(() => {
    if (stressLevel && stressLevel !== StressLevel.NORMAL) {
       const alertMsg: ChatMessage = {
           id: Date.now().toString(),
           role: 'model',
           text: stressLevel === StressLevel.HIGH 
             ? `I detected HIGH stress (${currentBpm} BPM). Please stop what you are doing. I recommend doing "Child's Pose" or listening to "Weightless". Shall I guide you?`
             : `I noticed your stress levels rising (${currentBpm} BPM). How about a quick "Neck Roll" or some calming music?`,
           timestamp: new Date()
       };
       // Prevent duplicate consecutive messages if needed, but for simplicity just add
       setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'model' && lastMsg.text === alertMsg.text) return prev;
          return [...prev, alertMsg];
       });
    }
  }, [stressLevel, currentBpm]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Use local service logic
      const responseText = await sendMessage(
        { history: messages }, 
        userMsg.text, 
        currentBpm, 
        stressLevel
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
             <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Wellness Coach</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online & Monitoring
            </p>
          </div>
        </div>
        {currentBpm && (
            <div className="text-right">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Live BPM</p>
                <p className="font-mono text-lg font-bold text-slate-700">{currentBpm}</p>
            </div>
        )}
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
             }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
             </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                 <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about yoga, music, or stress relief..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
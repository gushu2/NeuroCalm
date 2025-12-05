import React from 'react';
import { StressLevel } from '../types';
import { Music, Activity } from 'lucide-react';

interface WellnessToolkitProps {
  stressLevel: StressLevel;
}

export const WellnessToolkit: React.FC<WellnessToolkitProps> = ({ stressLevel }) => {
  
  // Revised recommendations strictly focusing on Song and Yoga
  const getRecommendations = () => {
    switch (stressLevel) {
      case StressLevel.HIGH:
        return [
          {
            title: "Yoga: Child's Pose",
            desc: "Resting pose to calm the brain.",
            icon: <Activity className="w-6 h-6 text-orange-500" />,
            color: "bg-orange-50 border-orange-100",
            type: "Yoga"
          },
          {
            title: "Song: Weightless",
            desc: "Marconi Union (Ambient).",
            icon: <Music className="w-6 h-6 text-stone-600" />,
            color: "bg-stone-100 border-stone-200",
            type: "Song"
          },
          {
            title: "Yoga: Corpse Pose",
            desc: "Total relaxation (Savasana).",
            icon: <Activity className="w-6 h-6 text-orange-500" />,
            color: "bg-orange-50 border-orange-100",
            type: "Yoga"
          }
        ];
      case StressLevel.MILD:
        return [
          {
            title: "Yoga: Cat-Cow Stretch",
            desc: "Relieves torso and neck tension.",
            icon: <Activity className="w-6 h-6 text-amber-500" />,
            color: "bg-amber-50 border-amber-100",
            type: "Yoga"
          },
          {
            title: "Song: River Flows in You",
            desc: "Yiruma - Gentle Piano.",
            icon: <Music className="w-6 h-6 text-orange-400" />,
            color: "bg-orange-50 border-orange-100",
            type: "Song"
          },
          {
            title: "Yoga: Standing Forward",
            desc: "Calms the nervous system.",
            icon: <Activity className="w-6 h-6 text-amber-500" />,
            color: "bg-amber-50 border-amber-100",
            type: "Yoga"
          }
        ];
      default: // Normal
        return [
          {
            title: "Song: Lo-Fi Beats",
            desc: "Chill beats for studying.",
            icon: <Music className="w-6 h-6 text-stone-500" />,
            color: "bg-stone-50 border-stone-200",
            type: "Song"
          },
          {
            title: "Yoga: Tree Pose",
            desc: "Improves balance and focus.",
            icon: <Activity className="w-6 h-6 text-orange-500" />,
            color: "bg-orange-50 border-orange-100",
            type: "Yoga"
          },
          {
            title: "Song: Nature Sounds",
            desc: "Rain sounds for deep work.",
            icon: <Music className="w-6 h-6 text-stone-500" />,
            color: "bg-stone-50 border-stone-200",
            type: "Song"
          }
        ];
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-stone-800 font-bold text-xl">Wellness Solutions</h2>
          <p className="text-stone-500 text-sm mt-1">Recommended Songs & Yoga Positions</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            stressLevel === StressLevel.HIGH ? 'bg-red-100 text-red-700' : 
            stressLevel === StressLevel.MILD ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
        }`}>
            Status: {stressLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${rec.color} transition-all hover:shadow-md cursor-pointer flex items-start gap-4 group`}>
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                {rec.icon}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{rec.type}</span>
                </div>
                <h3 className="font-semibold text-stone-800">{rec.title}</h3>
                <p className="text-sm text-stone-600 mt-1 leading-snug">{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
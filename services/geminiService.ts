import { StressLevel } from "../types";

// Completely offline service. No external API imports.

export interface LocalChat {
    history: any[];
}

export const createChatSession = (): any => {
  return {
    history: []
  };
};

export const sendMessage = async (chat: any, message: string, currentBpm?: number, stressLevel?: StressLevel): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMsg = message.toLowerCase();

  // Logic to strictly suggest Yoga or Music based on keywords or stress
  
  if (stressLevel === StressLevel.HIGH) {
    return "I detect High Stress. I strongly recommend the 'Child's Pose' (Balasana) to calm your nervous system immediately, or listen to 'Weightless' by Marconi Union.";
  }
  
  if (stressLevel === StressLevel.MILD) {
    return "Your stress levels are rising slightly. Try a quick 'Neck Roll' exercise or listen to some Lo-Fi beats to regain focus.";
  }

  if (lowerMsg.includes("yoga") || lowerMsg.includes("pose") || lowerMsg.includes("exercise")) {
    return "For stress relief, I recommend:\n\n1. Child's Pose (Resting)\n2. Cat-Cow Stretch (Tension Release)\n3. Legs-Up-The-Wall (Circulation)\n\nWould you like instructions for one?";
  }

  if (lowerMsg.includes("music") || lowerMsg.includes("song") || lowerMsg.includes("listen")) {
    return "Music is a powerful tool for regulation. I can play:\n\n1. 'Weightless' (Ambient)\n2. 'River Flows in You' (Piano)\n3. Nature Sounds (Rain)\n\nJust ask!";
  }

  return "I am in Offline Monitor Mode. I'm tracking your heart rate and will notify you with a Song or Yoga pose if your stress level rises.";
};
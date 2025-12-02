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
  await new Promise(resolve => setTimeout(resolve, 600));

  const lowerMsg = message.toLowerCase().trim();

  // ---------------------------------------------------------
  // 1. Explicit User Commands (High Priority)
  // ---------------------------------------------------------

  // Specific Song Requests -> Return Playable JSON Card
  if (lowerMsg.includes("weightless")) {
    return JSON.stringify({
      type: 'song',
      title: "Weightless",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmissions Vol. 2)",
      description: "Ambient therapy track designed to lower heart rate.",
      durationStr: "08:00",
      durationSec: 480
    });
  }

  if (lowerMsg.includes("river") || lowerMsg.includes("flow") || lowerMsg.includes("piano") || lowerMsg.includes("yiruma")) {
     return JSON.stringify({
      type: 'song',
      title: "River Flows in You",
      artist: "Yiruma",
      album: "First Love",
      description: "Gentle piano melody to bring your mind back to center.",
      durationStr: "03:45",
      durationSec: 225
    });
  }

  // Generic Music Request -> Default to Weightless Card
  // Expanded keywords list to catch more user intents
  const musicKeywords = ["music", "song", "play", "listen", "audio", "sound", "hear", "track", "beat", "melody", "tune"];
  if (musicKeywords.some(keyword => lowerMsg.includes(keyword))) {
     return JSON.stringify({
      type: 'song',
      title: "Weightless",
      artist: "Marconi Union",
      album: "Weightless (Ambient Transmissions Vol. 2)",
      description: "Here is a scientifically proven track to reduce anxiety. Click play to start.",
      durationStr: "08:00",
      durationSec: 480
    });
  }

  // Specific Yoga Requests
  if (lowerMsg.includes("child")) {
     return JSON.stringify({
      type: 'yoga',
      title: "Child's Pose (Balasana)",
      description: "A deep resting pose that calms the brain and relieves stress.",
      instruction: "Kneel on the floor, touch big toes together, sit on heels, and lay your torso between your thighs.",
      duration: "3 min"
    });
  }

  if (lowerMsg.includes("neck") || lowerMsg.includes("head") || lowerMsg.includes("shoulder")) {
     return JSON.stringify({
      type: 'yoga',
      title: "Seated Neck Release",
      description: "Relieves immediate tension in the neck and shoulders.",
      instruction: "Sit comfortably. Drop right ear to right shoulder. Breathe deeply. Repeat on left side.",
      duration: "1 minute per side"
    });
  }

  // Generic Yoga Request -> Default to Neck Release
  const yogaKeywords = ["yoga", "pose", "exercise", "stretch", "workout", "move", "body"];
  if (yogaKeywords.some(keyword => lowerMsg.includes(keyword))) {
     return JSON.stringify({
      type: 'yoga',
      title: "Seated Neck Release",
      description: "Simple movement to release tension immediately.",
      instruction: "Sit comfortably. Drop right ear to right shoulder. Breathe deeply. Repeat on left side.",
      duration: "1 min"
    });
  }

  // ---------------------------------------------------------
  // 2. Contextual Stress Responses (If no command given)
  // ---------------------------------------------------------
  
  if (stressLevel === StressLevel.HIGH) {
    return "I detect High Stress. I strongly recommend the 'Child's Pose' or listening to 'Weightless' to calm down. Type 'play music' or 'show yoga' to begin.";
  }
  
  if (stressLevel === StressLevel.MILD) {
    return "Your stress levels are rising slightly. Try a quick 'Neck Roll' or ask me to 'Play Music'.";
  }

  // ---------------------------------------------------------
  // 3. Default Fallback
  // ---------------------------------------------------------
  // Make the fallback more actionable
  return "I'm monitoring your heart rate. You can ask me to 'Play Music', 'Show Yoga', or 'Start Breathing' at any time.";
};
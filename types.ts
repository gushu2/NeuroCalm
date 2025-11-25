export enum StressLevel {
  NORMAL = 'Normal',
  MILD = 'Mild',
  HIGH = 'High',
}

export interface HeartRateData {
  timestamp: string;
  bpm: number;
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

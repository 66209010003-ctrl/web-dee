
export interface UserProfile {
  name: string;
  disease: string;
  birthDate: string;
  profileImage?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm format
  days: string[]; // ['Mon', 'Tue', ...]
  active: boolean;
  icon: string;
}

export interface HistoryLog {
  id: string;
  medicationName: string;
  timeTaken: string;
  status: 'taken' | 'skipped';
  timestamp: number;
}

export enum AppScreen {
  PROFILE = 'PROFILE',
  SETTING_MED = 'SETTING_MED',
  DASHBOARD = 'DASHBOARD',
  EDIT_MED = 'EDIT_MED',
  ALARM = 'ALARM',
  HISTORY = 'HISTORY'
}

export interface Chat {
  id: string;
  name: string;
  phone: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'typing';
  lastMessage: Message;
  isGroup?: boolean;
  groupAdmin?: string;
  participants?: string[];
  avatar?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'contact' | 'bot';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  media?: MediaContent;
  reactions?: string[];
  seenBy?: string[];
}

export interface MediaContent {
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  isUploading?: boolean;
  uploadProgress?: number;
  onRemove?: () => void;
}

export interface ScheduledMessage {
  id: string;
  chatId: string;
  content: string;
  scheduledFor: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'sent' | 'failed';
}

export interface AutoReplyRule {
  id: string;
  pattern: string;
  response: string;
  isEnabled: boolean;
  schedule: 'always' | 'outside-hours' | 'custom';
  customSchedule?: {
    days: number[];  // Array of integers representing the days (e.g., [0, 1, 2] for Sunday, Monday, and Tuesday)
    startTime: string;  // Time in HH:mm format
    endTime: string;    // Time in HH:mm format
  };
}

export interface ChatBotConfig {
  isEnabled: boolean;
  personality: 'professional' | 'friendly' | 'casual';
  contextLength: number;  // The maximum number of past messages the bot should consider
  triggers: string[];     // List of trigger phrases that activate the bot
  defaultResponses: string[]; // Default responses for the bot when no trigger is matched
}

export interface Account {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  avatar?: string;  // Optional avatar image for the account
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: string;  // Timestamp in ISO 8601 format
}

export interface VoiceMessage extends MediaContent {
  duration: number;  // Duration of the voice message in seconds
  waveform?: number[];  // Optional array to represent waveform data for playback visualization
}

export interface ChatSettings {
  notifications: boolean;   // Flag to enable or disable notifications
  muteUntil?: string;       // Optional timestamp when notifications should be unmuted (ISO 8601 format)
  autoReply?: AutoReplyRule;  // Optional auto-reply rule for the chat
  theme?: 'light' | 'dark' | 'system';  // Theme settings for the chat (light, dark, or system default)
  language?: string;        // Language setting for the chat (e.g., 'en', 'es')
}

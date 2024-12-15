// src/components/WhatsApp/mockData.ts
import { Chat, Message, ScheduledMessage, AutoReplyRule } from './types';

// Mock accounts data with 'as const' for immutability
export const MOCK_ACCOUNTS = [
  { id: '1', name: 'Personal', phone: '+1234567890', isActive: true },
  { id: '2', name: 'Business', phone: '+0987654321', isActive: false },
  { id: '3', name: 'Ali', phone: '+1111111111', isActive: true },
  { id: '4', name: 'Salman', phone: '+2222222222', isActive: false },
  { id: '5', name: 'Asif', phone: '+3333333333', isActive: true },
] as const;

// Mock chat data with varied statuses, including group chats
export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    unreadCount: 2,
    status: 'online',
    lastMessage: {
      id: 'm1',
      sender: 'contact',
      content: "Let's discuss the project",
      timestamp: new Date().toISOString(),
      status: 'delivered',
    },
  },
  {
    id: '2',
    name: 'Marketing Team',
    phone: 'group',
    unreadCount: 5,
    status: 'typing',
    lastMessage: {
      id: 'm2',
      sender: 'contact',
      content: "Alice is typing...",
      timestamp: new Date().toISOString(),
      status: 'sent',
    },
    isGroup: true,
    groupAdmin: 'user1',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    phone: '+5555555555',
    unreadCount: 0,
    status: 'offline',
    lastMessage: {
      id: 'm3',
      sender: 'user',
      content: "Thanks for the update!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'read',
    },
  },
  {
    id: '4',
    name: 'Ali',
    phone: '+1111111111',
    unreadCount: 1,
    status: 'online',
    lastMessage: {
      id: 'm4',
      sender: 'user',
      content: "Hello Ali, how's the progress?",
      timestamp: new Date().toISOString(),
      status: 'sent',
    },
  },
  {
    id: '5',
    name: 'Salman',
    phone: '+2222222222',
    unreadCount: 3,
    status: 'offline',
    lastMessage: {
      id: 'm5',
      sender: 'contact',
      content: "Salman, can you send the report?",
      timestamp: new Date().toISOString(),
      status: 'delivered',
    },
  },
  {
    id: '6',
    name: 'Asif',
    phone: '+3333333333',
    unreadCount: 0,
    status: 'typing',
    lastMessage: {
      id: 'm6',
      sender: 'user',
      content: "Asif, what's the status on the project?",
      timestamp: new Date().toISOString(),
      status: 'sent',
    },
  },
];

// Mock message data per chat ID
export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'user',
      content: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: 'delivered',
    },
    {
      id: 'm2',
      sender: 'contact',
      content: "I'm good, thanks! Shall we discuss the project?",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'read',
    },
  ],
  '4': [
    {
      id: 'm4',
      sender: 'user',
      content: 'Hey Ali, how are you doing?',
      timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      status: 'sent',
    },
    {
      id: 'm5',
      sender: 'contact',
      content: "I'm doing great, let's catch up soon!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'delivered',
    },
  ],
  '5': [
    {
      id: 'm6',
      sender: 'user',
      content: 'Salman, do you have the updated report?',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'sent',
    },
    {
      id: 'm7',
      sender: 'contact',
      content: "I'm sending it over now.",
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      status: 'delivered',
    },
  ],
  '6': [
    {
      id: 'm8',
      sender: 'user',
      content: 'Asif, how is the progress on the project?',
      timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      status: 'sent',
    },
    {
      id: 'm9',
      sender: 'contact',
      content: "I am almost done, just a few things left.",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'delivered',
    },
  ],
};

// Mock scheduled messages for future delivery
export const MOCK_SCHEDULED_MESSAGES: ScheduledMessage[] = [
  {
    id: 's1',
    chatId: '1',
    content: 'Follow up on proposal',
    scheduledFor: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    repeat: 'none',
    status: 'pending',
  },
  {
    id: 's2',
    chatId: '2',
    content: 'Weekly team update reminder',
    scheduledFor: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
    repeat: 'weekly',
    status: 'pending',
  },
];

// Mock auto-reply rules with pattern matching
export const MOCK_AUTO_REPLY_RULES: AutoReplyRule[] = [
  {
    id: 'r1',
    pattern: 'working hours',
    response: 'Our working hours are 9 AM to 6 PM EST',
    isEnabled: true,
    schedule: 'always', // Always available
  },
  {
    id: 'r2',
    pattern: 'price|cost|quote',
    response: 'Please visit our website for pricing details',
    isEnabled: true,
    schedule: 'outside-hours', // Available only outside working hours
  },
];

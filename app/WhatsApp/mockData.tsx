// src/components/WhatsApp/mockData.ts
import { Chat, Message, ScheduledMessage, AutoReplyRule } from './types';

export const MOCK_ACCOUNTS = [
  { id: '1', name: 'Personal', phone: '+1234567890', isActive: true },
  { id: '2', name: 'Business', phone: '+0987654321', isActive: false }
] as const;

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
      status: 'delivered'
    }
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
      status: 'sent'
    },
    isGroup: true,
    groupAdmin: 'user1',
    participants: ['user1', 'user2', 'user3']
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
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'read'
    }
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'user',
      content: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'delivered'
    },
    {
      id: 'm2',
      sender: 'contact',
      content: "I'm good, thanks! Shall we discuss the project?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'read'
    }
  ]
};

export const MOCK_SCHEDULED_MESSAGES: ScheduledMessage[] = [
  {
    id: 's1',
    chatId: '1',
    content: 'Follow up on proposal',
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    repeat: 'none',
    status: 'pending'
  },
  {
    id: 's2',
    chatId: '2',
    content: 'Weekly team update reminder',
    scheduledFor: new Date(Date.now() + 172800000).toISOString(),
    repeat: 'weekly',
    status: 'pending'
  }
];

export const MOCK_AUTO_REPLY_RULES: AutoReplyRule[] = [
  {
    id: 'r1',
    pattern: 'working hours',
    response: 'Our working hours are 9 AM to 6 PM EST',
    isEnabled: true,
    schedule: 'always'
  },
  {
    id: 'r2',
    pattern: 'price|cost|quote',
    response: 'Please visit our website for pricing details',
    isEnabled: true,
    schedule: 'outside-hours'
  }
];
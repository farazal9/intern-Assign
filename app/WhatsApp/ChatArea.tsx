import React, { useRef, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider
} from "@nextui-org/react";
import { 
  Download, 
  Bot, 
  Settings, 
  Phone,
  MoreVertical,
  ThumbsUp,
  Heart,
  Laugh,
  Frown,
  Clock,
  Video,
  PhoneCall,
  Search
} from "lucide-react";
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { Chat, Message } from './types';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
  onReaction?: (messageId: string, reaction: string) => void;
  onDownloadMedia?: (messageId: string) => void;
}

const reactions = [
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "❤️", icon: Heart },
  { emoji: "😄", icon: Laugh },
  { emoji: "😢", icon: Frown }
];

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  chat, 
  messages,
  onSendMessage,
  onReaction,
  onDownloadMedia
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <Card className="h-full bg-gradient-to-r from-blue-50 to-blue-100">
        <CardBody className="h-full flex flex-col items-center justify-center">
          <div className="text-center text-gray-600">
            <Phone size={48} className="mx-auto mb-4 text-blue-400" />
            <p className="text-2xl font-bold mb-2 text-blue-600">Welcome to Chat</p>
            <p className="text-md">Select a conversation to start messaging</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const getMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full bg-white shadow-xl rounded-lg">
      <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            name={chat.name}
            size="sm"
            className="transition-transform transform hover:scale-110 shadow-md"
          />
          <div>
            <h4 className="text-lg font-semibold leading-none">{chat.name}</h4>
            <p className="text-sm text-gray-200">
              {chat.status === 'typing' 
                ? 'typing...' 
                : chat.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Video Call">
            <Button isIconOnly variant="flat" size="sm" className="hover:bg-blue-700">
              <Video size={20} className="text-white" />
            </Button>
          </Tooltip>
          <Tooltip content="Phone Call">
            <Button isIconOnly variant="flat" size="sm" className="hover:bg-blue-700">
              <PhoneCall size={20} className="text-white" />
            </Button>
          </Tooltip>
          <Tooltip content="Search">
            <Button isIconOnly variant="flat" size="sm" className="hover:bg-blue-700">
              <Search size={20} className="text-white" />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>

      <Divider className="bg-gray-200"/>

      <CardBody className="p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {messages.map((message, index) => {
            const showDateSeparator = index === 0 || 
              getMessageDate(message.timestamp) !== 
              getMessageDate(messages[index - 1].timestamp);

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <div className="flex justify-center">
                    <span className="text-xs font-medium bg-gray-300 text-gray-700 px-3 py-1 rounded-full">
                      {getMessageDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  isSequential={
                    index > 0 &&
                    messages[index - 1].sender === message.sender &&
                    !showDateSeparator &&
                    Date.parse(message.timestamp) - Date.parse(messages[index - 1].timestamp) < 60000
                  }
                  onReaction={onReaction}
                  // onDownloadMedia={onDownloadMedia}
                  // isHovered={hoveredMessage === message.id}
                  // onHover={setHoveredMessage}
                  // reactions={reactions}
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardBody>

      <Divider className="bg-gray-200"/>

      <MessageInput 
        chatId={chat.id} 
        onSend={onSendMessage}
      />
    </Card>
  );
};

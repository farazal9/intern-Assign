import React, { useRef, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Divider
} from "@nextui-org/react";
import {
  Download,
  Bot,
  Settings,
  Phone
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

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  if (!chat) {
    return (
      <Card className="h-full bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-none sm:rounded-lg">
         <CardBody className="h-full flex flex-col items-center justify-center">
          <div className="text-center text-gray-400">
            <Phone size={48} className="mx-auto mb-4 text-blue-300" />
            <p className="text-2xl font-bold mb-2 text-blue-500">Welcome to Chat</p>
            <p className="text-md">Select a conversation to start messaging</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-none sm:rounded-lg">

      <CardHeader className="justify-between border-b border-gray-700">
        <div className="flex gap-3">
          <Avatar
            name={chat.name}
            size="sm"
            className="transition-transform hover:scale-110"
          />
          <div>
            <h4 className="text-small font-semibold leading-none text-gray-200">{chat.name}</h4>
            <p className="text-tiny text-gray-400">
              {chat.status === 'typing'
                ? 'typing...'
                : chat.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Media & Files">
            <Button isIconOnly variant="light" size="sm" className="text-gray-400 hover:text-white">
              <Download size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Auto-Reply Settings">
            <Button isIconOnly variant="light" size="sm" className="text-gray-400 hover:text-white">
              <Bot size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Chat Settings">
            <Button isIconOnly variant="light" size="sm" className="text-gray-400 hover:text-white">
              <Settings size={20} />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>

      <Divider className="border-gray-700" />

      <CardBody className="p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showDateSeparator = index === 0 ||
              getMessageDate(message.timestamp) !==
              getMessageDate(messages[index - 1].timestamp);

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <div className="flex justify-center">
                    <span className="text-tiny bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
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
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardBody>

      <Divider className="border-gray-700" />

      <MessageInput
        chatId={chat.id}
        onSend={onSendMessage}
        className="bg-gray-700 text-gray-300 placeholder-gray-500 hover:bg-gray-600 focus:ring-gray-500"
      />
    </Card>
  );
};

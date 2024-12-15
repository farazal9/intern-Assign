import React, { useRef, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Divider,
  Input,
  Modal,
} from "@nextui-org/react";
import { Video, Phone, Search, X, Volume2, Mic, Camera } from "lucide-react";
import Webcam from "react-webcam";
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { Chat, Message } from './types';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState<boolean>(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    setSearchQuery("");
  };

  const handleVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const handleVoiceCall = () => {
    setIsVoiceCallActive(true);
  };

  const endCall = () => {
    setIsVideoCallActive(false);
    setIsVoiceCallActive(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const flipCamera = () => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

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
      day: 'numeric',
    });
  };

  // New function to check if message content matches search query
  const isMessageMatched = (message: string) => {
    return message.toLowerCase().includes(searchQuery.toLowerCase());
  };

  if (!chat) {
    return (
      <Card className="h-full">
        <CardBody className="h-full items-center justify-center">
          <div className="text-center text-default-500">
            <Phone size={48} className="mx-auto mb-4" />
            <p className="text-xl font-semibold mb-2">Welcome to Chat</p>
            <p className="text-small">Select a conversation to start messaging</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="justify-between border-b flex-col">
        <div className="flex justify-between items-center w-full mb-2">
          <div className="flex gap-3">
            <Avatar
              src={chat.avatar || ''} // Add user DP or fallback to initials
              size="sm"
              className="transition-transform hover:scale-110"
            >
              {!chat.avatar && chat.name.charAt(0)} {/* Display the first letter of name if no avatar */}
            </Avatar>
            <div>
              <h4 className="text-small font-semibold leading-none">{chat.name}</h4>
              <p className="text-tiny text-default-500">
                {chat.status === 'typing'
                  ? 'typing...'
                  : chat.status}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip content="Video Call">
              <Button isIconOnly variant="light" size="sm" onClick={handleVideoCall}>
                <Video size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Voice Call">
              <Button isIconOnly variant="light" size="sm" onClick={handleVoiceCall}>
                <Phone size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Search">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={toggleSearch}
              >
                <Search size={20} />
              </Button>
            </Tooltip>
          </div>
        </div>
        {isSearchActive && (
          <Input
            placeholder="Search messages..."
            size="sm"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            contentLeft={<Search size={20} />}
            className="w-full"
          />
        )}
      </CardHeader>

      <Divider />

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
                    <span className="text-tiny bg-default-100 text-default-600 px-3 py-1 rounded-full">
                      {getMessageDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  isSequential={index > 0 &&
                    messages[index - 1].sender === message.sender &&
                    !showDateSeparator &&
                    Date.parse(message.timestamp) - Date.parse(messages[index - 1].timestamp) < 60000
                  }
                  isHighlighted={searchQuery && isMessageMatched(message.content)} // New prop for highlight
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardBody>

      <Divider />

      <MessageInput
        chatId={chat.id}
        onSend={onSendMessage}
      />

      {/* Video Call Modal */}
      <Modal
        isOpen={isVideoCallActive}
        onClose={endCall}
        aria-labelledby="video-call-modal"
        className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-75"
      >
        <div className="relative flex flex-col justify-center items-center w-full h-full">
          <Webcam
            videoConstraints={{ facingMode: cameraFacingMode }}
            className="w-full h-full bg-black object-cover"
          />
          <div className="absolute bottom-8 flex gap-6">
            <Button isIconOnly variant="light" onClick={toggleMute}>
              {isMuted ? <Mic size={24} /> : <Volume2 size={24} />}
            </Button>
            <Button isIconOnly variant="light" onClick={flipCamera}>
              <Camera size={24} />
            </Button>
            <Button isIconOnly className="bg-red-500 text-white" onClick={endCall}>
              <X size={24} />
            </Button>
          </div>
        </div>
      </Modal>

      {/* Voice Call Modal */}
      <Modal
        isOpen={isVoiceCallActive}
        onClose={endCall}
        aria-labelledby="voice-call-modal"
        className="w-screen h-screen flex justify-center items-center bg-black bg-opacity-75"
      >
        <div className="flex flex-col items-center">
          <p className="text-white text-2xl mb-6">Voice Call</p>
          <div className="flex gap-6">
            <Button isIconOnly variant="light" onClick={toggleMute}>
              {isMuted ? <Mic size={24} /> : <Volume2 size={24} />}
            </Button>
            <Button isIconOnly className="bg-red-500 text-white" onClick={endCall}>
              <X size={24} />
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

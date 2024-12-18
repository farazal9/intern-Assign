
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { 
  ThumbsUp,
  Heart,
  Laugh,
  Frown,
  MoreVertical,
  Reply,
  Trash 
} from "lucide-react";
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  isSequential?: boolean;
  onReaction?: (messageId: string, reaction: string) => void;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
}

const reactions = [
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "❤️", icon: Heart },
  { emoji: "😄", icon: Laugh },
  { emoji: "😢", icon: Frown }
];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSequential = false,
  onReaction,
  onReply,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isOutgoing = message.sender === 'user';

  return (
    <div 
      className={`group flex items-end gap-2 ${
        isOutgoing ? 'justify-end' : 'justify-start'
      } ${isSequential ? 'mt-1' : 'mt-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isOutgoing && !isSequential && (
        <Avatar
          name={message.sender}
          size="sm"
          className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}

      <div className={`relative max-w-[70%] ${
        !isOutgoing && isSequential ? 'ml-8' : ''
      }`}>
        {/* Reply preview */}
        {message.replyTo && (
          <div className={`
            mb-1 p-2 rounded-lg text-tiny
            ${isOutgoing 
              ? 'bg-primary/20 ml-4' 
              : 'bg-default-100 mr-4'
            }
          `}>
            <p className="font-medium text-default-600">
              {message.replyTo.sender}
            </p>
            <p className="text-default-500 truncate">
              {message.replyTo.content}
            </p>
          </div>
        )}

     
        {/* Message Bubble */}
        <div
          className={`p-2 rounded-lg shadow-md ${
            isOutgoing
              ? "bg-[#DCF8C6] text-black" // Outgoing (green bubble)
              : "bg-white text-black" // Incoming (white bubble)
          }`}
        >
          {/* Media content */}
          {message.media && (
            <div className="mb-2">
              {message.media.type === 'image' && (
                <img
                  src={message.media.url}
                  alt={message.media.filename}
                  className="max-w-full rounded-lg"
                />
              )}
            </div>
          )}

          {/* Message text */}
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Message footer */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-tiny opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Reaction and action buttons */}
        {isHovered && (
          <>
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className={`absolute ${
                    isOutgoing ? '-left-16' : '-right-16'
                  } bottom-0`}
                >
                  <ThumbsUp size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex gap-2 p-2">
                  {reactions.map(({ emoji, icon: Icon }) => (
                    <Button
                      key={emoji}
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => onReaction?.(message.id, emoji)}
                    >
                      <Icon size={16} />
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className={`absolute ${
              isOutgoing ? '-right-16' : '-left-16'
            } top-0 flex flex-col gap-1`}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onReply?.(message)}
              >
                <Reply size={16} />
              </Button>
              {isOutgoing && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-danger"
                  onPress={() => onDelete?.(message.id)}
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
          </>
        )}

        {/* Reactions display */}
        {/* {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full bg-default-100 text-tiny"
              >
                {reaction}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};
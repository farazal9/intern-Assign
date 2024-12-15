import React from 'react';
import { Avatar, AvatarGroup, Tooltip, Progress, Button } from "@nextui-org/react";
import { Message } from './types';
import { XCircle } from "lucide-react";

// Typing Indicator Component
export const TypingIndicator = () => (
  <div className="flex gap-1 p-2 rounded-lg bg-default-100 dark:bg-default-50 w-fit">
    {['0ms', '150ms', '300ms'].map((delay, index) => (
      <div
        key={index}
        className="w-2 h-2 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: delay }}
      />
    ))}
  </div>
);

// Message Time Display
export const MessageTime: React.FC<{ timestamp: string }> = ({ timestamp }) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  let timeStr;
  if (diffInHours < 24) {
    timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    timeStr = `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    timeStr = date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
    });
  }

  return (
    <Tooltip content={date.toLocaleString()}>
      <span className="text-tiny text-default-400">{timeStr}</span>
    </Tooltip>
  );
};

// Message Reactions Display
export const MessageReactions: React.FC<{ 
  reactions: string[];
  participants?: string[];
}> = ({ reactions, participants }) => {
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction] = (acc[reaction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(reactionCounts).map(([reaction, count]) => (
        <Tooltip
          key={reaction}
          content={
            participants
              ? `${participants.slice(0, count).join(', ')} reacted with ${reaction}`
              : `${count} reactions`
          }
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-default-200 dark:bg-default-100">
            <span className="text-default-600 dark:text-default-400">{reaction}</span>
            <span className="text-tiny text-default-500">{count}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

// Read Receipt Status
export const ReadReceipt: React.FC<{
  status: Message['status'];
  seenBy?: string[];
}> = ({ status, seenBy }) => {
  if (status === 'read' && seenBy?.length) {
    return (
      <Tooltip
        content={
          <div className="p-2">
            <p className="font-medium mb-1">Seen by:</p>
            <ul className="space-y-1">
              {seenBy.map(name => (
                <li key={name} className="text-small">{name}</li>
              ))}
            </ul>
          </div>
        }
      >
        <AvatarGroup
          size="sm"
          max={3}
          total={seenBy.length}
          className="justify-end"
        >
          {seenBy.map(name => (
            <Avatar
              key={name}
              name={name}
              className="w-6 h-6"
              showFallback
            />
          ))}
        </AvatarGroup>
      </Tooltip>
    );
  }
  return null;
};

// Upload Progress Indicator
export const UploadProgress: React.FC<{
  progress: number;
  fileName: string;
  onCancel?: () => void;
}> = ({ progress, fileName, onCancel }) => (
  <div className="flex flex-col gap-2 p-3 bg-default-200 dark:bg-default-50 rounded-lg">
    <div className="flex items-center justify-between">
      <p className="text-small font-medium truncate">{fileName}</p>
      {onCancel && (
        <Button
          isIconOnly
          variant="ghost"
          onPress={onCancel}
          className="text-danger"
        >
          <XCircle size={16} />
        </Button>
      )}
    </div>
    <Progress
      size="sm"
      value={progress}
      color={progress === 100 ? 'success' : 'primary'}
      className="max-w-full"
    />
  </div>
);

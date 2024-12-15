import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import {
  Paperclip,
  Send,
  Smile,
  Image as ImageIcon,
  FileText,
  Mic,
  Calendar,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface MessageInputProps {
  chatId: string;
  onSend?: (message: string, attachments?: File[]) => void;
  onVoiceRecord?: (blob: Blob) => void;
  onSchedule?: (message: string, date: Date) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  onSend,
  onVoiceRecord,
  onSchedule,
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number>();
  const { theme } = useTheme();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onVoiceRecord?.(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setRecordingTime(0);
    clearInterval(recordingTimerRef.current);
  };

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && onSend) {
      onSend(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleScheduleSend = () => {
    const date = new Date(scheduledDate);
    const [hours, minutes] = scheduledTime.split(":");
    date.setHours(parseInt(hours || "0"), parseInt(minutes || "0"));

    onSchedule?.(message, date);
    setShowSchedule(false);
    setMessage("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="p-3 flex flex-col gap-2">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-default-100 rounded-lg">
                    <FileText size={24} />
                  </div>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                  onPress={() => {
                    setAttachments((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          {/* Attachment Button */}
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <Paperclip size={20} className="text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="image"
                startContent={<ImageIcon size={18} />}
                onPress={() => fileInputRef.current?.click()}
              >
                Image or Video
              </DropdownItem>
              <DropdownItem
                key="document"
                startContent={<FileText size={18} />}
                onPress={() => fileInputRef.current?.click()}
              >
                Document
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Emoji Picker */}
          <Popover placement="top">
            <PopoverTrigger>
              <Button isIconOnly variant="light">
                <Smile size={20} className="text-default-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  setMessage((prev) => prev + emoji.native);
                }}
                theme={theme === "dark" ? "dark" : "light"}
              />
            </PopoverContent>
          </Popover>

          {/* Message Input */}
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            endContent={
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setShowSchedule(true)}
                >
                  <Calendar size={20} className="text-default-500" />
                </Button>
                {isRecording ? (
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    className="min-w-[80px]"
                    onPress={stopRecording}
                  >
                    {formatTime(recordingTime)}
                  </Button>
                ) : (
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={startRecording}
                  >
                    <Mic size={20} className="text-default-500" />
                  </Button>
                )}
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled={!message.trim() && attachments.length === 0}
                  onPress={handleSend}
                >
                  <Send size={20} />
                </Button>
              </div>
            }
          />
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)}>
        <ModalContent>
          <ModalHeader>Schedule Message</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              type="date"
              label="Date"
              value={scheduledDate.toISOString().split("T")[0]}
              onChange={(e) => setScheduledDate(new Date(e.target.value))}
            />
            <Input
              type="time"
              label="Time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowSchedule(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleScheduleSend}>
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageInput;

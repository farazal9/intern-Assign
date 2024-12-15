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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MessageInputProps = {
  chatId: string;
  onSend?: (message: string, attachments?: File[], voiceBlob?: Blob) => void;
  onVoiceRecord?: (blob: Blob) => void;
  onSchedule?: (message: string, date: Date) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  onSend,
  onVoiceRecord,
  onSchedule,
}) => {
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number>();
  const scheduledTimeoutIdRef = useRef<number | null>(null);
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
        setVoiceBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
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

  const resetMessageInputs = () => {
    setMessage("");
    setAttachments([]);
    setVoiceBlob(null);
    setAudioURL(null);
  };

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0 || voiceBlob) && onSend) {
      onSend(message.trim(), attachments, voiceBlob || undefined);
      resetMessageInputs();
      toast.success("Message sent!");
    }
  };

  const handleScheduleSend = () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please specify both a scheduled date and time.");
      return;
    }

    const scheduledDateTime = new Date(scheduledDate);
    const [hours, minutes] = scheduledTime.split(":");
    scheduledDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const timeDifference = scheduledDateTime.getTime() - Date.now();

    if (timeDifference <= 0) {
      toast.error("Scheduled time must be in the future. Please select a valid time.");
      return;
    }

    setShowSchedule(false);

    scheduledTimeoutIdRef.current = window.setTimeout(() => {
      if (onSend) {
        onSend(message.trim(), attachments, voiceBlob || undefined);
      }
      resetMessageInputs();
      toast.success("Scheduled message sent!");
    }, timeDifference);

    toast.success(`Message scheduled for: ${scheduledDateTime.toLocaleString()}`);
  };

  const cancelScheduledMessage = () => {
    if (scheduledTimeoutIdRef.current) {
      clearTimeout(scheduledTimeoutIdRef.current);
      scheduledTimeoutIdRef.current = null;
      toast.info("Scheduled message canceled.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="p-5 flex flex-col gap-3 bg-gradient-to-br from-blue-50 via-teal-50 to-lime-100 rounded-lg shadow-lg dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-white transition-all">
        {attachments.length > 0 && (
          <div className="flex gap-3 overflow-x-auto p-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md">
                    <FileText size={24} />
                  </div>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white dark:bg-gray-700"
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

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-700 dark:text-white transition-transform hover:scale-105"
              >
                <Paperclip size={20} />
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

          <Popover placement="top">
            <PopoverTrigger>
              <Button isIconOnly variant="light" className="text-gray-700 dark:text-white">
                <Smile size={20} />
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
                  <Calendar size={20} />
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
                    <Mic size={20} />
                  </Button>
                )}
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled
                >
                  <Send size={20} />
                </Button>
              </div>
            }
          />
        </div>
      </div>

      {showSchedule && (
        <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)}>
          <ModalContent>
            <ModalHeader>Schedule Message</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
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
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={cancelScheduledMessage}>
                Cancel Scheduled Message
              </Button>
              <Button color="primary" onPress={handleScheduleSend}>
                Schedule
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <ToastContainer />
    </>
  );
};

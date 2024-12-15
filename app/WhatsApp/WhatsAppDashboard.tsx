"use client"

import React, { useState, useCallback, useEffect } from 'react';
import {
  Navbar,
  NavbarContent, 
  NavbarBrand,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Tooltip
} from "@nextui-org/react";
import { MessageCircle, Plus, Menu } from "lucide-react";
import { ChatSidebar } from './ChatSideBar';
import { ChatArea } from './ChatArea';
import { ChatBotConfig } from './types';
import { BotSettings } from './ChatBotComponents';
import { GroupChatManagement } from './GroupChatComponents';
import { MOCK_ACCOUNTS, MOCK_CHATS, MOCK_MESSAGES } from './mockData';
import { Chat, Message } from './types';

export const WhatsAppDashboard = () => {
  // State Management
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  // Modal States
  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose
  } = useDisclosure();

  const {
    isOpen: isBotSettingsOpen,
    onOpen: onBotSettingsOpen,
    onClose: onBotSettingsClose
  } = useDisclosure();

  const {
    isOpen: isGroupManagementOpen,
    onOpen: onGroupManagementOpen,
    onClose: onGroupManagementClose
  } = useDisclosure();

  // Effect to load chat messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      setChatMessages(messages[selectedChat.id] || []);
      // Reset unread count when opening chat
      if (unreadCounts[selectedChat.id]) {
        setUnreadCounts(prev => ({
          ...prev,
          [selectedChat.id]: 0
        }));
      }
    }
  }, [selectedChat, messages]);

  // Message Handlers
  const handleSendMessage = useCallback((content: string, attachments?: File[]) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      ...(attachments && attachments.length > 0 && {
        media: {
          type: attachments[0].type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(attachments[0]),
          filename: attachments[0].name,
          size: attachments[0].size,
          mimeType: attachments[0].type,
          isUploading: true,
          uploadProgress: 0
        }
      })
    };

    // Simulate file upload if there are attachments
    if (attachments?.length) {
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += 20;
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg =>
            msg.id === newMessage.id && msg.media
              ? {
                  ...msg,
                  media: {
                    ...msg.media,
                    uploadProgress: progress,
                    isUploading: progress < 100
                  }
                }
              : msg
          )
        }));

        if (progress >= 100) {
          clearInterval(uploadInterval);
        }
      }, 500);
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    // Simulate typing indicator
    setTypingStatus(prev => ({ ...prev, [selectedChat.id]: true }));
    setTimeout(() => {
      setTypingStatus(prev => ({ ...prev, [selectedChat.id]: false }));
      // Simulate reply
      const replyMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: 'contact',
        content: "Thanks for your message! I will get back to you soon.",
        timestamp: new Date(Date.now() + 2000).toISOString(),
        status: 'sent'
      };
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), replyMessage]
      }));
    }, 3000);
  }, [selectedChat]);

  const handleMessageReaction = useCallback((messageId: string, reaction: string) => {
    if (!selectedChat) return;

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].map(msg =>
        msg.id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
          : msg
      )
    }));
  }, [selectedChat]);

  const handleMessageDelete = useCallback((messageId: string) => {
    if (!selectedChat) return;

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].filter(msg => msg.id !== messageId)
    }));
  }, [selectedChat]);

  const handleMediaDownload = useCallback((mediaUrl: string) => {
    // Simulate media download
    console.log('Downloading media:', mediaUrl);
  }, []);

  const handleBotSettingsUpdate = useCallback((config: ChatBotConfig) => {
    console.log('Updating bot settings:', config);
    onBotSettingsClose();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <Navbar className="lg:hidden">
        <NavbarContent>
          <Button
            isIconOnly
            variant="light"
            onPress={onSidebarOpen}
          >
            <Menu size={24} />
          </Button>
          <NavbarBrand>
            <MessageCircle className="text-primary" />
            <p className="font-bold text-inherit ml-2">WhatsApp</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <Tooltip content="New Chat">
            <Button
              isIconOnly
              variant="light"
              onPress={onGroupManagementOpen}
            >
              <Plus size={24} />
            </Button>
          </Tooltip>
        </NavbarContent>
      </Navbar>

      {/* Mobile Sidebar Modal */}
      <Modal 
        isOpen={isSidebarOpen} 
        onClose={onSidebarClose}
        size="full"
        scrollBehavior="inside"
        // placement="left"
      >
        <ModalContent>
          <ModalHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold">Chats</h3>
          </ModalHeader>
          <ModalBody className="p-0">
            <ChatSidebar
              selectedChat={selectedChat}
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                onSidebarClose();
              }}
              isMobile
              // typingStatus={typingStatus}
              // unreadCounts={unreadCounts}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Bot Settings Modal */}
      <Modal 
        isOpen={isBotSettingsOpen}
        onClose={onBotSettingsClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Bot Settings</ModalHeader>
          <ModalBody>
            <BotSettings
              config={{
                isEnabled: true,
                personality: 'professional',
                contextLength: 5,
                triggers: ['hello', 'help'],
                defaultResponses: ['Hello! How can I help you today?']
              }}
              onUpdate={handleBotSettingsUpdate}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Group Management Modal */}
      <Modal
        isOpen={isGroupManagementOpen}
        onClose={onGroupManagementClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalBody>
            <GroupChatManagement
              isOpen={isGroupManagementOpen}
              onClose={onGroupManagementClose}
              contacts={MOCK_CHATS.map(chat => ({
                id: chat.id,
                name: chat.name,
                phone: chat.phone
              }))}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-r border-divider">
          <ChatSidebar
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            // typingStatus={typingStatus}
            // unreadCounts={unreadCounts}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-w-0">
          <ChatArea
            chat={selectedChat}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onReaction={handleMessageReaction}
            onDownloadMedia={handleMediaDownload}
            // isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Badge,
  Button,
  Input,
  Tabs,
  Tab,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  MessageCircle,
  Calendar,
  Phone,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
// import { WhatsApp } from '@/public/PlatformIcon';
// import { WhatsAppModal } from '@/components/SocialIntegration/WhatsAppModal';
import { Chat } from "./types";
import { MOCK_ACCOUNTS, MOCK_CHATS, MOCK_SCHEDULED_MESSAGES } from "./mockData";
import { Selection } from "@nextui-org/react";

interface ChatSidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

interface Account {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export const ChatSidebar = ({
  selectedChat,
  onSelectChat,
  isMobile = false,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccount, setActiveAccount] = useState<Account>(MOCK_ACCOUNTS[0]);
  const [filteredChats, setFilteredChats] = useState(MOCK_CHATS);
  const [directMessagePhone, setDirectMessagePhone] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([activeAccount.id])
  );

  const {
    isOpen: isAddAccountOpen,
    onOpen: onAddAccountOpen,
    onClose: onAddAccountClose,
  } = useDisclosure();

  const {
    isOpen: isDirectMessageOpen,
    onOpen: onDirectMessageOpen,
    onClose: onDirectMessageClose,
  } = useDisclosure();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = MOCK_CHATS.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.phone.includes(query)
    );
    setFilteredChats(filtered);
  };

  return (
    <Card className="h-full border-none rounded-none shadow-none bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <CardBody className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="flex items-center gap-3">
            {/* <WhatsApp className="w-5 h-5 text-green-600" /> */}
            <div>
              <h4 className="text-small font-medium text-white">
                {activeAccount.name}
              </h4>
              <p className="text-tiny text-gray-400">
                {activeAccount.phone}
              </p>
            </div>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-gray-400">
                <MoreVertical size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Account actions"
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              className="min-w-[200px] rounded-lg bg-gray-900 text-white dark:bg-gray-900"
              classNames={{
                base: "rounded-lg",
              }}
            >
              <DropdownItem key="add" onPress={onAddAccountOpen}>
                Add Account
              </DropdownItem>
              <DropdownItem key="direct" onPress={onDirectMessageOpen}>
                Direct Message
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Search */}
        <div className="px-4 py-2 mb-2">
          <Input
            placeholder="Search chats..."
            startContent={<Search className="text-gray-400" size={16} />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            classNames={{
              base: "h-unit-8 min-h-unit-8 bg-gray-800 dark:bg-gray-800 rounded-lg text-gray-300",
              inputWrapper:
                "h-unit-8 min-h-unit-8 bg-transparent shadow-none hover:!bg-gray-700 dark:hover:!bg-gray-700",
              input: "text-small text-gray-300",
            }}
          />
        </div>

        {/* Tabs */}
        <Tabs
          aria-label="Chat Options"
          classNames={{
            base: "w-full px-4",
            tabList:
              "gap-4 w-full relative p-0 border-b border-gray-600 bg-transparent",
            tab: "h-unit-8 px-2 text-gray-300",
            tabContent:
              "group-data-[selected=true]:text-white text-gray-400 text-small",
            cursor: "bg-primary",
          }}
        >
          <Tab
            key="chats"
            title={
              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                <span>Chats</span>
              </div>
            }
          >
            <ScrollShadow className="h-[calc(100vh-180px)]">
              <div className="px-2">
                {filteredChats.map((chat) => (
                  <Button
                    key={chat.id}
                    className={`w-full justify-start h-16 py-2 px-2 rounded-lg text-gray-300 hover:bg-gray-700 ${
                      selectedChat?.id === chat.id
                        ? "bg-gray-700 text-white"
                        : ""
                    }`}
                    variant="light"
                    onPress={() => onSelectChat(chat)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Badge
                        content={chat.unreadCount || null}
                        color="primary"
                        size="sm"
                        isInvisible={!chat.unreadCount}
                      >
                        <Avatar
                          name={chat.name}
                          size="md"
                          showFallback
                          className="transition-transform"
                        />
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {chat.name}
                          </span>
                          <small className="text-gray-400 text-xs">
                            {new Date(
                              chat.lastMessage.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                        <p className="text-tiny text-gray-400 truncate mt-0.5 text-left">
                          {chat.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollShadow>
          </Tab>
          
          <Tab
            key="scheduled"
            title={
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Scheduled</span>
              </div>
            }
          >
            <ScrollShadow className="h-[calc(100vh-180px)]">
              <div className="px-2">
                {MOCK_SCHEDULED_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 text-gray-300 hover:bg-gray-700 rounded-lg mb-2"
                  >
                    <p className="font-medium ">{msg.content}</p>
                    <p className="text-small text-default-400 mt-1 text-left">
                      {new Date(msg.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </Tab>
        </Tabs>
              {/* Direct Message Modal */}
              <Modal
          isOpen={isDirectMessageOpen}
          onClose={onDirectMessageClose}
          classNames={{
            base: "bg-content1 dark:bg-content1 rounded-lg",
          }}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              New Direct Message
            </ModalHeader>
            <ModalBody>
              <Input
                label="Phone Number"
                placeholder="+1234567890"
                type="tel"
                value={directMessagePhone}
                onChange={(e) => setDirectMessagePhone(e.target.value)}
                startContent={<Phone size={16} className="text-default-400" />}
                variant="bordered"
                classNames={{
                  input: "text-small",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onDirectMessageClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  // Handle direct message
                  onDirectMessageClose();
                }}
              >
                Message
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

 
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
  Search,
} from "lucide-react";
import { Chat } from "./types";
import { MOCK_ACCOUNTS, MOCK_CHATS, MOCK_SCHEDULED_MESSAGES } from "./mockData";
import { Selection } from "@nextui-org/react";

// Props Interface
interface ChatSidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  isMobile?: boolean;
}

// Account Interface
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAccount, setActiveAccount] = useState<Account>(MOCK_ACCOUNTS[0]);
  const [filteredChats, setFilteredChats] = useState(MOCK_CHATS);
  const [directMessagePhone, setDirectMessagePhone] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([activeAccount.id]));

  const { isOpen: isAddAccountOpen, onOpen: onAddAccountOpen, onClose: onAddAccountClose } = useDisclosure();
  const { isOpen: isDirectMessageOpen, onOpen: onDirectMessageOpen, onClose: onDirectMessageClose } = useDisclosure();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = MOCK_CHATS.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.phone.includes(query)
    );
    setFilteredChats(filtered);
  };

  const formatTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="h-full border-none rounded-lg shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900 dark:bg-gradient-to-b dark:from-black dark:to-gray-700">
      <CardBody className="p-0 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-gray-900 dark:bg-gray-800 rounded-t-lg shadow-lg">
          <div className="flex items-center gap-4">
            <Avatar name={activeAccount.name} size="lg" showFallback />
            <div className="text-left">
              <h4 className="text-xl font-semibold text-white">{activeAccount.name}</h4>
              <p className="text-sm text-gray-300">{activeAccount.phone}</p>
            </div>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-gray-200">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Account actions" selectionMode="single" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
              <DropdownItem key="add" onPress={onAddAccountOpen}>Add Account</DropdownItem>
              <DropdownItem key="direct" onPress={onDirectMessageOpen}>Direct Message</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>

        {/* Search */}
        <div className="px-6 py-4">
          <Input
            placeholder="Search chats..."
            startContent={<Search className="text-gray-500" size={18} />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search"
            classNames={{
              base: "h-12 min-h-12 rounded-full bg-gray-800 text-white border-none shadow-md",
              inputWrapper: "h-12 min-h-12 bg-transparent",
              input: "text-sm text-white",
            }}
          />
        </div>

        {/* Tabs: Chats and Scheduled Messages */}
        <Tabs aria-label="Chat Options" classNames={{ base: "w-full px-6", tabList: "gap-6 w-full border-b-2 border-gray-500 dark:border-gray-600", tab: "text-sm font-medium py-3" }}>
          <Tab key="chats" title={<div className="flex items-center gap-2"><MessageCircle size={16} /><span>Chats</span></div>}>
            <ScrollShadow className="h-[calc(100vh-180px)]">
              <div className="px-4">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <Button
                      key={chat.id}
                      className={`w-full justify-start h-16 py-2 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-indigo-600 transition-colors duration-300 ${selectedChat?.id === chat.id ? "bg-indigo-800 dark:bg-indigo-600" : ""}`}
                      variant="light"
                      onPress={() => onSelectChat(chat)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <Badge content={chat.unreadCount || null} color="primary" size="sm" isInvisible={!chat.unreadCount}>
                          <Avatar name={chat.name} size="md" showFallback className="transition-transform" />
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{chat.name}</span>
                            <small className="text-gray-400">{formatTime(chat.lastMessage.timestamp)}</small>
                          </div>
                          <p className="text-sm text-gray-300 truncate mt-1">{chat.lastMessage.content}</p>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-gray-400 mt-6">No chats found.</p>
                )}
              </div>
            </ScrollShadow>
          </Tab>

          <Tab key="scheduled" title={<div className="flex items-center gap-2"><Calendar size={16} /><span>Scheduled</span></div>}>
            <ScrollShadow className="h-[calc(100vh-180px)]">
              <div className="px-4">
                {MOCK_SCHEDULED_MESSAGES.map((msg) => (
                  <div key={msg.id} className="p-4 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg mb-2">
                    <p className="font-medium text-white">{msg.content}</p>
                    <p className="text-sm text-gray-400 mt-1">{new Date(msg.scheduledFor).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </Tab>
        </Tabs>

        {/* Direct Message Modal */}
        <Modal isOpen={isDirectMessageOpen} onClose={onDirectMessageClose} aria-labelledby="direct-message-modal" size="lg">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-2">
              <h5 className="text-xl font-semibold text-white">New Direct Message</h5>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Phone Number"
                placeholder="+1234567890"
                type="tel"
                value={directMessagePhone}
                onChange={(e) => setDirectMessagePhone(e.target.value)}
                startContent={<Phone size={16} className="text-gray-500" />}
                variant="bordered"
                classNames={{ input: "text-sm" }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onDirectMessageClose}>Cancel</Button>
              <Button color="primary" onPress={() => { console.log(`Direct message to: ${directMessagePhone}`); onDirectMessageClose(); }}>Send</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

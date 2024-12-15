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
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([activeAccount.id])
  );

  const { isOpen: isAddAccountOpen, onOpen: onAddAccountOpen, onClose: onAddAccountClose } = useDisclosure();
  const { isOpen: isDirectMessageOpen, onOpen: onDirectMessageOpen, onClose: onDirectMessageClose } = useDisclosure();

  // Utility function: Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = MOCK_CHATS.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.phone.includes(query)
    );
    setFilteredChats(filtered);
  };

  // Utility function: Format date/time for display
  const formatTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="h-full border-none rounded-none shadow-none bg-default-100 dark:bg-default-50">
      <CardBody className="p-0 flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3 bg-default-200 dark:bg-default-100">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="text-small font-medium text-foreground">{activeAccount.name}</h4>
              <p className="text-tiny text-default-500">{activeAccount.phone}</p>
            </div>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-default-400">
                <MoreVertical size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Account actions"
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              className="min-w-[200px] rounded-lg"
            >
              <DropdownItem key="add" onPress={onAddAccountOpen}>
                Add Account
              </DropdownItem>
              <DropdownItem key="direct" onPress={onDirectMessageOpen}>
                Direct Message
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>

        {/* Search */}
        <div className="px-4 py-2 mb-2">
          <Input
            placeholder="Search chats..."
            startContent={<Search className="text-default-400" size={16} />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            classNames={{
              base: "h-unit-8 min-h-unit-8 bg-default-200 dark:bg-default-100 rounded-lg",
              inputWrapper:
                "h-unit-8 min-h-unit-8 bg-transparent shadow-none hover:!bg-default-200 dark:hover:!bg-default-100",
              input: "text-small",
            }}
          />
        </div>

        {/* Tabs: Chats and Scheduled Messages */}
        <Tabs
          aria-label="Chat Options"
          classNames={{
            base: "w-full px-4",
            tabList: "gap-4 w-full relative p-0 border-b border-divider bg-transparent",
            tab: "h-unit-8 px-2",
            tabContent: "group-data-[selected=true]:text-primary text-default-500 text-small",
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
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <Button
                      key={chat.id}
                      className={`w-full justify-start h-16 py-2 px-2 rounded-lg hover:bg-default-200 dark:hover:bg-default-100 ${
                        selectedChat?.id === chat.id
                          ? "bg-default-200 dark:bg-default-100"
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
                            <span className="font-medium text-foreground">{chat.name}</span>
                            <small className="text-default-400 text-xs">
                              {formatTime(chat.lastMessage.timestamp)}
                            </small>
                          </div>
                          <p className="text-tiny text-default-400 truncate mt-0.5">
                            {chat.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-small text-default-400 text-center mt-4">
                    No chats found.
                  </p>
                )}
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
                    className="p-4 hover:bg-default-200 dark:hover:bg-default-100 rounded-lg mb-2"
                  >
                    <p className="font-medium text-foreground">{msg.content}</p>
                    <p className="text-small text-default-400 mt-1">
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
            <ModalHeader className="flex flex-col gap-1">New Direct Message</ModalHeader>
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
                  console.log(`Direct message to: ${directMessagePhone}`);
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

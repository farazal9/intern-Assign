import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Checkbox,
  User
} from "@nextui-org/react";
import { Chat } from './types';

interface GroupChatManagementProps {
  isOpen: boolean;
  onClose: () => void;
  chat?: Chat;
  contacts: Array<{
    id: string;
    name: string;
    phone: string;
  }>;
}

export const GroupChatManagement: React.FC<GroupChatManagementProps> = ({
  isOpen,
  onClose,
  chat,
  contacts
}) => {
  const [groupName, setGroupName] = useState(chat?.name || '');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    chat?.participants || []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="rounded-lg">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold text-foreground">
            {chat ? 'Edit Group' : 'Create New Group'}
          </h3>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full"
          />

          <div className="space-y-4">
            <p className="text-small font-medium text-foreground">Participants</p>
            <div className="max-h-64 overflow-y-auto divide-y divide-default-100 rounded-lg bg-default-50 p-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-default-200"
                >
                  <Checkbox
                    isSelected={selectedParticipants.includes(contact.id)}
                    onValueChange={(isSelected) => {
                      setSelectedParticipants((prev) =>
                        isSelected
                          ? [...prev, contact.id]
                          : prev.filter((id) => id !== contact.id)
                      );
                    }}
                  />
                  <User
                    name={contact.name}
                    description={contact.phone}
                    avatarProps={{
                      src: `/api/placeholder/32/32?text=${contact.name[0]}`,
                      alt: contact.name,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="space-x-2">
          <Button variant="bordered" onPress={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!groupName || selectedParticipants.length < 2}
            onPress={() => {
              // Handle group creation/update
              onClose();
            }}
            className="flex-1"
          >
            {chat ? 'Update Group' : 'Create Group'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const GroupInfo: React.FC<{
  chat: Chat;
  onEditGroup: () => void;
  onLeaveGroup: () => void;
}> = ({ chat, onEditGroup, onLeaveGroup }) => {
  return (
    <div className="p-4 space-y-6 bg-default-50 rounded-lg">
      {/* Group Information */}
      <div className="flex items-center gap-4">
        <Avatar
          name={chat.name}
          className="w-16 h-16"
          alt={chat.name}
        />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{chat.name}</h3>
          <p className="text-small text-default-500">
            {chat.participants?.length} participants
          </p>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-4">
        <p className="text-small font-medium text-foreground">Participants</p>
        <div className="max-h-64 overflow-y-auto divide-y divide-default-100 rounded-lg bg-default-50 p-2">
          {chat.participants?.map((participantId) => (
            <div
              key={participantId}
              className="flex items-center justify-between p-2 rounded hover:bg-default-200"
            >
              <User
                name={`Participant ${participantId}`}
                description={`ID: ${participantId}`}
                avatarProps={{
                  src: `/api/placeholder/32/32`,
                  alt: `Participant ${participantId}`,
                }}
              />
              {chat.groupAdmin === participantId && (
                <span className="text-tiny bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {chat.groupAdmin === 'currentUserId' && (
          <Button
            color="primary"
            variant="flat"
            onPress={onEditGroup}
            className="flex-1"
          >
            Edit Group
          </Button>
        )}
        <Button
          color="danger"
          variant="flat"
          onPress={onLeaveGroup}
          className="flex-1"
        >
          Leave Group
        </Button>
      </div>
    </div>
  );
};

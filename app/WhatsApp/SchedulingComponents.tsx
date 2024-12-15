// src/components/WhatsApp/ScheduleAndList.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react";

// Define the type for scheduled messages
interface ScheduledMessage {
  id: string;
  content: string;
  scheduledFor: string;
  repeat: string;
}

export const ScheduleAndList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [repeat, setRepeat] = useState<string>('none');
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);

  // Open/close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handler to schedule a message
  const handleSchedule = () => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      scheduledFor: `${scheduledDate} ${scheduledTime}`,
      repeat
    };
    setScheduledMessages([...scheduledMessages, newMessage]);

    // Reset modal fields
    setMessage('');
    setScheduledDate('');
    setScheduledTime('');
    setRepeat('none');

    toggleModal();
  };

  // Edit scheduled message
  const handleEdit = (id: string) => {
    const messageToEdit = scheduledMessages.find(msg => msg.id === id);
    if (messageToEdit) {
      setMessage(messageToEdit.content);
      setScheduledDate(messageToEdit.scheduledFor.split(' ')[0]);
      setScheduledTime(messageToEdit.scheduledFor.split(' ')[1]);
      setRepeat(messageToEdit.repeat);
      toggleModal();
    }
  };

  // Delete scheduled message
  const handleDelete = (id: string) => {
    setScheduledMessages(scheduledMessages.filter(msg => msg.id !== id));
  };

  return (
    <div className="p-4">
      <Button color="primary" onPress={toggleModal}>Schedule New Message</Button>

      {/* List of scheduled messages */}
      <div className="space-y-3 mt-4">
        {scheduledMessages.map((msg) => (
          <div key={msg.id} className="flex justify-between items-center p-3 bg-default-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <p className="font-medium text-lg">{msg.content}</p>
              <p className="text-sm text-default-500">
                Scheduled for: {new Date(msg.scheduledFor).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="light" onPress={() => handleEdit(msg.id)}>Edit</Button>
              <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(msg.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduling Modal */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} size="lg">
        <ModalContent>
          <ModalHeader>Schedule Message</ModalHeader>
          <ModalBody className="gap-4">
            <Textarea
              aria-label="Message to schedule"
              label="Message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-4">
              <Input
                aria-label="Select Date"
                type="date"
                label="Date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <Input
                aria-label="Select Time"
                type="time"
                label="Time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <Select
              aria-label="Repeat Frequency"
              label="Repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <SelectItem key="none" value="none">No repeat</SelectItem>
              <SelectItem key="daily" value="daily">Daily</SelectItem>
              <SelectItem key="weekly" value="weekly">Weekly</SelectItem>
              <SelectItem key="monthly" value="monthly">Monthly</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={toggleModal}>Cancel</Button>
            <Button color="primary" onPress={handleSchedule}>Schedule</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

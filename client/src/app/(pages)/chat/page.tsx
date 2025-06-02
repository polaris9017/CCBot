'use client';

import React, { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import ChatItem from '@/components/ChatItem';

interface MessageProps {
  nickname: string;
  color: string;
  message: string;
}

interface DonationProps {
  nickname: string;
  color: string;
  message: string;
  amount: number;
}

type ChatProps = MessageProps | DonationProps;

export default function Chat() {
  const { socket, connected, reconnect } = useSocket();
  const [messages, setMessages] = useState<ChatProps[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: MessageProps) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleDonation = (donation: DonationProps) => {
      setMessages((prevMessages) => [...prevMessages, donation]);
    };

    socket.on('CHAT', handleMessage);
    socket.on('DONATION', handleMessage);

    return () => {
      socket.off('CHAT', handleMessage);
      socket.off('DONATION', handleDonation);
    };
  }, [socket]);

  return (
    <div className="bg-black min-h-screen flex flex-col p-4">
      <div className="flex flex-col gap-4 mb-4 flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${index % 3 === 2 ? 'justify-end' : 'justify-start'}`}>
            <ChatItem {...msg} />
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import ChatItem from '@/components/ChatItem';

interface MessageProps {
  channelId: string;
  senderChannelId: string;
  profile: {
    nickname: string;
    verifiedMark: boolean;
    badges: { imageUrl: string }[];
  };
  content: string;
  emojis: Map<string, string>;
  messageTime: number;
  eventSentAt: string;
}

interface DonationProps {
  nickname: string;
  color: string;
  message: string;
  amount: number;
}

type ChatProps = MessageProps | DonationProps;

export default function Chat() {
  const { socket, connected, reconnect, error } = useSocket();
  const [messages, setMessages] = useState<ChatProps[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  /* OBS에서 Tailwind가 적용되지 않는 관계로 수동 설정 */
  const containerStyle: CSSProperties = {
    backgroundColor: 'transparent',
    maxWidth: '600px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  };

  const statusStyle: CSSProperties = {
    marginBottom: '8px',
  };

  const indicatorStyle: CSSProperties = {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '8px',
    backgroundColor: connected ? '#10b981' : '#fb2c36',
  };

  const buttonStyle: CSSProperties = {
    marginLeft: '8px',
    padding: '4px 8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  };

  const messagesContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    marginBottom: '16px',
    flex: 1,
    overflowY: 'auto',
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(message) as MessageProps]);
    };

    const handleDonation = (donation: string) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(donation) as DonationProps]);
    };

    socket.on('CHAT', handleMessage);
    socket.on('DONATION', handleDonation);

    return () => {
      socket.off('CHAT', handleMessage);
      socket.off('DONATION', handleDonation);
    };
  }, [socket]);

  // 메시지 추가 시 스크롤 하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      console.error('Socket error:', error);
    }
  }, [error]);

  return (
    <div style={containerStyle}>
      {/* 연결 상태 표시 */}
      <div style={statusStyle}>
        {!connected && <span style={indicatorStyle}></span>}
        {connected ? '' : '연결 끊김'}
        {error && <span style={{ color: '#fb2c36', marginLeft: '8px' }}>{error}</span>}
        {!connected && (
          <button onClick={reconnect} style={buttonStyle}>
            재연결
          </button>
        )}
      </div>

      <div style={messagesContainerStyle}>
        {messages.map((msg, index) => {
          const { channelId, senderChannelId, profile, content } = msg as MessageProps;
          const isChannerOwner = channelId === senderChannelId;

          const messageWrapperStyle: CSSProperties = {
            display: 'flex',
            justifyContent: isChannerOwner ? 'flex-end' : 'flex-start',
          };

          return (
            <div key={index} style={messageWrapperStyle}>
              <ChatItem
                nickname={profile.nickname}
                color={isChannerOwner ? 'blue-500' : 'white'}
                content={content}
              />
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

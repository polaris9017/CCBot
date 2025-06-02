import React from 'react';

interface ChatItemProps {
  nickname: string;
  message: string;
  color: string;
}

export default function ChatItem({ nickname, message, color }: ChatItemProps) {
  return (
    <div className="bg-gray-300 rounded-full px-6 py-2 flex items-center w-fit max-w-[90%] space-x-4">
      <span className={`font-bold`} style={{ color }}>
        {nickname}
      </span>
      <span className="text-black font-semibold">{message}</span>
    </div>
  );
}

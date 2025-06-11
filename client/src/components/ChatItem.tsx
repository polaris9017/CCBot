import React, { CSSProperties } from 'react';

interface ChatItemProps {
  nickname: string;
  color: string;
  content: string;
}

export default function ChatItem({ nickname, content, color }: ChatItemProps) {
  const containerStyle: CSSProperties = {
    paddingLeft: '12px', // px-3
    paddingRight: '12px',
    paddingTop: '4px', // py-1
    paddingBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: '90%',
    gap: '4px', // space-x-1
  };

  const textStyle: CSSProperties = {
    color: color === 'blue-500' ? '#3b82f6' : color === 'white' ? '#ffffff' : color,
    fontWeight: '600', // font-semibold
    fontSize: '27px', // text-2xl
    lineHeight: '32px',
  };

  return (
    <div style={containerStyle}>
      <span style={textStyle}>{content}</span>
    </div>
  );
}

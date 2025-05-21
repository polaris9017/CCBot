'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSharedState } from '@/providers/shared-state';

interface NavItem {
  label: string;
  href: string;
  key: string;
}

const navItems: NavItem[] = [
  { label: '명령어', href: '#', key: 'commands' },
  { label: '봇 설정', href: '#', key: 'settings' },
  { label: '채팅창 오버레이', href: '#', key: 'overlay' },
  // Add more items if needed
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setMenuItem } = useSharedState();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <div
        className={`flex items-center ${!isCollapsed ? 'justify-between' : 'justify-center'} p-4 border-b border-gray-700`}
      >
        {!isCollapsed && (
          <span
            className={`text-2xl font-bold transition-all duration-300 ${
              isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'
            }`}
          >
            관리 페이지
          </span>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 p-2">
        {/* Reference: https://stackoverflow.com/questions/73555618/how-can-i-disable-link-href-in-next-js-on-various-conditions */}
        {navItems.map((item) => (
          <Link
            className={isCollapsed ? 'pointer-events-none' : ''}
            key={item.key}
            href={item.href}
            aria-disabled={isCollapsed}
            tabIndex={isCollapsed ? -1 : undefined}
            onClick={() => setMenuItem(item.key)}
          >
            <span
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded hover:bg-gray-700 transition ${
                currentPath === item.href ? 'bg-gray-700' : ''
              }`}
              onClick={() => setMenuItem(item.label)}
            >
              {/* Optional icon for nav item could go here */}
              {!isCollapsed && <span>{item.label}</span>}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

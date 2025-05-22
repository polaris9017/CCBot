'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
import { useSharedState } from '@/providers/shared-state';

interface NavItem {
  label: string;
  href: string;
  key: string;
}

interface SectionItem {
  label: string;
  key: string;
  items: NavItem[];
}

const menuItems: SectionItem[] = [
  {
    label: '챗봇 관리',
    key: 'management',
    items: [
      { label: '명령어', href: '#', key: 'commands' },
      { label: '봇 설정', href: '#', key: 'settings' },
    ],
  },
  {
    label: '채팅창',
    key: 'chat',
    items: [{ label: '채팅창 오버레이', href: '#', key: 'overlay' }],
  },
  {
    label: '내 정보',
    key: 'member',
    items: [{ label: ' 회원 정보 관리', href: '#', key: 'profile' }],
  },
];

export default function Sidebar() {
  const { menuItem, setMenuItem } = useSharedState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openedSections, setOpenedSections] = useState<Record<string, boolean>>({
    management: true,
    chat: true,
    profile: true,
  });

  const toggleSection = (key: string) => {
    setOpenedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

      <div className="flex-1 overflow-y-auto p-2">
        {menuItems.map((section) => (
          <section key={section.key} className="mb-4">
            {/* Section header */}
            <button
              className={`flex items-center justify-between w-full text-left text-base text-gray-400 px-4 mb-2 hover:text-white ${isCollapsed ? 'pointer-events-none' : ''}`}
              aria-disabled={isCollapsed}
              tabIndex={isCollapsed ? -1 : undefined}
              onClick={() => toggleSection(section.key)}
            >
              <span className={`${isCollapsed ? 'hidden' : ''}`}>{section.label}</span>
              {!isCollapsed &&
                (openedSections[section.key] ? (
                  <FiChevronDown size={16} />
                ) : (
                  <FiChevronRight size={16} />
                ))}
            </button>

            {/* Section items */}
            {/* Reference: https://stackoverflow.com/questions/73555618/how-can-i-disable-link-href-in-next-js-on-various-conditions */}
            {openedSections[section.key] && (
              <nav className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <Link
                    className={isCollapsed ? 'pointer-events-none' : ''}
                    key={item.key}
                    href={item.href}
                    aria-disabled={isCollapsed}
                    tabIndex={isCollapsed ? -1 : undefined}
                    onClick={() => setMenuItem(item.key)}
                  >
                    <span
                      className={`flex items-center text-sm indent-2 gap-2 cursor-pointer px-4 py-2 rounded hover:bg-gray-700 transition ${menuItem === item.key && !isCollapsed ? 'bg-gray-700' : ''}`}
                    >
                      {!isCollapsed && item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

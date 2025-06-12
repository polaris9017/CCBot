import React from 'react';
import Avatar from './Avatar';

interface User {
  username: string;
  nickname: string;
  avatarUrl: string;
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar src={user.avatarUrl} alt={user.username} />

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-grow">
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4 w-full">
            <div className="flex-grow">
              <p className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight">
                {user.nickname}
              </p>
              <p className="text-slate-600 text-sm sm:text-base">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

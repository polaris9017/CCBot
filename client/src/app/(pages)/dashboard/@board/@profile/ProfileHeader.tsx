import React from 'react';
import Avatar from './Avatar';
import CustomButton from '@/components/CustomButton';

interface User {
  username: string;
  nickname: string;
  avatarUrl: string;
}

interface ProfileHeaderProps {
  user: User;
  onUpdateProfile: () => void;
}

export default function ProfileHeader({ user, onUpdateProfile }: ProfileHeaderProps) {
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

            <CustomButton
              variant="primary"
              onClick={onUpdateProfile}
              className="mt-4 sm:mt-0 sm:ml-auto"
            >
              프로필 업데이트
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}

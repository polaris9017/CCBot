'use client';

import { useState } from 'react';
import CardComponent from '@/components/CardComponent';
import ToggleItem from '@/components/ToggleItem';
import TextItem from '@/components/TextItem';
import MaintenanceModal from '@/components/MaintenanceModal';
import { useSession } from 'next-auth/react';
import NotificationModal from '@/components/NotificationModal';
import MenuHeaderItem from '@/components/MenuHeader';

export type CommandSettingItem = {
  id: string;
  name: string;
  value: boolean;
};

export default function CommandsPage() {
  const { data } = useSession();
  const isUnderMaintenance = false;
  const hasAccess = !!data?.user?.channelId;
  const [commandSettings, setCommandSettings] = useState<CommandSettingItem[]>([
    { id: 'uptime', name: '!업타입 활성화', value: true },
    { id: 'memo', name: '!메모 활성화', value: true },
    { id: 'fixed', name: '!고정 활성화', value: true },
    { id: 'custom', name: '커스텀 명령어 사용', value: true },
  ]);

  const isCustomCommandEnabled = commandSettings.some((item) => item.id === 'custom' && item.value);

  return (
    <div className="w-screen mx-auto p-6 space-y-8 bg-gray-50">
      {/* Dialog for maintenance notice. Remove if ready. */}
      {isUnderMaintenance && <MaintenanceModal />}
      {!hasAccess && !isUnderMaintenance && (
        <NotificationModal
          description="해당 기능은 API 인증 후 사용 가능합니다."
          header="잠시만요!"
        />
      )}

      <MenuHeaderItem title="명령어 관리" />
      <CardComponent title="명령어">
        {commandSettings.map((item) => (
          <ToggleItem
            key={item.id}
            label={item.name}
            initialValue={item.value}
            onChange={(newValue) => {
              setCommandSettings((prevItems) => {
                const index = prevItems.findIndex((idx) => idx.id === item.id);
                if (index === -1) return prevItems;

                const updatedItems = [...prevItems];
                updatedItems[index] = { ...updatedItems[index], value: newValue };

                return updatedItems;
              });
            }}
          />
        ))}
      </CardComponent>
      {isCustomCommandEnabled && (
        <CardComponent title="커스텀 명령어">
          <CardComponent title="명령어 1">
            <TextItem label="명령어 이름" placeholder={'예: 븜하'} />
            <TextItem label="명령어 응답 메시지" placeholder="예: $user님 안녕하세요" />
          </CardComponent>
        </CardComponent>
      )}
    </div>
  );
}

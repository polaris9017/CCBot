'use client';

import { useSession } from 'next-auth/react';
import CardComponent from '@/components/CardComponent';
import ToggleItem from '@/components/ToggleItem';
import MenuHeaderItem from '@/components/MenuHeader';
import MaintenanceModal from '@/components/MaintenanceModal';
import NotificationModal from '@/components/NotificationModal';
import { useSharedState } from '@/providers/SharedState';

export default function BoardSettingsPage() {
  const { data } = useSession();
  const { fetch, isBotEnabled, setIsBotEnabled } = useSharedState();

  const isUnderMaintenance = false;
  const hasAccess = !!data?.user?.channelId;

  const handleChange = (value: boolean) => {
    setIsBotEnabled(value);
    fetch({ body: { activateBot: value } });
  };

  return (
    <div className="w-screen mx-auto p-4 bg-gray-50">
      {/* Dialog for maintenance notice. Remove if ready. */}
      {isUnderMaintenance && <MaintenanceModal />}
      {!hasAccess && !isUnderMaintenance && (
        <NotificationModal
          description="해당 기능은 API 인증 후 사용 가능합니다."
          header="잠시만요!"
        />
      )}

      <MenuHeaderItem title="봇 설정" />
      <CardComponent title="전역 설정">
        <ToggleItem label="봇 활성화" initialValue={isBotEnabled} onChange={handleChange} />
      </CardComponent>
    </div>
  );
}

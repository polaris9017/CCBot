'use client';

import { useSession } from 'next-auth/react';
import MaintenanceModal from '@/components/MaintenanceModal';
import NotificationModal from '@/components/NotificationModal';
import ToggleMenuHeaderItem from '@/components/ToggleMenuHeaderItem';
import CardComponent from '@/components/CardComponent';
import TextareaItem from '@/components/TextareaItem';
import ToggleItem from '@/components/ToggleItem';
import SelectboxItem from '@/components/SelectboxItem';

export default function OverlayPage() {
  const { data } = useSession();
  const isUnderMaintenance = false;
  const hasAccess = !!data?.user?.channelId;
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

      <ToggleMenuHeaderItem title="채팅창 오버레이 관리" initialValue={true} />
      <CardComponent title="채팅 디자인">
        <SelectboxItem
          label="채팅 디자인"
          optionList={[
            { id: 1, name: '기본', value: 'default' },
            { id: 2, name: '투명', value: 'transparent' },
            { id: 3, name: '다크', value: 'dark' },
            { id: 4, name: '커스텀', value: 'custom' },
          ]}
        />
        <ToggleItem label="채팅 커스텀 디자인 사용" initialValue={false} />
        <TextareaItem label="채팅 커스텀 디자인 코드" />
      </CardComponent>
    </div>
  );
}

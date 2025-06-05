'use client';

import { useState } from 'react';
import CardComponent from '@/components/CardComponent';
import ToggleItem from '@/components/ToggleItem';
import TextItem from '@/components/TextItem';
import MaintenanceModal from '@/components/MaintenanceModal';
import { useSession } from 'next-auth/react';
import NotificationModal from '@/components/NotificationModal';
import MenuHeaderItem from '@/components/MenuHeader';
import CustomButton from '@/components/CustomButton';
import useApi from '@/hooks/useApi';

export type CommandSettingItem = {
  id: string;
  name: string;
  value: boolean;
};

export interface CustomCommandItem {
  id: number;
  name?: string;
  response?: string;
}

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
  const [customCommands, setCustomCommands] = useState<CustomCommandItem[]>([
    { id: 1, name: '', response: '' },
  ]);
  const { fetch } = useApi('/api/setting', {
    method: 'PATCH',
    manual: true,
  });

  const handleCommandSetting = (id: string, value: boolean) => {
    setCommandSettings((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      if (index === -1) return prevItems;

      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], value };
      return updatedItems;
    });
  };

  const handleCustomCommand = (command: CustomCommandItem) => {
    setCustomCommands((prevCommands) => {
      const { name = '', response = '' } = command;
      const index = prevCommands.findIndex((cmd) => cmd.id === command.id);
      if (index === -1) return [...prevCommands, { id: prevCommands.length + 1, name, response }];

      const updatedCommands = [...prevCommands];
      updatedCommands[index] = { ...updatedCommands[index], name, response };
      return updatedCommands;
    });
  };
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
      <CardComponent
        title="명령어"
        showSaveButton={true}
        onSave={() =>
          fetch({
            body: {
              activateUptime: commandSettings.find((item) => item.id === 'uptime')?.value,
              activateMemo: commandSettings.find((item) => item.id === 'memo')?.value,
              activateFixedMessage: commandSettings.find((item) => item.id === 'fixed')?.value,
              activateCustomCommands: commandSettings.find((item) => item.id === 'custom')?.value,
            },
          })
        }
      >
        {commandSettings.map((item) => (
          <ToggleItem
            key={item.id}
            label={item.name}
            initialValue={item.value}
            onChange={(value) => handleCommandSetting(item.id, value)}
          />
        ))}
      </CardComponent>
      {isCustomCommandEnabled && (
        <CardComponent
          title="커스텀 명령어"
          showSaveButton={true}
          onSave={() => {
            const commands = customCommands.reduce(
              (acc, cmd) => {
                if (cmd.name && cmd.response) {
                  acc[cmd.name] = cmd.response;
                }
                return acc;
              },
              {} as Record<string, string>
            );
            fetch({
              body: {
                customCommands: commands,
              },
            });
          }}
        >
          {customCommands.map((command) => (
            <CardComponent key={`command-${command.id}`} title={`명령어 ${command.id}`}>
              <TextItem
                label="명령어 이름"
                placeholder={'예: 븜하'}
                onChange={(value) => handleCustomCommand({ ...command, name: value })}
              />
              <TextItem
                label="명령어 응답 메시지"
                placeholder="예: $user님 안녕하세요"
                onChange={(value) => handleCustomCommand({ ...command, response: value })}
              />
            </CardComponent>
          ))}
          <div className="flex flex-row justify-between items-center">
            <CustomButton
              onClick={() =>
                setCustomCommands([
                  ...customCommands,
                  { id: customCommands.length + 1, name: '', response: '' },
                ])
              }
              variant="primary"
              className="mt-4 w-full"
            >
              명령어 추가
            </CustomButton>
            <CustomButton
              onClick={() =>
                setCustomCommands(customCommands.slice(0, customCommands.length >= 2 ? -1 : 1))
              }
              variant="danger"
              className="mt-4 w-full"
            >
              명령어 삭제
            </CustomButton>
          </div>
        </CardComponent>
      )}
    </div>
  );
}

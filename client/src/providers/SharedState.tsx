'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import {
  CommandSettingItem,
  CustomCommandItem,
  DashboardSettings,
  OptionItem,
} from '@/types/dashboard';
import useApi, { FetchOptions } from '@/hooks/useApi';

/* 상태 추가 시 아래 interface 에도 추가 */
interface ContextType {
  menuItem: string;
  fetch: (overrideOptions?: Partial<FetchOptions>) => Promise<any>;
  fetchSettings: () => Promise<DashboardSettings | null>;
  setMenuItem: (menuItem: string) => void;
  commandSettings: CommandSettingItem[];
  setCommandSettings: (settings: (prevItems: CommandSettingItem[]) => CommandSettingItem[]) => void;
  customCommands: CustomCommandItem[];
  setCustomCommands: (
    commands: ((prevCommands: CustomCommandItem[]) => CustomCommandItem[]) | CustomCommandItem[]
  ) => void;
  isChatOverlayActivated: boolean;
  setIsChatOverlayActivated: (value: boolean) => void;
  overlayDesign: OptionItem;
  setOverlayDesign: (design: OptionItem) => void;
  chatCustomDesignCode: string;
  setChatCustomDesignCode: (code: string) => void;
  isBotEnabled: boolean;
  setIsBotEnabled: (value: boolean) => void;
}

const sharedStateContext = createContext<ContextType | undefined>(undefined);

export function SharedStateContextProvider({ children }: { children: ReactNode }) {
  const { fetch } = useApi('/api/setting', {
    method: 'PATCH',
    manual: true,
  });
  const [menuItem, setMenuItem] = useState('');
  const [commandSettings, setCommandSettings] = useState<CommandSettingItem[]>([
    { id: 'uptime', name: '!업타입 활성화', value: true },
    { id: 'memo', name: '!메모 활성화', value: true },
    { id: 'fixed', name: '!고정 활성화', value: true },
    { id: 'custom', name: '커스텀 명령어 사용', value: true },
  ]);
  const [customCommands, setCustomCommands] = useState<CustomCommandItem[]>([
    { id: 1, name: '', response: '' },
  ]);
  const [isChatOverlayActivated, setIsChatOverlayActivated] = useState<boolean>(true);
  const [overlayDesign, setOverlayDesign] = useState<OptionItem>({
    id: 1,
    name: '기본',
    value: 'default',
  });
  const [chatCustomDesignCode, setChatCustomDesignCode] = useState<string>('');
  const [isBotEnabled, setIsBotEnabled] = useState(true);

  const fetchSettings = useCallback(async (): Promise<DashboardSettings | null> => {
    try {
      const response = await window.fetch('/api/setting', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const settings: DashboardSettings = (await response.json()).data;
      console.log(settings);

      // 봇 활성화 상태 설정
      if (settings.activateBot !== undefined) {
        setIsBotEnabled(settings.activateBot);
      }

      // 커맨드 설정들 업데이트
      setCommandSettings((prevSettings) =>
        prevSettings.map((setting) => {
          switch (setting.id) {
            case 'uptime':
              return { ...setting, value: settings.activateUptime ?? setting.value };
            case 'memo':
              return { ...setting, value: settings.activateMemo ?? setting.value };
            case 'fixed':
              return { ...setting, value: settings.activateFixedMessage ?? setting.value };
            case 'custom':
              return { ...setting, value: settings.activateCustomCommands ?? setting.value };
            default:
              return setting;
          }
        })
      );

      // 오버레이 활성화 상태 설정
      if (settings.activateChatOverlay !== undefined) {
        setIsChatOverlayActivated(settings.activateChatOverlay);
      }

      // 오버레이 디자인 설정
      if (settings.chatOverlayDesign) {
        const designOptions = [
          { id: 1, name: '기본', value: 'default' },
          { id: 2, name: '투명', value: 'transparent' },
          { id: 3, name: '다크', value: 'dark' },
          { id: 4, name: '커스텀', value: 'custom' },
        ];

        const selectedDesign = designOptions.find(
          (option) => option.value === settings.chatOverlayDesign
        );

        if (selectedDesign) {
          setOverlayDesign(selectedDesign);
        }
      }

      // 커스텀 디자인 코드 설정
      if (settings.chatCustomDesignCode) {
        setChatCustomDesignCode(settings.chatCustomDesignCode);
      }

      // 커스텀 커맨드 설정
      if (settings.customCommands) {
        const commandsArray = Object.entries(settings.customCommands).map(
          ([name, response], index) => ({
            id: index + 1,
            name,
            response,
          })
        );
        setCustomCommands(commandsArray);
      }

      console.log('설정이 성공적으로 로드되었습니다.');
      return settings;
    } catch (error) {
      console.error('설정 로드 중 오류가 발생했습니다:', error);
      return null;
    }
  }, []);

  const handleSetMenuItem = useCallback((item: string) => setMenuItem(item), []);
  const handleSetCommandSettings = useCallback(
    (settings: (prevItems: CommandSettingItem[]) => CommandSettingItem[]) =>
      setCommandSettings(settings),
    []
  );
  const handleSetCustomCommands = useCallback(
    (
      commands: ((prevCommands: CustomCommandItem[]) => CustomCommandItem[]) | CustomCommandItem[]
    ) => setCustomCommands(commands),
    []
  );
  const handleIsChatOverlayActivated = useCallback(
    (value: boolean) => setIsChatOverlayActivated(value),
    []
  );
  const handleSetOverlayDesign = useCallback((design: OptionItem) => setOverlayDesign(design), []);
  const handleSetIsBotEnabled = useCallback((value: boolean) => setIsBotEnabled(value), []);
  const handleSetChatCustomDesignCode = useCallback(
    (code: string) => setChatCustomDesignCode(code),
    []
  );

  return (
    <sharedStateContext.Provider
      value={{
        menuItem,
        fetch,
        fetchSettings,
        setMenuItem: handleSetMenuItem,
        commandSettings,
        setCommandSettings: handleSetCommandSettings,
        customCommands,
        setCustomCommands: handleSetCustomCommands,
        isChatOverlayActivated,
        setIsChatOverlayActivated: handleIsChatOverlayActivated,
        overlayDesign,
        setOverlayDesign: handleSetOverlayDesign,
        chatCustomDesignCode,
        setChatCustomDesignCode: handleSetChatCustomDesignCode,
        isBotEnabled,
        setIsBotEnabled: handleSetIsBotEnabled,
      }}
    >
      {children}
    </sharedStateContext.Provider>
  );
}

export function useSharedState() {
  const context = useContext(sharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateContextProvider');
  }
  return context;
}

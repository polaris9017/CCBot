export interface DashboardSettings {
  activateBot?: boolean;
  activateUptime?: boolean;
  activateMemo?: boolean;
  activateFixedMessage?: boolean;
  activateCustomCommands?: boolean;
  customCommands?: Record<string, string> | null;
  activateChatOverlay?: boolean;
  chatOverlayDesign?: string;
  activateChatCustomDesign?: boolean;
  chatCustomDesignCode?: string | null;
}

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

export interface OptionItem {
  id: number;
  name?: string;
  value?: string;
}

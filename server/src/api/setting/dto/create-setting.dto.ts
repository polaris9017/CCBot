import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsNotEmpty()
  settings: {
    activateBot: boolean;
    activateUptime: boolean;
    activateMemo: boolean;
    activateFixedMessage: boolean;
    activateCustomCommands: boolean;
    customCommands?: Record<string, string> | null;
    activateChatOverlay: boolean;
    chatOverlayDesign: string; // Assuming this is a string representation of an enum
    activateChatCustomDesign: boolean;
    chatCustomDesignCode?: string | null;
  };
}

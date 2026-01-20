// Central typing for the Electron preload bridge.
//
// This file exists to avoid TS2717 conflicts caused by redeclaring `window.electronAPI`
// with different types across modules.

export {};

declare global {
  interface Window {
    electronAPI?: {
      // Window controls
      minimize?: () => void;
      maximize?: () => void;
      close?: () => void;
      isMaximized?: () => Promise<boolean> | boolean;
      focusWindow?: () => void;

      // Notifications
      showNotification?: (options: {
        title: string;
        body: string;
        icon?: string;
        silent?: boolean;
        urgency?: 'normal' | 'critical' | 'low';
        tag?: string;
      }) => void;
      onNotificationClick?: (callback: (tag: string) => void) => void;

      // Direct printing (Electron)
      getPrinters?: () => Promise<
        Array<{ name: string; displayName?: string; description?: string; isDefault?: boolean; status?: number }>
      >;
      printHtml?: (options: {
        html: string;
        title?: string;
        deviceName?: string;
        silent?: boolean;
        copies?: number;
        landscape?: boolean;
      }) => Promise<{ success: boolean; error?: string } | void>;
    };
  }
}

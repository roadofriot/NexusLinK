import React, { useState } from 'react';
import { ViewTab, ThemeMode, UserProfile } from '../types';

interface TopAppBarProps {
  activeTab: ViewTab;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  onOpenNewSession: () => void;
  onOpenCommandPalette: () => void;
  onOpenUserProfile: () => void;
  user: UserProfile | null;
  theme: ThemeMode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  onOpenNewSession,
  onOpenCommandPalette,
  onOpenUserProfile,
  user,
  theme,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Device Screen Locked', text: 'Samsung Galaxy S23 lock activated', time: '2m ago' },
    { id: '2', title: 'AnyDesk Session Linked', text: 'Windows 11 Desktop (00:1A:2B:3C:4D:5E) connected', time: '12m ago' },
    { id: '3', title: 'File Transfer Complete', text: 'hero_banner_v2.png sent (2.4 MB)', time: '25m ago' },
  ]);

  const titles: Record<ViewTab, { title: string; subtitle: string; icon: string }> = {
    dashboard: {
      title: 'Welcome to MindSparQ 👋',
      subtitle: 'Your all-in-one platform to connect, manage, and control devices.',
      icon: 'dashboard',
    },
    devices: {
      title: 'Connected Devices',
      subtitle: 'Manage active mobile, laptop, and desktop connections.',
      icon: 'devices',
    },
    connections: {
      title: 'Connect New Device',
      subtitle: 'Pair via AnyDesk/TeamViewer ID, MAC address, Wireless ADB, or QR Code.',
      icon: 'hub',
    },
    'file-transfer': {
      title: 'File Transfer Hub',
      subtitle: 'High-speed encrypted dual-pane file management.',
      icon: 'folder_shared',
    },
    apps: {
      title: 'Remote App Management',
      subtitle: 'Inspect, launch, or manage applications across connected nodes.',
      icon: 'apps',
    },
    'screen-mirror': {
      title: 'High-Speed Remote Access & Screen Mirror',
      subtitle: 'Interactive real-time remote control with screen lock unlock feature.',
      icon: 'screenshot_monitor',
    },
    commands: {
      title: 'Remote Shell & ADB Commands',
      subtitle: 'Execute diagnostic shell commands and Wake-on-LAN packets.',
      icon: 'terminal',
    },
    automation: {
      title: 'Automations & Macro Workflows',
      subtitle: 'Configure automated file syncs, scheduled terminal scripts, and triggers.',
      icon: 'account_tree',
    },
    logs: {
      title: 'Performance & Audit Session Logs',
      subtitle: 'Monitor system metrics, WebRTC frame rates, and security logs.',
      icon: 'insights',
    },
    settings: {
      title: 'System & Security Settings',
      subtitle: 'Configure End-to-End Encryption, whitelist MAC addresses, and latency settings.',
      icon: 'settings',
    },
  };

  const current = titles[activeTab];

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 h-16 transition-colors border-b ${
        theme === 'dark'
          ? 'bg-[#0b1326]/90 border-white/5 text-[#dae2fd]'
          : 'bg-white border-gray-200 text-gray-900 shadow-xs'
      }`}
    >
      {/* Title & Panel Toggle */}
      <div className="flex items-center gap-3">
        {/* Panel Left Toggle Button (Mobile: Open Drawer, Desktop: Collapse/Expand) */}
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              onOpenMobileSidebar();
            } else {
              onToggleSidebarCollapse();
            }
          }}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 border border-gray-200/80 dark:border-white/10"
          title={isSidebarCollapsed ? "Expand Left Panel (Ctrl+B)" : "Collapse Left Panel (Ctrl+B)"}
        >
          <span className="material-symbols-outlined text-xl">
            {isSidebarCollapsed ? 'panel_left_open' : 'panel_left'}
          </span>
        </button>

        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-base md:text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white leading-none">
              {current.title}
            </h1>
            <p className="text-xs text-gray-500 hidden lg:block mt-0.5">
              {current.subtitle}
            </p>
          </div>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-white/10">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0b1326] bg-gray-200 overflow-hidden">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Active user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0b1326] bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                +2
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">Active Sessions</span>
          </div>
        </div>
      </div>

      {/* Action Controls & E2EE Security indicator */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* End to End Encrypted Security Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500 text-base">security</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">End-to-End Encrypted</span>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#131b2e] text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200 dark:bg-white/10 rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* New Session Action */}
        <button
          onClick={onOpenNewSession}
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Connect Session
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-colors relative ${
              theme === 'dark'
                ? 'text-[#c7c4d7] hover:bg-[#222a3d]'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border p-4 z-50 animate-fadeIn ${
                theme === 'dark'
                  ? 'bg-[#171f33] border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10 mb-2">
                <span className="font-bold text-xs text-gray-900 dark:text-white">Notifications</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-[10px] text-blue-600 hover:underline font-mono"
                >
                  Clear all
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No new notifications</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl dark:bg-[#131b2e] bg-gray-50 border border-gray-100 dark:border-white/5 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">{n.title}</span>
                        <span className="text-[9px] text-gray-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Google User Profile Button */}
        <button
          onClick={onOpenUserProfile}
          className="relative p-0.5 rounded-full border-2 border-blue-600 hover:scale-105 transition-all shadow-xs shrink-0 bg-white dark:bg-[#171f33]"
          title={user?.isLoggedIn ? `Google Profile: ${user.name}` : 'Sign in with Google'}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={
                user?.isLoggedIn && user.avatar
                  ? user.avatar
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt="Google User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs border border-gray-200">
            <svg className="w-3 h-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </span>
        </button>

      </div>
    </header>
  );
};

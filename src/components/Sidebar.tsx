import React, { useState } from 'react';
import { ViewTab, ThemeMode } from '../types';

interface SidebarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenProModal: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onOpenProModal,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {

  const navItems: { id: ViewTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'devices', label: 'Devices', icon: 'devices' },
    { id: 'connections', label: 'Remote Access / ID', icon: 'hub' },
    { id: 'screen-mirror', label: 'Live Control & Mirror', icon: 'screenshot_monitor' },
    { id: 'file-transfer', label: 'File Manager', icon: 'folder_shared' },
    { id: 'apps', label: 'Apps', icon: 'apps' },
    { id: 'commands', label: 'Terminal', icon: 'terminal' },
    { id: 'automation', label: 'Automation & Workflows', icon: 'account_tree' },
    { id: 'logs', label: 'Performance & Logs', icon: 'insights' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container with smooth Tailwind transitions */}
      <aside
        style={{ willChange: 'width' }}
        className={`sidebar-container fixed md:sticky top-0 left-0 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out border-r shrink-0 flex-shrink-0 will-change-[width] ${
          isCollapsed ? 'w-64 md:w-20 p-3' : 'w-64 md:w-64 p-5'
        } ${
          theme === 'dark'
            ? 'bg-[#171f33] border-white/10 text-[#dae2fd]'
            : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        } ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header Logo & Brand */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6 relative`}>
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => handleNavClick('dashboard')}
            title="MindSparQ NexusLink"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                devices
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                  NexusLink
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  MindSparQ Engine
                </span>
              </div>
            )}
          </div>

          {/* Close button for mobile layout */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.5 gap-3'
                  } rounded-xl font-medium text-xs transition-all duration-200 ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80 shadow-xs'
                      : theme === 'dark'
                      ? 'text-[#c7c4d7] hover:bg-[#2d3449] hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl shrink-0 ${
                      isActive ? (theme === 'dark' ? 'text-white' : 'text-blue-600') : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-gray-200'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>

                {/* Collapsed Tooltip Popup */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section: Theme Switch, High Speed Badge, & Collapse Toggle Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2 mt-auto">
          
          {/* Theme Switcher Button */}
          <div className="relative group">
            <button
              onClick={onToggleTheme}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } rounded-xl text-xs font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-[#131b2e] hover:bg-[#222a3d] text-[#c7c4d7]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                {!isCollapsed && (theme === 'dark' ? 'Dark Theme' : 'Light Theme')}
              </span>
              {!isCollapsed && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
                  Toggle
                </span>
              )}
            </button>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                Switch Theme ({theme === 'dark' ? 'Light' : 'Dark'})
              </div>
            )}
          </div>

          {/* High Speed Status Badge */}
          {!isCollapsed ? (
            <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                  High Speed Mode
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
              </div>
              <div className="text-base font-extrabold text-blue-900 dark:text-blue-100">1.2 Gbps Peer Stream</div>
            </div>
          ) : (
            <div className="relative group flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-[11px] font-bold text-blue-700 dark:text-blue-300">
                1.2G
              </div>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                High Speed Mode (1.2 Gbps E2EE)
              </div>
            </div>
          )}

          {/* PRO Upgrade Link */}
          {!isCollapsed ? (
            <button
              onClick={onOpenProModal}
              className="w-full text-center py-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Upgrade to Pro Features →
            </button>
          ) : (
            <div className="relative group flex justify-center">
              <button
                onClick={onOpenProModal}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl"
              >
                <span className="material-symbols-outlined text-lg">star</span>
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                Upgrade to Pro
              </div>
            </div>
          )}

          {/* COLLAPSE / EXPAND TOGGLE BUTTON AT THE BOTTOM OF THE SIDEBAR */}
          <div className="relative group pt-1">
            <button
              onClick={onToggleCollapse}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
              } rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2e] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 text-xs font-bold transition-all shadow-xs`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  {isCollapsed ? 'panel_left_open' : 'panel_left_close'}
                </span>
                {!isCollapsed && <span>Collapse Sidebar</span>}
              </div>
              {!isCollapsed && (
                <span className="material-symbols-outlined text-sm text-slate-400">
                  chevron_left
                </span>
              )}
            </button>

            {/* Tooltip when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                Expand Sidebar
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};

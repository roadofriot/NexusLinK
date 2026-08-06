import React, { useState, useEffect } from 'react';
import { ViewTab, ThemeMode, Device, UserProfile } from './types';
import { INITIAL_DEVICES } from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { TopAppBar } from './components/TopAppBar';
import { DashboardView } from './components/DashboardView';
import { DevicesView } from './components/DevicesView';
import { ConnectionsView } from './components/ConnectionsView';
import { ScreenMirrorView } from './components/ScreenMirrorView';
import { FileTransferView } from './components/FileTransferView';
import { CommandsView } from './components/CommandsView';
import { AppsView } from './components/AppsView';
import { AutomationView } from './components/AutomationView';
import { LogsView } from './components/LogsView';
import { SettingsView } from './components/SettingsView';
import { ScreenUnlockModal } from './components/ScreenUnlockModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GeminiCopilotModal } from './components/GeminiCopilotModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device>(INITIAL_DEVICES[0]);
  
  // User Profile State (Google Account integration)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Road of Riot',
    email: 'roadofriot@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTtoQ4n9J10zKEo3WC2ZJVPrPB7tmep72XVG2GepMeywhdEigQ0XaUqQYTdUS3XYHFyz6EOdKETIG2Y7-fWxi1mBU-G8eMgChvsRR6imVX6i1X2rV6EkG8uWBe1PDT4VH1l4wnGFYMqhF_kIGkS5g0JUCigG9XfVcqoXdRaaxnF879u0eqPZHFS_vr8ffuRAWjdiZskg1oLbdwWu4ao64L4aZxgHmxgXmQ0-E7gAmGqrVZSd5wcqPn',
    isLoggedIn: true,
    googleAccountType: 'Google Workspace Pro',
    connectedDrive: true,
    quotaUsedGb: 4.2,
    quotaTotalGb: 100,
    joinedDate: 'Jan 2024',
    organization: 'MindSparQ Security Labs',
    subscriptionStatus: 'Google Workspace Pro Tier',
    subscriptionRenews: 'Sept 12, 2026',
    is2FAEnabled: true,
    twoFactorMethod: 'Authenticator App (TOTP)',
    activeSessionsCount: 2,
  });

  // Modals
  const [unlockDeviceModal, setUnlockDeviceModal] = useState<Device | null>(null);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync user profile with server on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.email) {
          setUserProfile((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        // Fallback to local state if server endpoint is loading
      });
  }, []);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K and Ctrl+B / Cmd+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
    showToast('Profile information updated successfully!');
  };

  const handleLoginWithGoogle = () => {
    const freshUser: UserProfile = {
      name: 'Road of Riot',
      email: 'roadofriot@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTtoQ4n9J10zKEo3WC2ZJVPrPB7tmep72XVG2GepMeywhdEigQ0XaUqQYTdUS3XYHFyz6EOdKETIG2Y7-fWxi1mBU-G8eMgChvsRR6imVX6i1X2rV6EkG8uWBe1PDT4VH1l4wnGFYMqhF_kIGkS5g0JUCigG9XfVcqoXdRaaxnF879u0eqPZHFS_vr8ffuRAWjdiZskg1oLbdwWu4ao64L4aZxgHmxgXmQ0-E7gAmGqrVZSd5wcqPn',
      isLoggedIn: true,
      googleAccountType: 'Google Workspace Pro',
      connectedDrive: true,
      quotaUsedGb: 4.2,
      quotaTotalGb: 100,
      joinedDate: 'Jan 2024',
      organization: 'MindSparQ Security Labs',
      subscriptionStatus: 'Google Workspace Pro Tier',
      subscriptionRenews: 'Sept 12, 2026',
      is2FAEnabled: true,
      twoFactorMethod: 'Authenticator App (TOTP)',
      activeSessionsCount: 2,
    };
    setUserProfile(freshUser);
    showToast('Signed in with Google Account: roadofriot@gmail.com');
  };

  const handleLogout = () => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    showToast('Signed out from Google Account.');
  };

  const handleToggleDriveSync = () => {
    setUserProfile((prev) => {
      const nextState = !prev.connectedDrive;
      showToast(nextState ? 'Google Drive Remote Backup enabled' : 'Google Drive sync paused');
      return { ...prev, connectedDrive: nextState };
    });
  };

  const handleSelectDeviceForMirror = (dev: Device) => {
    setSelectedDevice(dev);
    setActiveTab('screen-mirror');
  };

  const handleConnectPartnerId = (partnerIdOrMac: string) => {
    const existing = devices.find(
      (d) =>
        d.partnerId.toLowerCase() === partnerIdOrMac.toLowerCase() ||
        d.macAddress.toLowerCase() === partnerIdOrMac.toLowerCase()
    );

    if (existing) {
      setSelectedDevice(existing);
      setActiveTab('screen-mirror');
      showToast(`Connected to remote device: ${existing.name} (${existing.macAddress})`);
    } else {
      const newDev: Device = {
        id: `dev-${Date.now()}`,
        name: `Remote Device (${partnerIdOrMac})`,
        platform: 'windows',
        osVersion: 'Windows 11 Remote Node',
        ipAddress: '192.168.1.210',
        macAddress: partnerIdOrMac.includes(':') ? partnerIdOrMac : '00:1A:2B:99:88:77',
        partnerId: partnerIdOrMac.includes('MSQ') ? partnerIdOrMac : `MSQ-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
        batteryLevel: 95,
        status: 'connected',
        isLocked: true,
        lockType: 'password',
        pingMs: 4,
        fps: 60,
        storageUsedGb: 120,
        storageTotalGb: 500,
        lastActive: 'Connected now',
      };

      setDevices((prev) => [newDev, ...prev]);
      setSelectedDevice(newDev);
      setActiveTab('screen-mirror');
      showToast(`New Remote Peer E2EE session connected for ${partnerIdOrMac}`);
    }
  };

  const handleUnlockSuccess = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, isLocked: false } : d))
    );
    showToast(`Device screen unlocked successfully via E2EE!`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0b1326] text-[#dae2fd]' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProModal={() => setIsProModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content View Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header App Bar */}
        <TopAppBar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenNewSession={() => setActiveTab('connections')}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenUserProfile={() => setIsProfileModalOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          user={userProfile}
          theme={theme}
        />

        {/* Dynamic View Panes */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              devices={devices}
              onSelectTab={setActiveTab}
              onSelectDeviceForMirror={handleSelectDeviceForMirror}
              onOpenUnlockModal={(dev) => setUnlockDeviceModal(dev)}
              onConnectPartnerId={handleConnectPartnerId}
              theme={theme}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesView
              devices={devices}
              onSelectDeviceForMirror={handleSelectDeviceForMirror}
              onOpenUnlockModal={(dev) => setUnlockDeviceModal(dev)}
              onSelectTab={setActiveTab}
              onAddNewDevice={() => setActiveTab('connections')}
            />
          )}

          {activeTab === 'connections' && (
            <ConnectionsView
              devices={devices}
              onConnectPartnerId={handleConnectPartnerId}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'screen-mirror' && (
            <ScreenMirrorView
              devices={devices}
              selectedDevice={selectedDevice}
              onSelectDevice={setSelectedDevice}
              onOpenUnlockModal={(dev) => setUnlockDeviceModal(dev)}
            />
          )}

          {activeTab === 'file-transfer' && (
            <FileTransferView
              devices={devices}
              selectedDevice={selectedDevice}
            />
          )}

          {activeTab === 'commands' && (
            <CommandsView selectedDevice={selectedDevice} />
          )}

          {activeTab === 'apps' && (
            <AppsView selectedDevice={selectedDevice} />
          )}

          {activeTab === 'automation' && (
            <AutomationView devices={devices} />
          )}

          {activeTab === 'logs' && (
            <LogsView selectedDevice={selectedDevice} />
          )}

          {activeTab === 'settings' && (
            <SettingsView theme={theme} onToggleTheme={handleToggleTheme} />
          )}
        </main>
      </div>

      {/* Screen Unlock Modal */}
      {unlockDeviceModal && (
        <ScreenUnlockModal
          device={unlockDeviceModal}
          onClose={() => setUnlockDeviceModal(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onLoginWithGoogle={handleLoginWithGoogle}
        onLogout={handleLogout}
        onToggleDriveSync={handleToggleDriveSync}
      />

      {/* Pro Upgrade Modal */}
      {isProModalOpen && (
        <ProUpgradeModal onClose={() => setIsProModalOpen(false)} />
      )}

      {/* Global Command Palette Search Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        devices={devices}
        onSelectTab={setActiveTab}
        onSelectDeviceForMirror={handleSelectDeviceForMirror}
        onConnectPartnerId={handleConnectPartnerId}
      />

      {/* Gemini AI Copilot Chatbot Modal */}
      <GeminiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        theme={theme}
      />
    </div>
  );
}

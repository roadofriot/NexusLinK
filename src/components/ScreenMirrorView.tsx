import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device } from '../types';

interface ClipboardItem {
  id: string;
  text: string;
  timestamp: string;
  source: 'local' | 'remote';
  isPinned: boolean;
}

interface DeviceNotification {
  id: string;
  appName: string;
  appIcon: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'system' | 'messaging' | 'security' | 'apps';
  isRead: boolean;
}

interface ScreenMirrorViewProps {
  devices: Device[];
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
  onOpenUnlockModal: (device: Device) => void;
}

export const ScreenMirrorView: React.FC<ScreenMirrorViewProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  onOpenUnlockModal,
}) => {
  const [rotationDegree, setRotationDegree] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [touchRipples, setTouchRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  
  // Side Panel Tool Mode: 'controls' | 'clipboard' | 'notifications'
  const [activeSidePanel, setActiveSidePanel] = useState<'controls' | 'clipboard' | 'notifications'>('controls');

  // Clipboard History State
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([
    {
      id: 'clip-1',
      text: 'https://mindsparq.ai/remote/pairing-key?id=7X9-B42',
      timestamp: '2 mins ago',
      source: 'local',
      isPinned: true,
    },
    {
      id: 'clip-2',
      text: 'ADB Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
      timestamp: '10 mins ago',
      source: 'remote',
      isPinned: true,
    },
    {
      id: 'clip-3',
      text: 'Server IP: 192.168.1.105 (Port 3000)',
      timestamp: '25 mins ago',
      source: 'remote',
      isPinned: false,
    },
    {
      id: 'clip-4',
      text: '00:1A:2B:3C:4D:5E',
      timestamp: '1 hour ago',
      source: 'local',
      isPinned: false,
    },
  ]);
  const [clipboardSearch, setClipboardSearch] = useState('');
  const [newClipText, setNewClipText] = useState('');
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);

  // Real-Time System Notifications State
  const [notifications, setNotifications] = useState<DeviceNotification[]>([
    {
      id: 'notif-1',
      appName: 'WhatsApp Business',
      appIcon: 'chat',
      title: 'New Client Inquiry',
      body: 'Hello! Can we connect via remote desktop session now?',
      timestamp: 'Just now',
      category: 'messaging',
      isRead: false,
    },
    {
      id: 'notif-2',
      appName: 'Android System',
      appIcon: 'security',
      title: 'E2EE Stream Active',
      body: 'MindSparQ Remote Desktop Agent is broadcasting AES-256 screen payload.',
      timestamp: '5 mins ago',
      category: 'security',
      isRead: false,
    },
    {
      id: 'notif-3',
      appName: 'Google Drive Sync',
      appIcon: 'cloud_sync',
      title: 'Backup Complete',
      body: '14 screenshots and logs synchronized to cloud storage.',
      timestamp: '12 mins ago',
      category: 'apps',
      isRead: true,
    },
    {
      id: 'notif-4',
      appName: 'Battery Safeguard',
      appIcon: 'battery_alert',
      title: 'Battery Level 92%',
      body: 'Device connected to fast charger.',
      timestamp: '30 mins ago',
      category: 'system',
      isRead: true,
    },
  ]);
  const [selectedNotifFilter, setSelectedNotifFilter] = useState<'all' | 'system' | 'messaging' | 'security' | 'apps'>('all');
  const [isNotificationListenerActive, setIsNotificationListenerActive] = useState(true);

  // Periodic Simulated Notification Stream Listener
  useEffect(() => {
    if (!isNotificationListenerActive) return;

    const interval = setInterval(() => {
      const randomNotif: DeviceNotification = {
        id: `notif-${Date.now()}`,
        appName: selectedDevice.platform === 'ios' ? 'iOS System Guard' : 'Android System',
        appIcon: 'notifications_active',
        title: 'Peer Ping Heartbeat',
        body: `Live status verified for ${selectedDevice.name} (${selectedDevice.ipAddress}). Latency: ${Math.floor(Math.random() * 10 + 12)}ms.`,
        timestamp: 'Just now',
        category: 'system',
        isRead: false,
      };

      setNotifications((prev) => [randomNotif, ...prev.slice(0, 9)]);
    }, 25000); // Receive new notification packet every 25 seconds

    return () => clearInterval(interval);
  }, [isNotificationListenerActive, selectedDevice]);

  // Handle Rotation
  const handleRotate = () => {
    setRotationDegree((prev) => (prev + 90) % 360);
  };

  // Handle Screen Touch Click Ripple Effect
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setTouchRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setTouchRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Toggle Screen Recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Clipboard Actions
  const handlePinClipboard = (id: string) => {
    setClipboardItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const handleSendToRemoteClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccessId(id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const handleAddClipboardSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClipText.trim()) return;

    const newItem: ClipboardItem = {
      id: `clip-${Date.now()}`,
      text: newClipText.trim(),
      timestamp: 'Just now',
      source: 'local',
      isPinned: false,
    };

    setClipboardItems((prev) => [newItem, ...prev]);
    setNewClipText('');
  };

  const filteredClipboard = clipboardItems.filter((item) =>
    item.text.toLowerCase().includes(clipboardSearch.toLowerCase())
  );

  // Notification Actions
  const handleDismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(
    (n) => selectedNotifFilter === 'all' || n.category === selectedNotifFilter
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 pb-20 text-gray-900 dark:text-white">
      
      {/* Top Controls Toolbar */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        
        {/* Device Switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Active Remote Node:
          </label>
          <select
            value={selectedDevice.id}
            onChange={(e) => {
              const found = devices.find((d) => d.id === e.target.value);
              if (found) onSelectDevice(found);
            }}
            className="bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.platform.toUpperCase()} • {d.ipAddress})
              </option>
            ))}
          </select>
        </div>

        {/* Lock Status & Screen Controls */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-hidden">
          
          {/* Lock Screen Toggle Button */}
          <button
            onClick={() => onOpenUnlockModal(selectedDevice)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedDevice.isLocked
                ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-400 animate-pulse'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {selectedDevice.isLocked ? 'lock' : 'lock_open'}
            </span>
            {selectedDevice.isLocked ? 'Unlock Screen Lock' : 'Screen Unlocked'}
          </button>

          {/* Rotate Button */}
          <button
            onClick={handleRotate}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131b2e] text-gray-800 dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Rotate Screen"
          >
            <span className="material-symbols-outlined text-base">rotate_right</span>
            <span className="hidden sm:inline">{rotationDegree}°</span>
          </button>

          {/* Record Button */}
          <button
            onClick={toggleRecording}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-[#131b2e] text-gray-800 dark:text-white hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <span className="material-symbols-outlined text-base">videocam</span>
            {isRecording ? 'Recording...' : 'Record'}
          </button>

          {/* Screenshot Button */}
          <button
            onClick={() => alert(`Screenshot captured from ${selectedDevice.name}!`)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131b2e] text-gray-800 dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Take Screenshot"
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span className="hidden sm:inline">Capture</span>
          </button>

        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Interactive Tool Panels (Spans 4 cols on desktop) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          
          {/* Tool Switcher Tabs Header */}
          <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setActiveSidePanel('controls')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSidePanel === 'controls'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">sports_esports</span>
              Nav Controls
            </button>
            <button
              onClick={() => setActiveSidePanel('clipboard')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSidePanel === 'clipboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">assignment</span>
              Clipboard ({clipboardItems.length})
            </button>
            <button
              onClick={() => setActiveSidePanel('notifications')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                activeSidePanel === 'notifications'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">notifications</span>
              Alerts
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ml-1">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Panel 1: Navigation Controls */}
          {activeSidePanel === 'controls' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-4 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-base">sports_esports</span>
                  Hardware & Touch Controls
                </h3>

                {/* Android / iOS Navigation Keys */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <button className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span className="text-[10px] font-semibold">Back</span>
                  </button>
                  <button className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-lg">home</span>
                    <span className="text-[10px] font-semibold">Home</span>
                  </button>
                  <button className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white flex flex-col items-center gap-1 transition-colors border border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-lg">crop_din</span>
                    <span className="text-[10px] font-semibold">Recents</span>
                  </button>
                </div>

                {/* Power & Volume Controls */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button
                    onClick={() => onOpenUnlockModal(selectedDevice)}
                    className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2 transition-colors text-xs font-semibold border border-amber-200 dark:border-amber-500/30"
                  >
                    <span className="material-symbols-outlined text-base">power_settings_new</span>
                    Power / Lock
                  </button>
                  <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#131b2e] hover:bg-blue-50 text-gray-900 dark:text-white flex items-center justify-center gap-2 transition-colors text-xs font-semibold border border-gray-200 dark:border-white/10">
                    <span className="material-symbols-outlined text-base">volume_up</span>
                    Vol + / -
                  </button>
                </div>

                {/* Desktop Key Combinations */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">
                    Remote Desktop Combinations
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-[#131b2e] text-[11px] font-mono hover:bg-blue-50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                      Ctrl + Alt + Del
                    </button>
                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-[#131b2e] text-[11px] font-mono hover:bg-blue-50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                      Alt + Tab
                    </button>
                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-[#131b2e] text-[11px] font-mono hover:bg-blue-50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                      Win + D
                    </button>
                    <button className="p-2 rounded-lg bg-gray-50 dark:bg-[#131b2e] text-[11px] font-mono hover:bg-blue-50 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                      Cmd + Space
                    </button>
                  </div>
                </div>
              </div>

              {/* Stream Quality & E2EE Info */}
              <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl font-mono text-xs space-y-1.5 text-gray-500 shadow-xs">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">1080 x 2400 (FHD+)</span>
                </div>
                <div className="flex justify-between">
                  <span>Framerate:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedDevice.fps} FPS</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedDevice.pingMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">AES-256-GCM Direct</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Panel 2: Clipboard History Manager */}
          {activeSidePanel === 'clipboard' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-base">assignment</span>
                  Synced Clipboard History
                </h3>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                  Auto-Sync Active
                </span>
              </div>

              {/* Search Clipboard Box */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={clipboardSearch}
                  onChange={(e) => setClipboardSearch(e.target.value)}
                  placeholder="Search copied strings, links, tokens..."
                  className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Quick Add Snippet Form */}
              <form onSubmit={handleAddClipboardSnippet} className="flex gap-2">
                <input
                  type="text"
                  value={newClipText}
                  onChange={(e) => setNewClipText(e.target.value)}
                  placeholder="Push string to remote clipboard..."
                  className="flex-1 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs"
                >
                  Push
                </button>
              </form>

              {/* Clipboard Item List */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto scroll-hidden">
                <AnimatePresence mode="popLayout">
                  {filteredClipboard.map((clip) => (
                    <motion.div
                      key={clip.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`p-3 rounded-xl border space-y-2 transition-all ${
                        clip.isPinned
                          ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30'
                          : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-mono text-gray-900 dark:text-white break-all leading-snug">
                          {clip.text}
                        </p>
                        <button
                          onClick={() => handlePinClipboard(clip.id)}
                          className={`p-1 rounded text-xs transition-colors ${
                            clip.isPinned ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={clip.isPinned ? 'Unpin snippet' : 'Pin snippet'}
                        >
                          <span className="material-symbols-outlined text-base">keep</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-200/50 dark:border-white/5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-blue-500">
                            {clip.source === 'local' ? 'laptop' : 'smartphone'}
                          </span>
                          {clip.source === 'local' ? 'Local Host' : selectedDevice.name} • {clip.timestamp}
                        </span>

                        <button
                          onClick={() => handleSendToRemoteClipboard(clip.text, clip.id)}
                          className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-sans font-semibold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {copySuccessId === clip.id ? 'check' : 'content_copy'}
                          </span>
                          {copySuccessId === clip.id ? 'Copied & Synced!' : 'Send to Node'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {/* Panel 3: Real-Time System Notifications Listener */}
          {activeSidePanel === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600 text-base">notifications_active</span>
                    Live System Alerts
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNotificationListenerActive(!isNotificationListenerActive)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                      isNotificationListenerActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {isNotificationListenerActive ? 'Listener ON' : 'Paused'}
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAllNotifs}
                      className="text-[10px] text-gray-400 hover:text-rose-500 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto scroll-hidden">
                {(['all', 'system', 'messaging', 'security', 'apps'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNotifFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                      selectedNotifFilter === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notification Item Cards */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto scroll-hidden">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 font-mono text-xs">
                    No active notifications captured.
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl p-3 space-y-1.5 relative group hover:border-blue-400 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm">{notif.appIcon}</span>
                            </span>
                            <span className="font-bold text-xs text-gray-900 dark:text-white">{notif.appName}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{notif.timestamp}</span>
                        </div>

                        <div>
                          <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200">{notif.title}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{notif.body}</p>
                        </div>

                        <div className="pt-1.5 flex justify-end gap-2 text-[10px]">
                          <button
                            onClick={() => alert(`Replied to ${notif.appName}: OK received.`)}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-semibold"
                          >
                            Quick Reply
                          </button>
                          <button
                            onClick={() => handleDismissNotif(notif.id)}
                            className="px-2 py-0.5 rounded text-gray-400 hover:text-rose-500 font-semibold"
                          >
                            Dismiss
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

            </motion.div>
          )}

        </div>

        {/* Center Screen Mirror Canvas Display (Spans 8 cols on desktop) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col items-center">
          <div
            onClick={handleScreenClick}
            style={{ transform: `rotate(${rotationDegree}deg)` }}
            className="relative w-full max-w-xl aspect-[9/18] bg-gray-900 dark:bg-[#060e20] rounded-3xl p-3 border-4 border-gray-300 dark:border-white/10 shadow-2xl overflow-hidden cursor-crosshair select-none transition-transform duration-300 flex items-center justify-center"
          >
            {/* Screen Wallpaper / Image */}
            {selectedDevice.screenImage ? (
              <img
                src={selectedDevice.screenImage}
                alt="Live Stream"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white/80 p-6 text-center space-y-3">
                <span className="material-symbols-outlined text-6xl text-blue-500 animate-pulse">
                  desktop_windows
                </span>
                <h3 className="font-bold text-lg">{selectedDevice.name}</h3>
                <p className="text-xs text-emerald-400 font-mono">
                  60 FPS E2EE Peer-to-Peer Stream Connected
                </p>
              </div>
            )}

            {/* Click / Touch Ripple Overlay */}
            {touchRipples.map((ripple) => (
              <div
                key={ripple.id}
                style={{ top: ripple.y, left: ripple.x }}
                className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-blue-500 bg-blue-500/40 animate-ping pointer-events-none z-30"
              />
            ))}

            {/* Lock Screen Overlay Notice */}
            {selectedDevice.isLocked && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-30 flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-4xl">lock</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">{selectedDevice.name} is Locked</h3>
                  <p className="text-xs text-white/70 max-w-xs mt-1">
                    Enter the PIN, gesture pattern, or password to bypass and access the screen.
                  </p>
                </div>
                <button
                  onClick={() => onOpenUnlockModal(selectedDevice)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">lock_open</span>
                  Open Unlock Screen Controller
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

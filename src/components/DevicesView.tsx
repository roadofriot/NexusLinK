import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, PlatformType, ViewTab } from '../types';

interface DevicesViewProps {
  devices: Device[];
  onSelectDeviceForMirror: (device: Device) => void;
  onOpenUnlockModal: (device: Device) => void;
  onSelectTab: (tab: ViewTab) => void;
  onAddNewDevice: () => void;
}

export const DevicesView: React.FC<DevicesViewProps> = ({
  devices,
  onSelectDeviceForMirror,
  onOpenUnlockModal,
  onSelectTab,
  onAddNewDevice,
}) => {
  const [filterPlatform, setFilterPlatform] = useState<PlatformType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((dev) => {
    const matchesPlatform = filterPlatform === 'all' || dev.platform === filterPlatform;
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.partnerId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Search & Platform Filter Bar */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, MAC address, or IP..."
            className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Platform Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scroll-hidden">
          {(['all', 'android', 'ios', 'windows', 'macos'] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => setFilterPlatform(platform)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                filterPlatform === platform
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-300 hover:text-gray-900 border border-gray-200 dark:border-white/10'
              }`}
            >
              {platform === 'all' ? 'All Platforms' : platform}
            </button>
          ))}
        </div>

        {/* Add Device Button */}
        <button
          onClick={onAddNewDevice}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_link</span>
          Connect New Node
        </button>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDevices.map((dev) => (
            <motion.div
              key={dev.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all shadow-xs group relative overflow-hidden"
            >
            {/* Top row: Platform Badge & Screen Lock Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">
                    {dev.platform === 'android'
                      ? 'android'
                      : dev.platform === 'ios'
                      ? 'phone_iphone'
                      : dev.platform === 'windows'
                      ? 'desktop_windows'
                      : 'laptop_mac'}
                  </span>
                </span>
                <div>
                  <span className="font-bold text-xs uppercase text-blue-600 dark:text-blue-400">{dev.platform}</span>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    ID: {dev.partnerId}
                  </span>
                </div>
              </div>

              {/* Unlock Lock Screen Button */}
              <button
                onClick={() => onOpenUnlockModal(dev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  dev.isLocked
                    ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-400 animate-pulse'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {dev.isLocked ? 'lock' : 'lock_open'}
                </span>
                {dev.isLocked ? 'Unlock Screen' : 'Unlocked'}
              </button>
            </div>

            {/* Middle row: Device Name & Technical Specs */}
            <div className="space-y-2">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center justify-between">
                <span>{dev.name}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h3>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 text-xs font-mono space-y-1 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>MAC Address:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{dev.macAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>IP Address:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{dev.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>OS Version:</span>
                  <span className="text-gray-800 dark:text-gray-200">{dev.osVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>E2EE Stream:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">AES-256 Active</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Battery, Ping Latency & Actions */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">
                    battery_charging_full
                  </span>
                  {dev.batteryLevel}%
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">{dev.pingMs}ms</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('file-transfer')}
                  title="Files"
                  className="p-2 rounded-xl bg-gray-100 dark:bg-[#131b2e] hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">folder_shared</span>
                </button>
                <button
                  onClick={() => onSelectDeviceForMirror(dev)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">screenshot_monitor</span>
                  Mirror
                </button>
              </div>
            </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

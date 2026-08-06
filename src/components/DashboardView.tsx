import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, ViewTab, ThemeMode } from '../types';

interface DashboardViewProps {
  devices: Device[];
  onSelectTab: (tab: ViewTab) => void;
  onSelectDeviceForMirror: (device: Device) => void;
  onOpenUnlockModal: (device: Device) => void;
  onConnectPartnerId: (partnerIdOrMac: string) => void;
  theme: ThemeMode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  devices,
  onSelectTab,
  onSelectDeviceForMirror,
  onOpenUnlockModal,
  onConnectPartnerId,
  theme,
}) => {
  const [partnerInput, setPartnerInput] = useState('');
  const [selectedPreviewDevice, setSelectedPreviewDevice] = useState<Device>(devices[0] || devices[1]);
  const [isCopied, setIsCopied] = useState(false);

  // Quick stats calculation
  const totalConnected = devices.filter((d) => d.status === 'connected').length;
  const androidCount = devices.filter((d) => d.platform === 'android').length;
  const iosCount = devices.filter((d) => d.platform === 'ios').length;
  const activeSessions = devices.filter((d) => d.status === 'connected').length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('7X9-B42');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleQuickConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerInput.trim()) {
      onConnectPartnerId(partnerInput.trim());
      setPartnerInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('devices')}
          className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-blue-500/40 transition-all shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl dark:bg-[#1f283e] bg-blue-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">smartphone</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalConnected}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Connected Devices</div>
          </div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('devices')}
          className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-emerald-500/40 transition-all shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl dark:bg-[#1f283e] bg-emerald-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">android</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{androidCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Android Devices</div>
          </div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('devices')}
          className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-sky-500/40 transition-all shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl dark:bg-[#1f283e] bg-sky-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-sky-600 dark:text-sky-400 text-2xl">phone_iphone</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{iosCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">iOS Devices</div>
          </div>
        </motion.div>

        {/* Stat 4 */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTab('connections')}
          className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-purple-500/40 transition-all shadow-xs"
        >
          <div className="w-12 h-12 rounded-xl dark:bg-[#1f283e] bg-purple-50 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">cast_connected</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeSessions}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Active Remote Sessions</div>
          </div>
        </motion.div>
      </div>


      {/* Main Grid Section */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Connected Devices & Bento Actions (Spans 8 cols) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          
          {/* Connected Devices Card Section */}
          <section className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-gray-900 dark:text-white">Connected Devices</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-mono font-semibold">
                  Online
                </span>
              </div>
              <button
                onClick={() => onSelectTab('devices')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30"
              >
                View All ({devices.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.slice(0, 2).map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white dark:bg-[#131b2e] rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-all group relative shadow-xs"
                >
                  <div className="flex gap-4">
                    {/* Device Thumbnail */}
                    <div className="w-16 h-28 rounded-xl bg-gray-50 dark:bg-[#060e20] border border-gray-200 dark:border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {dev.screenImage ? (
                        <img
                          src={dev.screenImage}
                          alt={dev.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-gray-400">
                          laptop
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 mb-1">
                            {dev.platform}
                          </span>
                          {/* Unlock Lock Status Indicator Button */}
                          <button
                            onClick={() => onOpenUnlockModal(dev)}
                            title={dev.isLocked ? "Click to unlock screen" : "Screen Unlocked"}
                            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              dev.isLocked
                                ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-400'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {dev.isLocked ? 'lock' : 'lock_open'}
                            </span>
                            {dev.isLocked ? 'Unlock Screen' : 'Unlocked'}
                          </button>
                        </div>

                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{dev.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dev.osVersion}</p>
                        <p className="text-[11px] font-mono text-gray-400 mt-1">
                          IP: {dev.ipAddress} • MAC: {dev.macAddress}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10 mt-2">
                        <span className="text-[11px] font-mono flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <span className="material-symbols-outlined text-xs text-emerald-500">
                            battery_charging_full
                          </span>
                          {dev.batteryLevel}%
                        </span>

                        <button
                          onClick={() => {
                            setSelectedPreviewDevice(dev);
                            onSelectDeviceForMirror(dev);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          Mirror & Control
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Connect & Quick Actions Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AnyDesk / TeamViewer Remote MAC & Code Connect Box */}
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">hub</span>
                    Start Remote Connection
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    E2EE AES-256
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Enter remote Partner ID or MAC Address to start high-speed encrypted access.
                </p>

                {/* Direct MAC / ID Connect Form */}
                <form onSubmit={handleQuickConnectSubmit} className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] uppercase text-gray-400 font-bold tracking-tight block mb-1">
                      MAC Address / ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={partnerInput}
                        onChange={(e) => setPartnerInput(e.target.value)}
                        placeholder="00:1A:2B:3C:4D:5E"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!partnerInput.trim()}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    Connect Now
                  </button>
                </form>

                {/* QR Code Container */}
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#060e20] p-3 rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0 relative overflow-hidden shadow-xs">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTJvhMqKzxA4_hxMwl2c1Hi_MWS-trfKyWHtSA1rLHTHlICu1GG6c7QEDCVwO2hCSAW3FsdchjoVZALPw7YPOtvMfpJBXTyXck3ZWg-3oAjcTZNwiTlPGS3F8_2tbCqs9S2k-0w1eh3-GFGPeZ0fHNbh5V-KAvrLG7D8TFwjbtcGPtszCfztaHB3VV3bMAsjc9pzwSLwof_Nijm9JUmbJXp2zQsjN2s7PdiX6cTfYkSj9wyuBGaTxa"
                      alt="Pairing QR Code"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 animate-scan shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 block">Your Server Pairing Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-600 tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                        7X9-B42
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1 rounded text-gray-400 hover:text-gray-700"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access / Recent Devices List (Matching Clean Minimalism Panel) */}
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Access</h3>
                <div className="space-y-2">
                  {devices.map((dev, idx) => (
                    <div
                      key={dev.id}
                      onClick={() => {
                        setSelectedPreviewDevice(dev);
                        onSelectDeviceForMirror(dev);
                      }}
                      className="flex items-center p-3 bg-white dark:bg-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                        idx === 0 ? 'bg-indigo-50 text-indigo-600' : idx === 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {dev.platform === 'android' ? 'smartphone' : dev.platform === 'ios' ? 'phone_iphone' : 'laptop'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{dev.name}</div>
                        <div className="text-[10px] text-gray-400">{dev.lastActive}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${dev.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Interactive Device Mirror Preview (Spans 4 cols) */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 shadow-xs rounded-2xl p-4 flex flex-col h-full space-y-4">
            
            {/* Live Preview Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-gray-900 dark:text-white">Live Preview - {selectedPreviewDevice.name}</span>
              </div>
              <button
                onClick={() => onSelectDeviceForMirror(selectedPreviewDevice)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                Expand Screen
                <span className="material-symbols-outlined text-xs">fullscreen</span>
              </button>
            </div>

            {/* Interactive Phone Frame Visualizer */}
            <div className="flex-1 dark:bg-[#060e20] bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden border border-gray-200 dark:border-white/10">
              
              {/* Phone Outer Frame */}
              <div className="w-full max-w-[240px] aspect-[9/19] dark:bg-[#2d3449] bg-gray-800 rounded-[2.2rem] p-2 shadow-2xl relative border border-gray-700 dark:border-white/10 flex flex-col">
                
                {/* Camera Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-20" />

                {/* Screen Canvas Area */}
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative dark:bg-black bg-slate-900 flex flex-col">
                  
                  {/* Status Overlay */}
                  <div className="absolute top-1 left-0 right-0 px-4 flex justify-between items-center text-[9px] font-mono text-white/80 z-20">
                    <span>10:30</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">wifi</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                  </div>

                  {/* Device Screen Wallpaper */}
                  {selectedPreviewDevice.screenImage ? (
                    <img
                      src={selectedPreviewDevice.screenImage}
                      alt="Device Screen"
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-4 text-center">
                      <span className="material-symbols-outlined text-4xl mb-2">desktop_windows</span>
                      <p className="text-xs font-bold">{selectedPreviewDevice.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-1">E2EE Stream Active</p>
                    </div>
                  )}

                  {/* Lock Screen Overlay Notice */}
                  {selectedPreviewDevice.isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
                      <span className="material-symbols-outlined text-2xl text-amber-400 animate-pulse">
                        lock
                      </span>
                      <p className="text-xs font-bold">Screen Locked</p>
                      <button
                        onClick={() => onOpenUnlockModal(selectedPreviewDevice)}
                        className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md"
                      >
                        Unlock Device
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Screen Navigation Controls Toolbar */}
            <div className="grid grid-cols-5 gap-1 pt-2 border-t border-gray-200 dark:border-white/10 text-center">
              <button
                onClick={() => onSelectDeviceForMirror(selectedPreviewDevice)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex flex-col items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span className="text-[9px]">Home</span>
              </button>
              <button
                onClick={() => onSelectDeviceForMirror(selectedPreviewDevice)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex flex-col items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span className="text-[9px]">Back</span>
              </button>
              <button
                onClick={() => onSelectDeviceForMirror(selectedPreviewDevice)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex flex-col items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-base">crop_din</span>
                <span className="text-[9px]">Recent</span>
              </button>
              <button
                onClick={() => onOpenUnlockModal(selectedPreviewDevice)}
                className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition-colors flex flex-col items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-base">lock_open</span>
                <span className="text-[9px]">Unlock</span>
              </button>
              <button
                onClick={() => onSelectTab('file-transfer')}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors flex flex-col items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-base">folder</span>
                <span className="text-[9px]">Files</span>
              </button>
            </div>

            {/* Sub-bar stats */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 dark:text-gray-400 px-1 pt-1">
              <span>IP: {selectedPreviewDevice.ipAddress}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedPreviewDevice.pingMs}ms • 60 FPS</span>
            </div>

          </div>
        </div>


      </div>

    </motion.div>
  );
};

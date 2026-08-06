import React, { useState } from 'react';
import { Device, LogEntry } from '../types';

interface LogsViewProps {
  selectedDevice: Device;
}

export const LogsView: React.FC<LogsViewProps> = ({ selectedDevice }) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'SECURITY'>('ALL');
  
  const [logs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '19:24:02.102',
      level: 'SECURITY',
      source: 'E2EE-Engine',
      message: 'AES-256-GCM Direct Peer WebRTC Channel established with 8C:3B:AD:12:44:90 (RTT: 4.2ms)',
      deviceId: selectedDevice.id,
    },
    {
      id: 'log-2',
      timestamp: '19:24:15.890',
      level: 'INFO',
      source: 'ScreenMirror',
      message: 'Frame bitrate negotiated at 12.4 Mbps (60 FPS, Hardware HEVC H.265 Accelerated)',
      deviceId: selectedDevice.id,
    },
    {
      id: 'log-3',
      timestamp: '19:25:01.340',
      level: 'SECURITY',
      source: 'ScreenUnlock',
      message: 'Pattern Gesture verification succeeded. Screen lock state overridden by session authority.',
      deviceId: selectedDevice.id,
    },
    {
      id: 'log-4',
      timestamp: '19:25:30.010',
      level: 'WARN',
      source: 'NetworkSpeed',
      message: 'Packet jitter spike detected on WiFi interface (5.8ms -> 14.1ms). Buffer adjusted.',
      deviceId: selectedDevice.id,
    },
    {
      id: 'log-5',
      timestamp: '19:25:55.772',
      level: 'INFO',
      source: 'FileManager',
      message: 'Dual-pane transfer request: /sdcard/Download/Screen_Recording_01.mp4 (45.2 MB) completed.',
      deviceId: selectedDevice.id,
    },
  ]);

  const filteredLogs = logs.filter((l) => (filterLevel === 'ALL' ? true : l.level === filterLevel));

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Remote Frame Bitrate</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12.4 <span className="text-xs font-normal text-gray-500">Mbps</span></div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-xs">speed</span> 60 FPS HEVC Stream
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">End-to-End Latency</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{selectedDevice.pingMs} <span className="text-xs font-normal text-gray-500">ms</span></div>
          <div className="text-[11px] text-gray-400 font-medium mt-1">
            WebRTC Direct Peer
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Storage Utilization</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {selectedDevice.storageUsedGb} <span className="text-xs font-normal text-gray-500">/ {selectedDevice.storageTotalGb} GB</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              style={{ width: `${(selectedDevice.storageUsedGb / selectedDevice.storageTotalGb) * 100}%` }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Battery Status</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{selectedDevice.batteryLevel}%</div>
          <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-xs">battery_charging_full</span>
            {selectedDevice.isCharging ? 'Charging (Fast Charge)' : 'Discharging'}
          </div>
        </div>

      </div>

      {/* Audit & Diagnostic Session Logs Table */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">insights</span>
              Session Diagnostic Logs & Audit Trail
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time events recorded for {selectedDevice.name} ({selectedDevice.macAddress})
            </p>
          </div>

          <div className="flex gap-2">
            {(['ALL', 'INFO', 'WARN', 'SECURITY'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors ${
                  filterLevel === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 border border-gray-200 dark:border-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Console Container */}
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto custom-scrollbar border border-gray-200 dark:border-gray-800">
          {filteredLogs.map((l) => (
            <div key={l.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 py-1.5 border-b border-gray-200 dark:border-gray-800/60 last:border-0">
              <span className="text-gray-400 dark:text-gray-500 shrink-0">[{l.timestamp}]</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  l.level === 'SECURITY'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                    : l.level === 'WARN'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                }`}
              >
                {l.level}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold shrink-0">[{l.source}]</span>
              <span className="text-gray-800 dark:text-gray-300 break-all">{l.message}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

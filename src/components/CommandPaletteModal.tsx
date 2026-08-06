import React, { useState, useEffect } from 'react';
import { Device, ViewTab } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  onSelectTab: (tab: ViewTab) => void;
  onSelectDeviceForMirror: (dev: Device) => void;
  onConnectPartnerId: (id: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  devices,
  onSelectTab,
  onSelectDeviceForMirror,
  onConnectPartnerId,
}) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered lists
  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.macAddress.toLowerCase().includes(query.toLowerCase()) ||
      d.partnerId.toLowerCase().includes(query.toLowerCase())
  );

  const rawActions: { id: string; label: string; icon: string; tab: ViewTab }[] = [
    { id: 'nav-dash', label: 'Go to Dashboard', icon: 'dashboard', tab: 'dashboard' },
    { id: 'nav-dev', label: 'Manage Remote Devices', icon: 'devices', tab: 'devices' },
    { id: 'nav-conn', label: 'Connect via Partner ID / MAC Address', icon: 'hub', tab: 'connections' },
    { id: 'nav-screen', label: 'Open Screen Mirror & Live Control', icon: 'screenshot_monitor', tab: 'screen-mirror' },
    { id: 'nav-file', label: 'Launch Dual-Pane File Manager', icon: 'folder_shared', tab: 'file-transfer' },
    { id: 'nav-app', label: 'Open App Manager & Package Installer', icon: 'apps', tab: 'apps' },
    { id: 'nav-cmd', label: 'Open Remote Terminal & ADB Shell', icon: 'terminal', tab: 'commands' },
    { id: 'nav-auto', label: 'View Automation Workflows & Macros', icon: 'account_tree', tab: 'automation' },
    { id: 'nav-log', label: 'View Performance Graphs & Session Logs', icon: 'insights', tab: 'logs' },
    { id: 'nav-set', label: 'Configure Settings & E2EE Keys', icon: 'settings', tab: 'settings' },
  ];

  const actions = rawActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3 bg-gray-50 dark:bg-[#131b2e]">
          <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, device name, MAC address, or Partner ID..."
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200 dark:bg-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Quick Connection Action if MAC/Partner ID typed */}
          {query.trim().length > 3 && (
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quick Connection Trigger
              </div>
              <button
                onClick={() => {
                  onConnectPartnerId(query.trim());
                  onClose();
                }}
                className="w-full p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center justify-between text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-bold font-mono">
                  <span className="material-symbols-outlined text-sm">cable</span>
                  Connect to: "{query.trim()}"
                </div>
                <span className="text-[10px] uppercase font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  E2EE Session
                </span>
              </button>
            </div>
          )}

          {/* Devices Section */}
          {filteredDevices.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                Devices ({filteredDevices.length})
              </div>
              <div className="space-y-1">
                {filteredDevices.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => {
                      onSelectDeviceForMirror(dev);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-blue-600">
                        {dev.platform === 'android' ? 'smartphone' : dev.platform === 'ios' ? 'phone_iphone' : 'laptop'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">{dev.name}</div>
                        <div className="text-[10px] font-mono text-gray-400">
                          ID: {dev.partnerId} • MAC: {dev.macAddress}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 hover:underline">
                      Mirror Screen →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Actions Section */}
          {actions.length > 0 && (
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                Navigation & Tools
              </div>
              <div className="space-y-1">
                {actions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      onSelectTab(act.tab);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-3 text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-gray-500 text-lg">{act.icon}</span>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

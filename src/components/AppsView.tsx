import React, { useState } from 'react';
import { Device, RemoteApp } from '../types';
import { MOCK_REMOTE_APPS } from '../data/mockData';

interface AppsViewProps {
  selectedDevice: Device;
}

export const AppsView: React.FC<AppsViewProps> = ({ selectedDevice }) => {
  const [apps, setApps] = useState<RemoteApp[]>(MOCK_REMOTE_APPS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAppRunState = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isRunning: !a.isRunning } : a))
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">apps</span>
          </div>
          <div>
            <h2 className="font-bold text-base">Installed Remote Applications</h2>
            <p className="text-xs text-on-surface-variant font-mono">
              Node: {selectedDevice.name} ({selectedDevice.platform.toUpperCase()})
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search remote apps or packages..."
            className="w-full dark:bg-[#131b2e] bg-slate-100 border border-outline-variant/40 rounded-xl py-2 pl-9 pr-4 text-xs focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">{app.iconName}</span>
              </div>
              <div>
                <h3 className="font-bold text-xs flex items-center gap-2">
                  {app.name}
                  {app.isRunning && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </h3>
                <p className="text-[10px] font-mono text-on-surface-variant line-clamp-1">
                  {app.packageName}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  v{app.version} • {app.sizeMb} MB
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleAppRunState(app.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                app.isRunning
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {app.isRunning ? 'Stop' : 'Launch'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { EncryptionConfig, ThemeMode } from '../types';
import { DEFAULT_ENCRYPTION_CONFIG } from '../data/mockData';

interface SettingsViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, onToggleTheme }) => {
  const [encryption, setEncryption] = useState<EncryptionConfig>(DEFAULT_ENCRYPTION_CONFIG);
  const [macWhitelist, setMacWhitelist] = useState<string[]>([
    '8C:3B:AD:12:44:90',
    '00:1A:2B:3C:4D:5E',
    'AC:BC:32:88:11:F2',
  ]);
  const [newMacInput, setNewMacInput] = useState('');
  const [streamQuality, setStreamQuality] = useState<'high' | 'balanced' | 'low-bandwidth'>('high');

  const handleAddMac = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMacInput.trim() && !macWhitelist.includes(newMacInput.trim())) {
      setMacWhitelist((prev) => [...prev, newMacInput.trim()]);
      setNewMacInput('');
    }
  };

  const handleRemoveMac = (mac: string) => {
    setMacWhitelist((prev) => prev.filter((m) => m !== mac));
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl text-gray-900 dark:text-white">
      
      {/* Theme Quick Switcher */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-2xl">
            {theme === 'dark' ? 'dark_mode' : 'light_mode'}
          </span>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Appearance & Theme Switcher</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current active theme: <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{theme} Mode</span>
            </p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131b2e] dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          Switch to {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>

      {/* Encryption Settings */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500 text-2xl">verified_user</span>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">End-to-End Encryption (E2EE)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Zero-knowledge session encryption for all screen frames, unlock payloads, and files.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
            E2EE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 space-y-1">
            <span className="text-gray-500 block">Cipher Protocol:</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">AES-256-GCM Payload</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 space-y-1">
            <span className="text-gray-500 block">Key Exchange Protocol:</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">ECDH-P384 Elliptic Curve</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 text-xs font-mono flex justify-between items-center">
          <div>
            <span className="text-gray-500 block">Security Fingerprint:</span>
            <span className="text-gray-900 dark:text-white font-semibold">{encryption.fingerprint}</span>
          </div>
          <button
            onClick={() => alert('New E2EE Security Keys Generated!')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
          >
            Regenerate Keys
          </button>
        </div>
      </div>

      {/* MAC Address Whitelist */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
        <div className="pb-2 border-b border-gray-200 dark:border-white/10">
          <h3 className="font-bold text-base flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="material-symbols-outlined text-blue-600">shield</span>
            Trusted Remote MAC Address Whitelist
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Only whitelisted hardware MAC addresses are allowed to request remote screen unlock permissions.
          </p>
        </div>

        <form onSubmit={handleAddMac} className="flex gap-2">
          <input
            type="text"
            value={newMacInput}
            onChange={(e) => setNewMacInput(e.target.value)}
            placeholder="Add MAC Address (e.g. 00:1A:2B:3C:4D:5E)"
            className="flex-1 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Whitelist MAC
          </button>
        </form>

        <div className="space-y-2">
          {macWhitelist.map((mac) => (
            <div
              key={mac}
              className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 flex items-center justify-between font-mono text-xs text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                <span>{mac}</span>
              </div>
              <button
                onClick={() => handleRemoveMac(mac)}
                className="text-rose-500 hover:text-rose-600 p-1"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Performance & Quality Tuning */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
        <h3 className="font-bold text-base text-gray-900 dark:text-white">Remote Performance & Latency</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setStreamQuality('high')}
            className={`p-3 rounded-xl text-xs font-bold border transition-all ${
              streamQuality === 'high'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            1080p @ 60 FPS (Ultra)
          </button>
          <button
            onClick={() => setStreamQuality('balanced')}
            className={`p-3 rounded-xl text-xs font-bold border transition-all ${
              streamQuality === 'balanced'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            720p @ 60 FPS (Balanced)
          </button>
          <button
            onClick={() => setStreamQuality('low-bandwidth')}
            className={`p-3 rounded-xl text-xs font-bold border transition-all ${
              streamQuality === 'low-bandwidth'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            480p @ 30 FPS (Low Latency)
          </button>
        </div>
      </div>

    </div>
  );
};

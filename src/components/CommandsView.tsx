import React, { useState } from 'react';
import { CommandHistory, Device } from '../types';
import { MOCK_COMMAND_HISTORY } from '../data/mockData';

interface CommandsViewProps {
  selectedDevice: Device;
}

export const CommandsView: React.FC<CommandsViewProps> = ({ selectedDevice }) => {
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>(MOCK_COMMAND_HISTORY);
  const [inputCmd, setInputCmd] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunCommand = (cmdText: string) => {
    if (!cmdText.trim()) return;
    setIsExecuting(true);

    setTimeout(() => {
      setIsExecuting(false);

      let mockOutput = `[OK] Executed on ${selectedDevice.name} (${selectedDevice.ipAddress})\nResult: Command completed in 4ms with exit code 0.`;

      if (cmdText.includes('unlock') || cmdText.includes('screen')) {
        mockOutput = `[AUTH] Bypassing ${selectedDevice.name} screen lock...\n[SUCCESS] E2EE Unlock key delivered. Lock state set to UNLOCKED.`;
      } else if (cmdText.includes('ping')) {
        mockOutput = `PING ${selectedDevice.ipAddress} 56(84) bytes of data.\n64 bytes from ${selectedDevice.ipAddress}: icmp_seq=1 ttl=64 time=3.2 ms\n64 bytes from ${selectedDevice.ipAddress}: icmp_seq=2 ttl=64 time=3.8 ms\n--- ${selectedDevice.ipAddress} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss, time 1002ms`;
      } else if (cmdText.includes('mac') || cmdText.includes('e2ee')) {
        mockOutput = `[E2EE] Validated Fingerprint: 9B:4E:81:AA:5C:2D:7F:10\n[PEER] Target MAC: ${selectedDevice.macAddress}\n[STATUS] Cipher AES-256-GCM Handshake Confirmed.`;
      }

      const newHistoryItem: CommandHistory = {
        id: `cmd-${Date.now()}`,
        command: cmdText,
        output: mockOutput,
        timestamp: new Date().toLocaleTimeString(),
        status: 'success',
        deviceId: selectedDevice.id,
      };

      setCommandHistory((prev) => [newHistoryItem, ...prev]);
      setInputCmd('');
    }, 700);
  };

  const handleQuickPreset = (cmd: string) => {
    setInputCmd(cmd);
    handleRunCommand(cmd);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">terminal</span>
          </div>
          <div>
            <h2 className="font-bold text-base">Remote Shell & ADB Execution Engine</h2>
            <p className="text-xs text-on-surface-variant font-mono">
              Target: {selectedDevice.name} • MAC: {selectedDevice.macAddress}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCommandHistory([])}
          className="text-xs text-rose-400 hover:underline font-mono px-3 py-1.5 rounded-lg dark:bg-rose-500/10 bg-rose-50"
        >
          Clear Console
        </button>
      </div>

      {/* Quick Presets Grid */}
      <div className="glass-panel p-4 rounded-2xl space-y-2">
        <span className="text-[10px] font-mono uppercase text-on-surface-variant block font-bold">
          Quick Diagnostic Presets
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickPreset(`adb shell getprop ro.product.model`)}
            className="px-3 py-1.5 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-primary/20 text-xs font-mono text-on-surface border border-outline-variant/30"
          >
            adb getprop
          </button>
          <button
            onClick={() => handleQuickPreset(`screen_unlock --type pattern --target ${selectedDevice.id}`)}
            className="px-3 py-1.5 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-amber-500/20 text-xs font-mono text-amber-400 border border-outline-variant/30"
          >
            screen_unlock --pattern
          </button>
          <button
            onClick={() => handleQuickPreset(`mac_lookup ${selectedDevice.macAddress} --e2ee-verify`)}
            className="px-3 py-1.5 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-emerald-500/20 text-xs font-mono text-emerald-400 border border-outline-variant/30"
          >
            e2ee_verify MAC
          </button>
          <button
            onClick={() => handleQuickPreset(`wol_wakeup --mac ${selectedDevice.macAddress}`)}
            className="px-3 py-1.5 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-sky-500/20 text-xs font-mono text-sky-400 border border-outline-variant/30"
          >
            wol_wakeup Magic Packet
          </button>
          <button
            onClick={() => handleQuickPreset(`ping ${selectedDevice.ipAddress} -c 4`)}
            className="px-3 py-1.5 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-purple-500/20 text-xs font-mono text-purple-400 border border-outline-variant/30"
          >
            ping IP
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="bg-gray-50 text-gray-900 dark:bg-[#060e20] dark:text-slate-200 rounded-2xl p-5 border border-gray-200 dark:border-outline-variant/40 font-mono text-xs space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto custom-scrollbar shadow-xs">
        <div className="text-emerald-600 dark:text-emerald-400 pb-2 border-b border-gray-200 dark:border-white/10 flex justify-between">
          <span>MindSparQ Shell v2.4.1 [E2EE Session Active]</span>
          <span>{selectedDevice.ipAddress}</span>
        </div>

        {commandHistory.map((cmd) => (
          <div key={cmd.id} className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-emerald-600 dark:text-emerald-400">$</span>
              <span className="font-bold">{cmd.command}</span>
              <span className="text-[9px] text-gray-400 dark:text-slate-500 ml-auto">{cmd.timestamp}</span>
            </div>
            <pre className="text-gray-800 dark:text-slate-300 bg-white dark:bg-black/40 p-3 rounded-xl whitespace-pre-wrap leading-relaxed border border-gray-200 dark:border-white/5">
              {cmd.output}
            </pre>
          </div>
        ))}

        {isExecuting && (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse">
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            Executing remote command payload...
          </div>
        )}
      </div>

      {/* Command Line Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand(inputCmd);
        }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-emerald-400 font-bold">
            $
          </span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Type ADB or shell command (e.g. screen_unlock, adb shell, wol_wakeup)..."
            className="w-full dark:bg-[#131b2e] bg-slate-100 border border-outline-variant/40 rounded-xl py-3 pl-8 pr-4 text-xs font-mono focus:border-primary outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!inputCmd.trim() || isExecuting}
          className="btn-primary-gradient text-white text-xs font-bold px-6 py-3 rounded-xl disabled:opacity-50 shadow-md shrink-0 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">play_arrow</span>
          Run Command
        </button>
      </form>

    </div>
  );
};

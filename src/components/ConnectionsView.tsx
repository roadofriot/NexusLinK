import React, { useState } from 'react';
import { Device, ViewTab } from '../types';

interface ConnectionsViewProps {
  devices: Device[];
  onConnectPartnerId: (partnerIdOrMac: string) => void;
  onSelectTab: (tab: ViewTab) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  devices,
  onConnectPartnerId,
  onSelectTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'anydesk' | 'qr' | 'adb' | 'lan'>('anydesk');
  const [partnerInput, setPartnerInput] = useState('');
  const [ipInput, setIpInput] = useState('192.168.1.180');
  const [portInput, setPortInput] = useState('5555');
  const [pairCodeInput, setPairCodeInput] = useState('');
  
  const [isScanningLAN, setIsScanningLAN] = useState(false);
  const [discoveredLanNodes, setDiscoveredLanNodes] = useState<
    { name: string; ip: string; mac: string; type: string }[]
  >([
    { name: 'Dell XPS 15 Workstation', ip: '192.168.1.142', mac: '74:D0:2B:10:88:FF', type: 'windows' },
    { name: 'Mac mini M2', ip: '192.168.1.190', mac: 'C8:E0:EB:44:11:32', type: 'macos' },
  ]);

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerInput.trim()) {
      onConnectPartnerId(partnerInput.trim());
      setPartnerInput('');
    }
  };

  const handleScanLAN = () => {
    setIsScanningLAN(true);
    setTimeout(() => {
      setIsScanningLAN(false);
      setDiscoveredLanNodes((prev) => [
        ...prev,
        { name: 'Ubuntu Linux Server', ip: '192.168.1.200', mac: '00:15:5D:01:22:90', type: 'linux' },
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 text-gray-900 dark:text-white">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#171f33] p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-200 dark:border-white/10 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            AnyDesk / TeamViewer Engine Active
          </span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Remote Peer-to-Peer Connection Hub</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">
            Establish zero-trust E2EE connections with remote laptops, desktops, and mobiles using Partner IDs, MAC Addresses, or Wireless ADB.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 text-center font-mono">
            <span className="text-[10px] text-gray-400 block uppercase">Your Remote ID</span>
            <span className="font-extrabold text-base text-blue-600 dark:text-blue-400 tracking-widest">MSQ-7X9-B42</span>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-2 flex gap-2 overflow-x-auto scroll-hidden shadow-xs">
        <button
          onClick={() => setActiveSubTab('anydesk')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === 'anydesk'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">hub</span>
          Partner ID / MAC Address
        </button>
        <button
          onClick={() => setActiveSubTab('qr')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === 'qr'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          QR Scan Pairing
        </button>
        <button
          onClick={() => setActiveSubTab('adb')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === 'adb'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">terminal</span>
          Wireless ADB
        </button>
        <button
          onClick={() => setActiveSubTab('lan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === 'lan'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-gray-50 dark:bg-[#131b2e] text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">radar</span>
          LAN Auto-Discovery
        </button>
      </div>

      {/* Content Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Form Box (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ANYDESK / MAC TAB */}
          {activeSubTab === 'anydesk' && (
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-5 shadow-xs">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                  <span className="material-symbols-outlined text-blue-600">router</span>
                  Connect to Remote Desk
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the remote computer's MAC address or 9-digit MindSparQ / AnyDesk ID to request remote session access.
                </p>
              </div>

              <form onSubmit={handleConnectSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Remote Partner ID or MAC Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      badge
                    </span>
                    <input
                      type="text"
                      value={partnerInput}
                      onChange={(e) => setPartnerInput(e.target.value)}
                      placeholder="e.g. 00:1A:2B:3C:4D:5E or MSQ-882-104"
                      className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Encryption Level:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">AES-256-GCM + ECDH P-384</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunneling Protocol:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">WebRTC Direct Peer-to-Peer</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!partnerInput.trim()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-base">cable</span>
                  Establish Remote E2EE Session
                </button>
              </form>
            </div>
          )}

          {/* QR CODE SCAN TAB */}
          {activeSubTab === 'qr' && (
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl text-center space-y-5 shadow-xs">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Pair via QR Code</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Scan the QR code below using the MindSparQ Mobile App on Android or iOS.
                </p>
              </div>

              <div className="w-48 h-48 bg-white rounded-2xl p-2 mx-auto relative overflow-hidden shadow-md border-4 border-blue-500/30">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTJvhMqKzxA4_hxMwl2c1Hi_MWS-trfKyWHtSA1rLHTHlICu1GG6c7QEDCVwO2hCSAW3FsdchjoVZALPw7YPOtvMfpJBXTyXck3ZWg-3oAjcTZNwiTlPGS3F8_2tbCqs9S2k-0w1eh3-GFGPeZ0fHNbh5V-KAvrLG7D8TFwjbtcGPtszCfztaHB3VV3bMAsjc9pzwSLwof_Nijm9JUmbJXp2zQsjN2s7PdiX6cTfYkSj9wyuBGaTxa"
                  alt="MindSparQ QR Scanner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 animate-scan shadow-[0_0_12px_rgba(37,99,235,1)]" />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] font-mono text-xs text-center border border-gray-200 dark:border-white/10">
                Pair Code: <strong className="text-blue-600 dark:text-blue-400 font-extrabold tracking-widest text-sm">7X9-B42</strong>
              </div>
            </div>
          )}

          {/* WIRELESS ADB TAB */}
          {activeSubTab === 'adb' && (
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                  <span className="material-symbols-outlined text-blue-600">terminal</span>
                  Wireless ADB Remote Pairing
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Connect to Android Developer Wireless Debugging over TCP/IP without USB cables.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-gray-500 block mb-1">Target IP Address</label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-500 block mb-1">ADB Port</label>
                  <input
                    type="text"
                    value={portInput}
                    onChange={(e) => setPortInput(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-500 block mb-1">Pairing Code (6-digit)</label>
                <input
                  type="text"
                  value={pairCodeInput}
                  onChange={(e) => setPairCodeInput(e.target.value)}
                  placeholder="e.g. 481902"
                  className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={() => onConnectPartnerId(`${ipInput}:${portInput}`)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Pair Wireless ADB Device
              </button>
            </div>
          )}

          {/* LAN AUTO DISCOVERY TAB */}
          {activeSubTab === 'lan' && (
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2 text-gray-900 dark:text-white">
                    <span className="material-symbols-outlined text-emerald-500">sensors</span>
                    Local Subnet Scanner (192.168.1.0/24)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Discover active MindSparQ agents listening on the local network.
                  </p>
                </div>
                <button
                  onClick={handleScanLAN}
                  disabled={isScanningLAN}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span className={`material-symbols-outlined text-sm ${isScanningLAN ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {isScanningLAN ? 'Scanning...' : 'Rescan Subnet'}
                </button>
              </div>

              <div className="space-y-2">
                {discoveredLanNodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 flex items-center justify-between hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 material-symbols-outlined text-lg">
                        {node.type === 'windows' ? 'desktop_windows' : node.type === 'macos' ? 'laptop_mac' : 'dns'}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{node.name}</h4>
                        <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                          IP: {node.ip} • MAC: {node.mac}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onConnectPartnerId(node.mac)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Saved Connections History (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Saved Remote Devices</h3>
              <span className="text-[10px] font-mono text-gray-500">{devices.length} Nodes Saved</span>
            </div>

            <div className="space-y-3">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 flex items-center justify-between hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm">
                        {d.platform === 'android' ? 'android' : d.platform === 'ios' ? 'phone_iphone' : 'desktop_windows'}
                      </span>
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{d.name}</h4>
                      <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                        {d.partnerId} • {d.macAddress}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onConnectPartnerId(d.partnerId)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                    title="1-Click Reconnect"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

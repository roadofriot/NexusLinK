import React from 'react';

interface ProUpgradeModalProps {
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-panel rounded-2xl overflow-hidden border border-white/10 dark:bg-[#171f33] bg-white p-6 space-y-5">
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-2xl">star</span>
            <h3 className="font-extrabold text-lg">MindSparQ Pro</h3>
          </div>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent border border-primary/30 space-y-2">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Unlimited Multi-Desk Remote Access</p>
          <ul className="text-xs space-y-2 text-on-surface">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              High-FPS 120 FPS Remote Desktop Streaming
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              Automatic Unattended Screen Lock Bypass
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              Unlimited File Transfer Speed (up to 1 Gbps)
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              Multi-Monitor Dual Screen Support
            </li>
          </ul>
        </div>

        <button
          onClick={() => {
            alert('MindSparQ Pro Plan Activated!');
            onClose();
          }}
          className="w-full py-3 rounded-xl btn-primary-gradient text-white font-extrabold text-sm shadow-lg"
        >
          Activate Pro Plan - $9.99/mo
        </button>

      </div>
    </div>
  );
};

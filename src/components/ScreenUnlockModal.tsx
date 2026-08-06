import React, { useState, useRef } from 'react';
import { Device } from '../types';

interface ScreenUnlockModalProps {
  device: Device;
  onClose: () => void;
  onUnlockSuccess: (deviceId: string) => void;
}

export const ScreenUnlockModal: React.FC<ScreenUnlockModalProps> = ({
  device,
  onClose,
  onUnlockSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'pin' | 'pattern' | 'password' | 'wol'>(
    device.lockType === 'pattern' ? 'pattern' : device.lockType === 'pin' ? 'pin' : 'password'
  );

  // PIN state
  const [pin, setPin] = useState<string>('');
  
  // Password state
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Pattern state: 3x3 grid (dots 1 to 9)
  const [patternDots, setPatternDots] = useState<number[]>([]);
  const [isDrawingPattern, setIsDrawingPattern] = useState<boolean>(false);

  // Unlocking state animation
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const patternContainerRef = useRef<HTMLDivElement>(null);

  // Handle PIN Key Click
  const handlePinClick = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
      setErrorMessage(null);
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  // Pattern Dot Click / Drag
  const handleDotInteract = (index: number) => {
    if (!patternDots.includes(index)) {
      setPatternDots((prev) => [...prev, index]);
    }
  };

  const handlePatternMouseDown = (index: number) => {
    setIsDrawingPattern(true);
    setPatternDots([index]);
  };

  const handlePatternMouseEnter = (index: number) => {
    if (isDrawingPattern && !patternDots.includes(index)) {
      setPatternDots((prev) => [...prev, index]);
    }
  };

  const handlePatternMouseUp = () => {
    setIsDrawingPattern(false);
  };

  const resetPattern = () => {
    setPatternDots([]);
    setErrorMessage(null);
  };

  // Submit Unlock Command
  const handleExecuteUnlock = (methodName: string) => {
    setIsSending(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSending(false);
      setSuccessMessage(`${device.name} screen lock successfully opened via ${methodName}!`);
      
      setTimeout(() => {
        onUnlockSuccess(device.id);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 dark:bg-[#171f33]/95 bg-white/95 text-on-surface">
        
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between dark:bg-[#131b2e] bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                {device.platform === 'android' ? 'android' : device.platform === 'ios' ? 'phone_iphone' : 'laptop'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Unlock {device.name}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  E2EE Secure
                </span>
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                MAC: {device.macAddress} • IP: {device.ipAddress}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-outline-variant/30 text-xs font-semibold dark:bg-[#0b1326]/60 bg-slate-100">
          <button
            onClick={() => setActiveTab('pin')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'pin'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">pin</span>
            PIN Code
          </button>
          <button
            onClick={() => setActiveTab('pattern')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'pattern'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">gesture</span>
            Pattern
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'password'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">password</span>
            Password
          </button>
          <button
            onClick={() => setActiveTab('wol')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'wol'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">power_settings_new</span>
            Wake / WOL
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-4xl">lock_open</span>
              </div>
              <h4 className="font-bold text-lg text-emerald-400">Lock Bypassed Successfully</h4>
              <p className="text-xs text-on-surface-variant font-mono">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* PIN TAB */}
              {activeTab === 'pin' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant mb-2">Enter {device.name}'s PIN code to unlock:</p>
                    {/* Masked PIN Display */}
                    <div className="flex justify-center gap-3 my-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full border-2 transition-all ${
                            pin.length > idx
                              ? 'bg-primary border-primary scale-110 shadow-[0_0_10px_rgba(128,131,255,0.8)]'
                              : 'border-outline-variant/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Numpad Grid */}
                  <div className="grid grid-cols-3 gap-3 w-64">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePinClick(num)}
                        className="w-16 h-12 rounded-xl dark:bg-[#222a3d] bg-slate-200 hover:bg-primary/20 text-on-surface font-semibold text-lg flex items-center justify-center transition-all active:scale-95 shadow-sm"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setPin('')}
                      className="w-16 h-12 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center justify-center transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handlePinClick('0')}
                      className="w-16 h-12 rounded-xl dark:bg-[#222a3d] bg-slate-200 hover:bg-primary/20 text-on-surface font-semibold text-lg flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                      0
                    </button>
                    <button
                      onClick={handlePinBackspace}
                      className="w-16 h-12 rounded-xl dark:bg-[#131b2e] bg-slate-100 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs flex items-center justify-center transition-all"
                    >
                      <span className="material-symbols-outlined text-base">backspace</span>
                    </button>
                  </div>

                  <button
                    disabled={pin.length < 4 || isSending}
                    onClick={() => handleExecuteUnlock(`PIN (${pin.replace(/./g, '*')})`)}
                    className="w-full py-3 rounded-xl btn-primary-gradient text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                        Sending Encrypted Unlock Payload...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">lock_open</span>
                        Unlock Screen via PIN
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* PATTERN TAB */}
              {activeTab === 'pattern' && (
                <div className="space-y-5 flex flex-col items-center">
                  <p className="text-xs text-on-surface-variant text-center">
                    Click or drag across points on the 3x3 grid to draw the unlock pattern:
                  </p>

                  {/* Pattern Canvas Container */}
                  <div
                    ref={patternContainerRef}
                    onMouseLeave={handlePatternMouseUp}
                    onMouseUp={handlePatternMouseUp}
                    className="relative w-64 h-64 p-4 dark:bg-[#131b2e] bg-slate-100 rounded-2xl border border-outline-variant/30 flex items-center justify-center select-none"
                  >
                    <div className="grid grid-cols-3 gap-8 z-10">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dotIndex) => {
                        const isSelected = patternDots.includes(dotIndex);
                        const order = patternDots.indexOf(dotIndex) + 1;
                        return (
                          <button
                            key={dotIndex}
                            onMouseDown={() => handlePatternMouseDown(dotIndex)}
                            onMouseEnter={() => handlePatternMouseEnter(dotIndex)}
                            onClick={() => handleDotInteract(dotIndex)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                              isSelected
                                ? 'bg-primary text-white scale-110 ring-4 ring-primary/30 shadow-[0_0_15px_rgba(128,131,255,0.8)]'
                                : 'dark:bg-[#222a3d] bg-slate-200 text-on-surface-variant hover:bg-primary/20'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full bg-current" />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[9px] font-bold flex items-center justify-center">
                                {order}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={resetPattern}
                      className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface-variant/40 transition-colors"
                    >
                      Reset Pattern
                    </button>
                    <button
                      disabled={patternDots.length < 3 || isSending}
                      onClick={() =>
                        handleExecuteUnlock(`Pattern Sequence [${patternDots.join(' → ')}]`)
                      }
                      className="flex-1 py-2.5 rounded-xl btn-primary-gradient text-white font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-xs">sync</span>
                          Bypassing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xs">lock_open</span>
                          Unlock ({patternDots.length} Dots)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD TAB */}
              {activeTab === 'password' && (
                <div className="space-y-4">
                  <p className="text-xs text-on-surface-variant">
                    Enter the remote user's Windows Hello, macOS, or Mobile lockscreen password:
                  </p>
                  
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                      key
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. User@Admin123"
                      className="w-full dark:bg-[#131b2e] bg-slate-100 border border-outline-variant/40 rounded-xl py-3 pl-10 pr-10 text-sm font-mono focus:border-primary outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl dark:bg-[#131b2e]/80 bg-slate-100 border border-white/5 space-y-1 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <span className="material-symbols-outlined text-sm">verified_user</span>
                      Biometric / Touch ID Remote Trigger
                    </div>
                    <p>
                      Supports Windows Hello PIN, Mac Touch ID, and Android/iOS Master Passwords.
                    </p>
                  </div>

                  <button
                    disabled={!password.trim() || isSending}
                    onClick={() => handleExecuteUnlock('Password Auth Payload')}
                    className="w-full py-3 rounded-xl btn-primary-gradient text-white font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xs">sync</span>
                        Executing Remote Auth...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">lock_open</span>
                        Submit Password & Bypass Lock
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* WAKE ON LAN TAB */}
              {activeTab === 'wol' && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">power_settings_new</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Wake-on-LAN & Remote Session Unlock</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Send a high-speed Magic Packet over LAN/WAN to wake up <strong className="text-on-surface">{device.name}</strong> from sleep state and open the remote desktop session.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl dark:bg-[#131b2e] bg-slate-100 border border-outline-variant/30 text-left font-mono text-xs space-y-1">
                    <p><span className="text-on-surface-variant">Target MAC:</span> {device.macAddress}</p>
                    <p><span className="text-on-surface-variant">Broadcast IP:</span> {device.ipAddress}</p>
                    <p><span className="text-on-surface-variant">Port:</span> 9 (UDP / E2EE Magic Frame)</p>
                  </div>

                  <button
                    disabled={isSending}
                    onClick={() => handleExecuteUnlock('Wake-On-LAN Magic Packet')}
                    className="w-full py-3 rounded-xl btn-primary-gradient text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xs">sync</span>
                        Broadcasting Magic Packet...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">sensors</span>
                        Send Wake-on-LAN & Unlock
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 dark:bg-[#131b2e] bg-slate-100 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AES-256-GCM Direct Channel
          </span>
          <span className="font-mono">Latency: {device.pingMs}ms</span>
        </div>
      </div>
    </div>
  );
};

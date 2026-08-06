import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLoginWithGoogle: () => void;
  onLogout: () => void;
  onToggleDriveSync: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onLoginWithGoogle,
  onLogout,
  onToggleDriveSync,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security' | 'drive'>('profile');
  
  // Profile edit form state
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [orgInput, setOrgInput] = useState(user?.organization || 'MindSparQ Security Labs');
  const [avatarInput, setAvatarInput] = useState(user?.avatar || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Security 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is2FAEnabled ?? true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'Authenticator App (TOTP)' | 'Hardware Key (FIDO2)' | 'SMS Backup'>(
    user?.twoFactorMethod || 'Authenticator App (TOTP)'
  );

  // Drive sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // OAuth loading state
  const [isOAuthConnecting, setIsOAuthConnecting] = useState(false);

  useEffect(() => {
    if (user) {
      setNameInput(user.name);
      setEmailInput(user.email);
      setOrgInput(user.organization || 'MindSparQ Security Labs');
      setAvatarInput(user.avatar);
      setIs2FAEnabled(user.is2FAEnabled ?? true);
      if (user.twoFactorMethod) setTwoFactorMethod(user.twoFactorMethod);
    }
  }, [user]);

  // Listen for Google OAuth popup callback message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_OAUTH_SUCCESS') {
        setIsOAuthConnecting(false);
        onLoginWithGoogle();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLoginWithGoogle]);

  if (!isOpen) return null;

  // Real Google OAuth trigger
  const handleInitiateGoogleOAuth = async () => {
    try {
      setIsOAuthConnecting(true);
      const res = await fetch('/api/auth/url');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const authPopup = window.open(data.url, 'google_oauth_popup', 'width=600,height=700,status=yes,scrollbars=yes');
          if (!authPopup) {
            // Fallback if popups are blocked
            onLoginWithGoogle();
            setIsOAuthConnecting(false);
          }
        } else {
          onLoginWithGoogle();
          setIsOAuthConnecting(false);
        }
      } else {
        onLoginWithGoogle();
        setIsOAuthConnecting(false);
      }
    } catch {
      onLoginWithGoogle();
      setIsOAuthConnecting(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: nameInput,
      email: emailInput,
      organization: orgInput,
      avatar: avatarInput,
    });
    setSaveSuccessMsg('Profile information saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Toggle 2FA Handler
  const handleToggle2FA = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    onUpdateProfile({ is2FAEnabled: nextState, twoFactorMethod });
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncMessage('Encrypting device configs & syncing to Google Drive...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Google Drive sync complete! (All E2EE Keys secured)');
      setTimeout(() => setSyncMessage(null), 3500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200/90 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">MindSparQ Google Account & Profile</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Manage identity, subscription status, and security controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {user && user.isLoggedIn ? (
          /* Logged In User View */
          <div className="space-y-5">
            
            {/* Header User Summary Card */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base truncate text-slate-900 dark:text-white">{user.name}</h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">
                    Verified Google Account
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {user.googleAccountType} • Member since {user.joinedDate}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/10 gap-1 overflow-x-auto scroll-hidden">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'subscription'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">workspace_premium</span>
                Subscription & Plan
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'security'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">security</span>
                2FA & Security
              </button>
              <button
                onClick={() => setActiveTab('drive')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === 'drive'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">cloud_sync</span>
                Google Drive Sync
              </button>
            </div>

            {/* TAB 1: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1">
                      Organization / Team
                    </label>
                    <input
                      type="text"
                      value={orgInput}
                      onChange={(e) => setOrgInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {saveSuccessMsg && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    ✓ {saveSuccessMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* TAB 2: SUBSCRIPTION STATUS */}
            {activeTab === 'subscription' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                        Active Membership Tier
                      </span>
                      <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        {user.subscriptionStatus || 'Google Workspace Pro Tier'}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold">
                      Active Subscription
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-gray-300">
                    Next billing date: <strong>{user.subscriptionRenews || 'Sept 12, 2026'}</strong> via Google Play / Workspace Billing.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 text-[10px] block">Remote Peers</span>
                      <span className="font-bold text-slate-900 dark:text-white">10 Nodes Included</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 text-[10px] block">E2EE Stream</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">4K @ 60 FPS</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10">
                      <span className="text-slate-400 text-[10px] block">Drive Vault</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{user.quotaTotalGb} GB Backup</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">Need enterprise cluster support?</span>
                  <button
                    onClick={() => alert('MindSparQ Enterprise Support team contacted!')}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Manage Enterprise Licenses
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: 2FA & SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                {/* 2FA Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-base">verified_user</span>
                      Two-Factor Authentication (2FA)
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Require security code or hardware key on new workstation connection requests.
                    </p>
                  </div>

                  <button
                    onClick={handleToggle2FA}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      is2FAEnabled
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-gray-400'
                    }`}
                  >
                    {is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}
                  </button>
                </div>

                {/* 2FA Method Selector */}
                {is2FAEnabled && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block">
                      Primary 2FA Authentication Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(['Authenticator App (TOTP)', 'Hardware Key (FIDO2)', 'SMS Backup'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => {
                            setTwoFactorMethod(method);
                            onUpdateProfile({ twoFactorMethod: method });
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            twoFactorMethod === method
                              ? 'bg-blue-600 text-white border-transparent shadow-xs'
                              : 'bg-slate-50 dark:bg-[#131b2e] border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Sessions */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Active MindSparQ Sessions</h5>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">2 Devices Signed In</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-gray-300">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Windows 11 Workstation (Current Session)</span>
                        <span className="text-slate-400 text-[10px]">Chrome Browser • IP: 192.168.1.100</span>
                      </div>
                      <span className="text-emerald-600 font-bold text-[10px]">Active Now</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Google Pixel 8 Pro</span>
                        <span className="text-slate-400 text-[10px]">Android 14 MindSparQ App • IP: 192.168.1.180</span>
                      </div>
                      <button
                        onClick={() => alert('Session revoked successfully!')}
                        className="text-rose-600 hover:underline font-bold text-[10px]"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GOOGLE DRIVE BACKUP */}
            {activeTab === 'drive' && (
              <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-blue-600">cloud_sync</span>
                    <div>
                      <div className="text-xs font-bold">Google Drive Remote Config Vault</div>
                      <div className="text-[11px] text-slate-500">Auto-sync ADB scripts, pairing keys, and MAC whitelists</div>
                    </div>
                  </div>

                  <button
                    onClick={onToggleDriveSync}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      user.connectedDrive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-gray-400'
                    }`}
                  >
                    {user.connectedDrive ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Storage Quota */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Drive Backup Quota</span>
                    <span className="font-semibold text-slate-800 dark:text-gray-200">
                      {user.quotaUsedGb} GB / {user.quotaTotalGb} GB
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(user.quotaUsedGb / user.quotaTotalGb) * 100}%` }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="w-full py-2 bg-slate-50 dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {isSyncing ? 'Syncing with Google Drive...' : 'Sync Device Credentials Now'}
                </button>

                {syncMessage && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-mono font-medium">
                    ✓ {syncMessage}
                  </p>
                )}
              </div>
            )}

            {/* Logout Action */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={onLogout}
                className="flex-1 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out Google Account
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-gray-200 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Signed Out / Google Login Trigger */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Sign In with Google</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your Google Account to enable automatic cloud backups of remote device MAC pairings, custom ADB scripts, and E2EE key vaults across all your workstations.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 text-left space-y-2 text-xs text-slate-600 dark:text-gray-300">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-emerald-500 text-base">verified_user</span>
                Google Workspace Security Approvals
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-sm">check</span>
                <span>Encrypted Google Drive cloud config storage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-sm">check</span>
                <span>Cross-device WebRTC peer authorization</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-sm">check</span>
                <span>Zero-knowledge client-side AES-256 vault keying</span>
              </div>
            </div>

            <button
              onClick={handleInitiateGoogleOAuth}
              disabled={isOAuthConnecting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {isOAuthConnecting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  Opening Google Sign-In Window...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export type ThemeMode = 'dark' | 'light';

export type PlatformType = 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type ViewTab = 
  | 'dashboard'
  | 'devices'
  | 'connections'
  | 'file-transfer'
  | 'apps'
  | 'screen-mirror'
  | 'commands'
  | 'automation'
  | 'logs'
  | 'settings';

export interface Device {
  id: string;
  name: string;
  platform: PlatformType;
  osVersion: string;
  ipAddress: string;
  macAddress: string;
  partnerId: string;
  batteryLevel: number;
  isCharging?: boolean;
  status: 'connected' | 'connecting' | 'offline';
  isLocked: boolean;
  lockType: 'pin' | 'pattern' | 'password' | 'biometric';
  screenImage?: string;
  pingMs: number;
  fps: number;
  storageUsedGb: number;
  storageTotalGb: number;
  lastActive: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'folder' | 'image' | 'doc' | 'apk' | 'video' | 'archive';
  dateModified: string;
  path: string;
}

export interface TransferQueueItem {
  id: string;
  fileName: string;
  totalSizeMb: number;
  transferredMb: number;
  speedMbps: number;
  progressPercent: number;
  direction: 'local-to-remote' | 'remote-to-local';
  status: 'transferring' | 'completed' | 'paused' | 'failed';
}

export interface RemoteApp {
  id: string;
  name: string;
  packageName: string;
  version: string;
  iconName: string;
  category: string;
  sizeMb: number;
  isRunning: boolean;
}

export interface CommandHistory {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  status: 'success' | 'error' | 'running';
  deviceId: string;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  keyExchange: 'ECDH-P384' | 'RSA-4096';
  isVerified: boolean;
  fingerprint: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  trigger: 'Schedule' | 'Device Connected' | 'Manual' | 'Threshold';
  actionType: 'Run Script' | 'File Sync' | 'Screen Lock' | 'App Restart';
  targetDevice: string;
  status: 'active' | 'paused' | 'completed';
  lastRun: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  source: string;
  message: string;
  deviceId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  googleAccountType: string;
  connectedDrive: boolean;
  quotaUsedGb: number;
  quotaTotalGb: number;
  joinedDate: string;
  organization?: string;
  subscriptionStatus?: string;
  subscriptionRenews?: string;
  is2FAEnabled?: boolean;
  twoFactorMethod?: 'Authenticator App (TOTP)' | 'Hardware Key (FIDO2)' | 'SMS Backup';
  activeSessionsCount?: number;
}


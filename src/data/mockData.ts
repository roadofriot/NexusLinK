import { Device, FileItem, RemoteApp, CommandHistory, EncryptionConfig } from '../types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-1',
    name: 'Samsung Galaxy S23',
    platform: 'android',
    osVersion: 'Android 14',
    ipAddress: '192.168.1.101',
    macAddress: '8C:3B:AD:12:44:90',
    partnerId: 'MSQ-948-210',
    batteryLevel: 78,
    isCharging: true,
    status: 'connected',
    isLocked: true,
    lockType: 'pattern',
    screenImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxFMuh8pWQ0A1yE92qtxhHEhBTsRCTmtpXluRZeG0bbwijnoZ6-muXdlc0qDSu4mVUEUUyxqTL56hPiyt87i89vgdjfTob5j293gcQi_YoxyOSO3I4ODaAs8eb6jGvmW9Aa8inM7GpXjhQAO5WV73IY7vHG9m5vIgG1LP5IiZi1PKUIoy83N73hFNSltFfRJMd6AWdF5IB18pqTpdNpW68mzreP8tK-dpRtNc7JE0oz6ovOiVHihbQ',
    pingMs: 5,
    fps: 60,
    storageUsedGb: 82.5,
    storageTotalGb: 128,
    lastActive: 'Just now',
  },
  {
    id: 'dev-2',
    name: 'Pixel 7 Pro',
    platform: 'android',
    osVersion: 'Android 14',
    ipAddress: '192.168.1.105',
    macAddress: 'F4:0F:24:9A:88:B1',
    partnerId: 'MSQ-7X9-B42',
    batteryLevel: 82,
    isCharging: true,
    status: 'connected',
    isLocked: false,
    lockType: 'pin',
    screenImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MDCHK-5P-C3YTGMtd_DipX6AqClCDoDPFuTAbiLgojZrqk_Sw0jf7DvTwgC7g0E8TbBYC9xaFwydJPCvmSM9lwh2NxOTaxRtfVfdRV-VS4FYfDxnqMcskFbCyIp2XxraWuo2UCDRN8yZ6ovszwOpMsWnOGhFG8ENy2A3NgwsD2NbYU3p_jB2eJTjRPE2WMBYXpWRuegiJMsA7UmjryU41MIqUvC7SvA_IkTL136mmO6JGniMy1nx',
    pingMs: 4,
    fps: 60,
    storageUsedGb: 64.0,
    storageTotalGb: 256,
    lastActive: 'Active now',
  },
  {
    id: 'dev-3',
    name: 'iPhone 15 Pro',
    platform: 'ios',
    osVersion: 'iOS 17.4.1',
    ipAddress: '192.168.1.112',
    macAddress: 'DC:A9:04:77:3E:12',
    partnerId: 'MSQ-310-99A',
    batteryLevel: 45,
    isCharging: false,
    status: 'connected',
    isLocked: true,
    lockType: 'pin',
    screenImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlWik8aGvIvIuRWE_7y4vTO_YTDR90Ck1LuSPR7y2WHieTWXlV58qqsOWJSIigje-opq96-8ggzIHcjbW5i5m9eiqsB2JJsUc0vcR5N-bIRhrCuu0uQ1hFcFZPAQMd6Vy7riyZ_7gFH7pCUOcoQYxfCCIvftFyTO72JYFbuIX2s4MJHDlQjBg91cqXDveEMIH8UlJI8-gzTQuCff3jkeM-UnS19grLkkvhREOK2z_1Z3azOKtaQuNh',
    pingMs: 7,
    fps: 60,
    storageUsedGb: 110.2,
    storageTotalGb: 512,
    lastActive: '1 min ago',
  },
  {
    id: 'dev-4',
    name: 'Windows 11 Pro Desktop',
    platform: 'windows',
    osVersion: 'Windows 11 23H2',
    ipAddress: '192.168.1.150',
    macAddress: '00:1A:2B:3C:4D:5E',
    partnerId: 'MSQ-882-104',
    batteryLevel: 100,
    isCharging: true,
    status: 'connected',
    isLocked: true,
    lockType: 'password',
    pingMs: 3,
    fps: 120,
    storageUsedGb: 450.0,
    storageTotalGb: 1024,
    lastActive: 'Connected (AnyDesk Engine)',
  },
  {
    id: 'dev-5',
    name: 'MacBook Pro M3 Max',
    platform: 'macos',
    osVersion: 'macOS Sequoia 15.1',
    ipAddress: '192.168.1.188',
    macAddress: 'AC:BC:32:88:11:F2',
    partnerId: 'MSQ-404-911',
    batteryLevel: 94,
    isCharging: true,
    status: 'connected',
    isLocked: false,
    lockType: 'password',
    pingMs: 4,
    fps: 90,
    storageUsedGb: 620.0,
    storageTotalGb: 2048,
    lastActive: 'Active Remote Session',
  }
];

export const INITIAL_LOCAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'MindSparQ_Assets',
    size: '--',
    type: 'folder',
    dateModified: 'Today, 10:45 AM',
    path: 'C:\\Users\\Admin\\Downloads\\MindSparQ_Assets'
  },
  {
    id: 'f-2',
    name: 'hero_banner_v2.png',
    size: '2.4 MB',
    type: 'image',
    dateModified: 'Yesterday, 4:20 PM',
    path: 'C:\\Users\\Admin\\Downloads\\hero_banner_v2.png'
  },
  {
    id: 'f-3',
    name: 'MindSparQ_Agent_v1.0.apk',
    size: '15.8 MB',
    type: 'apk',
    dateModified: 'May 14, 2024',
    path: 'C:\\Users\\Admin\\Downloads\\MindSparQ_Agent_v1.0.apk'
  },
  {
    id: 'f-4',
    name: 'device_logs_0515.txt',
    size: '124 KB',
    type: 'doc',
    dateModified: 'May 15, 2024',
    path: 'C:\\Users\\Admin\\Downloads\\device_logs_0515.txt'
  },
  {
    id: 'f-5',
    name: 'Remote_Desktop_Setup.exe',
    size: '42.1 MB',
    type: 'doc',
    dateModified: 'May 16, 2024',
    path: 'C:\\Users\\Admin\\Downloads\\Remote_Desktop_Setup.exe'
  }
];

export const INITIAL_REMOTE_FILES: FileItem[] = [
  {
    id: 'rf-1',
    name: 'Telegram',
    size: '--',
    type: 'folder',
    dateModified: 'May 10, 2024',
    path: '/sdcard/Download/Telegram'
  },
  {
    id: 'rf-2',
    name: 'Documents',
    size: '--',
    type: 'folder',
    dateModified: 'Apr 22, 2024',
    path: '/sdcard/Download/Documents'
  },
  {
    id: 'rf-3',
    name: 'Screenshot_20240515.png',
    size: '1.2 MB',
    type: 'image',
    dateModified: 'Today, 09:30 AM',
    path: '/sdcard/Download/Screenshot_20240515.png'
  },
  {
    id: 'rf-4',
    name: 'Screen_Recording_01.mp4',
    size: '45.2 MB',
    type: 'video',
    dateModified: 'Yesterday, 8:15 PM',
    path: '/sdcard/Download/Screen_Recording_01.mp4'
  },
  {
    id: 'rf-5',
    name: 'Secure_E2EE_Vault.zip',
    size: '88.4 MB',
    type: 'archive',
    dateModified: 'May 12, 2024',
    path: '/sdcard/Download/Secure_E2EE_Vault.zip'
  }
];

export const MOCK_REMOTE_APPS: RemoteApp[] = [
  { id: 'app-1', name: 'Gallery', packageName: 'com.sec.android.gallery3d', version: '14.5.01', iconName: 'photo_library', category: 'Media', sizeMb: 48, isRunning: true },
  { id: 'app-2', name: 'Chrome', packageName: 'com.android.chrome', version: '124.0.63', iconName: 'language', category: 'Utility', sizeMb: 120, isRunning: true },
  { id: 'app-3', name: 'Play Store', packageName: 'com.android.vending', version: '38.2.19', iconName: 'store', category: 'System', sizeMb: 65, isRunning: false },
  { id: 'app-4', name: 'Spotify', packageName: 'com.spotify.music', version: '8.9.22', iconName: 'graphic_eq', category: 'Audio', sizeMb: 85, isRunning: true },
  { id: 'app-5', name: 'Google Maps', packageName: 'com.google.android.apps.maps', version: '11.120', iconName: 'map', category: 'Navigation', sizeMb: 110, isRunning: false },
  { id: 'app-6', name: 'Terminal / ADB', packageName: 'com.mindsparq.agent', version: '2.4.1', iconName: 'terminal', category: 'System', sizeMb: 24, isRunning: true },
];

export const MOCK_COMMAND_HISTORY: CommandHistory[] = [
  {
    id: 'cmd-1',
    command: 'adb shell getprop ro.product.model',
    output: 'Samsung SM-S911B (Galaxy S23)\nCPU: Snapdragon 8 Gen 2\nArchitecture: arm64-v8a',
    timestamp: '10:32:01 AM',
    status: 'success',
    deviceId: 'dev-1'
  },
  {
    id: 'cmd-2',
    command: 'mac_lookup 00:1A:2B:3C:4D:5E --e2ee-verify',
    output: '[E2EE] Handshake initialized via ECDH-P384\n[INFO] MAC: 00:1A:2B:3C:4D:5E (Intel Corp)\n[STATUS] Direct WebRTC Peer Connection Established (Latency: 3.2ms)',
    timestamp: '10:33:14 AM',
    status: 'success',
    deviceId: 'dev-4'
  },
  {
    id: 'cmd-3',
    command: 'screen_unlock --type pattern --device dev-1',
    output: '[AUTH] 3x3 Gesture Pattern verified.\n[SUCCESS] Screen Lock bypassed securely via E2EE key payload.',
    timestamp: '10:34:40 AM',
    status: 'success',
    deviceId: 'dev-1'
  }
];

export const DEFAULT_ENCRYPTION_CONFIG: EncryptionConfig = {
  enabled: true,
  algorithm: 'AES-256-GCM',
  keyExchange: 'ECDH-P384',
  isVerified: true,
  fingerprint: '9B:4E:81:AA:5C:2D:7F:10:88:31:0A:4F:72:C8:11:3E'
};

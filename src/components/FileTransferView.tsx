import React, { useState } from 'react';
import { FileItem, TransferQueueItem, Device } from '../types';
import { INITIAL_LOCAL_FILES, INITIAL_REMOTE_FILES } from '../data/mockData';

interface FileTransferViewProps {
  devices: Device[];
  selectedDevice: Device;
}

export const FileTransferView: React.FC<FileTransferViewProps> = ({
  devices,
  selectedDevice,
}) => {
  const [localFiles, setLocalFiles] = useState<FileItem[]>(INITIAL_LOCAL_FILES);
  const [remoteFiles, setRemoteFiles] = useState<FileItem[]>(INITIAL_REMOTE_FILES);
  
  const [selectedLocalFiles, setSelectedLocalFiles] = useState<string[]>([]);
  const [selectedRemoteFiles, setSelectedRemoteFiles] = useState<string[]>([]);

  const [transferQueue, setTransferQueue] = useState<TransferQueueItem[]>([
    {
      id: 't-1',
      fileName: 'MindSparQ_Agent_v1.0.apk',
      totalSizeMb: 15.8,
      transferredMb: 15.8,
      speedMbps: 22.4,
      progressPercent: 100,
      direction: 'local-to-remote',
      status: 'completed',
    },
  ]);

  // Handle Transfer Local -> Remote
  const handleTransferToRemote = () => {
    if (selectedLocalFiles.length === 0) return;
    
    selectedLocalFiles.forEach((fId) => {
      const fileObj = localFiles.find((f) => f.id === fId);
      if (fileObj && fileObj.type !== 'folder') {
        const newQueueItem: TransferQueueItem = {
          id: `t-${Date.now()}`,
          fileName: fileObj.name,
          totalSizeMb: 12.5,
          transferredMb: 0,
          speedMbps: 18.5,
          progressPercent: 0,
          direction: 'local-to-remote',
          status: 'transferring',
        };

        setTransferQueue((prev) => [newQueueItem, ...prev]);

        // Simulate progress
        let prog = 0;
        const interval = setInterval(() => {
          prog += 25;
          if (prog >= 100) {
            clearInterval(interval);
            setTransferQueue((prev) =>
              prev.map((item) =>
                item.id === newQueueItem.id
                  ? { ...item, progressPercent: 100, status: 'completed', transferredMb: item.totalSizeMb }
                  : item
              )
            );
            // Add to remote files list
            setRemoteFiles((prev) => [
              {
                id: `rf-${Date.now()}`,
                name: fileObj.name,
                size: fileObj.size,
                type: fileObj.type,
                dateModified: 'Just now',
                path: `/sdcard/Download/${fileObj.name}`,
              },
              ...prev,
            ]);
          } else {
            setTransferQueue((prev) =>
              prev.map((item) =>
                item.id === newQueueItem.id
                  ? {
                      ...item,
                      progressPercent: prog,
                      transferredMb: Math.round((prog / 100) * item.totalSizeMb),
                    }
                  : item
              )
            );
          }
        }, 400);
      }
    });

    setSelectedLocalFiles([]);
  };

  const getIconForType = (type: FileItem['type']) => {
    switch (type) {
      case 'folder': return 'folder';
      case 'image': return 'image';
      case 'doc': return 'description';
      case 'apk': return 'android';
      case 'video': return 'movie';
      case 'archive': return 'folder_zip';
      default: return 'draft';
    }
  };

  return (
    <div className="space-y-6 pb-20 text-gray-900 dark:text-white">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">folder_shared</span>
          </div>
          <div>
            <h2 className="font-bold text-base text-gray-900 dark:text-white">Encrypted Dual-Pane File Manager</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Target Device: {selectedDevice.name} ({selectedDevice.ipAddress})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTransferToRemote}
            disabled={selectedLocalFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">send</span>
            Transfer Selected ({selectedLocalFiles.length})
          </button>
        </div>
      </div>

      {/* Split Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT PANE: Local Workstation Storage */}
        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">desktop_windows</span>
              <span className="font-bold text-sm text-gray-900 dark:text-white">Local Workstation</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">
              C:\Users\Admin\Downloads
            </span>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto custom-scrollbar">
            {localFiles.map((file) => {
              const isSelected = selectedLocalFiles.includes(file.id);
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedLocalFiles((prev) => prev.filter((id) => id !== file.id));
                    } else {
                      setSelectedLocalFiles((prev) => [...prev, file.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-white font-semibold'
                      : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 text-xl">
                      {getIconForType(file.type)}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1 text-gray-900 dark:text-white">{file.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {file.size} • {file.dateModified}
                      </p>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-base text-gray-400">
                    {isSelected ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: Remote Device Storage */}
        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-lg">smartphone</span>
              <span className="font-bold text-sm text-gray-900 dark:text-white">Remote Storage ({selectedDevice.name})</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">
              /sdcard/Download
            </span>
          </div>

          {/* Storage Meter */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-gray-500">Storage Usage:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedDevice.storageUsedGb} GB / {selectedDevice.storageTotalGb} GB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-[#060e20] overflow-hidden">
              <div
                style={{
                  width: `${(selectedDevice.storageUsedGb / selectedDevice.storageTotalGb) * 100}%`,
                }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
            {remoteFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 flex items-center justify-between hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-xl">
                    {getIconForType(file.type)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1 text-gray-900 dark:text-white">{file.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {file.size} • {file.dateModified}
                    </p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-sm text-emerald-500">
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transfer Queue Status Overlay */}
      {transferQueue.length > 0 && (
        <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-5 rounded-2xl space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-base">sync_alt</span>
              Active File Transfer Queue
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Average Speed: 22.4 MB/s (AES-256)
            </span>
          </div>

          <div className="space-y-2">
            {transferQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{item.fileName}</span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {item.transferredMb} MB / {item.totalSizeMb} MB ({item.progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-[#060e20] overflow-hidden">
                  <div
                    style={{ width: `${item.progressPercent}%` }}
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

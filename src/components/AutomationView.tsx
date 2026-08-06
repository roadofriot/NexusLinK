import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AutomationTask, Device } from '../types';

interface MacroStep {
  id: string;
  type: 'tap' | 'swipe' | 'keystroke' | 'button' | 'delay';
  details: string;
  coords?: { x: number; y: number };
  endCoords?: { x: number; y: number };
  textValue?: string;
  buttonKey?: string;
  delayMs?: number;
}

interface AutomationViewProps {
  devices: Device[];
}

export const AutomationView: React.FC<AutomationViewProps> = ({ devices }) => {
  const [tasks, setTasks] = useState<AutomationTask[]>([
    {
      id: 'auto-1',
      name: 'Nightly Remote Backup',
      description: 'Sync /sdcard/Documents to local server storage at 02:00 AM daily',
      trigger: 'Schedule',
      actionType: 'File Sync',
      targetDevice: 'Samsung Galaxy S23 (8C:3B:AD:12:44:90)',
      status: 'active',
      lastRun: 'Today, 02:00 AM',
    },
    {
      id: 'auto-2',
      name: 'Auto Screen Lock on Disconnect',
      description: 'Send PIN lock payload immediately when E2EE WebRTC peer disconnects',
      trigger: 'Device Connected',
      actionType: 'Screen Lock',
      targetDevice: 'All Remote Nodes',
      status: 'active',
      lastRun: '10 mins ago',
    },
    {
      id: 'auto-3',
      name: 'App Login & Diagnostics Sequence Macro',
      description: 'Recorded macro sequence: Tap (450, 1200) -> Type PIN -> Swipe UP -> Wait 1000ms',
      trigger: 'Manual',
      actionType: 'Run Script',
      targetDevice: 'Pixel 7 Pro (F4:0F:24:9A:88:B1)',
      status: 'active',
      lastRun: '2 hours ago',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'workflows' | 'recorder'>('workflows');

  // Macro Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [activePlaybackStepIndex, setActivePlaybackStepIndex] = useState<number | null>(null);
  const [macroName, setMacroName] = useState('App Login Macro');
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<string>(devices[0]?.name || 'Samsung Galaxy S23');
  
  const [recordedSteps, setRecordedSteps] = useState<MacroStep[]>([
    { id: 'step-1', type: 'tap', details: 'Tap on Login Field', coords: { x: 450, y: 1120 }, delayMs: 400 },
    { id: 'step-2', type: 'keystroke', details: 'Type passcode', textValue: '482910', delayMs: 600 },
    { id: 'step-3', type: 'button', details: 'Press Hardware HOME Key', buttonKey: 'HOME', delayMs: 500 },
    { id: 'step-4', type: 'swipe', details: 'Swipe UP to view notification shade', coords: { x: 300, y: 1400 }, endCoords: { x: 300, y: 300 }, delayMs: 800 },
    { id: 'step-5', type: 'delay', details: 'Wait for buffer load', delayMs: 1000 },
  ]);

  // Form State for Adding Custom Step Manually
  const [newStepType, setNewStepType] = useState<MacroStep['type']>('tap');
  const [stepTapX, setStepTapX] = useState<number>(500);
  const [stepTapY, setStepTapY] = useState<number>(1000);
  const [stepText, setStepText] = useState<string>('');
  const [stepButton, setStepButton] = useState<string>('HOME');
  const [stepDelay, setStepDelay] = useState<number>(500);

  // Workflow Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTrigger, setNewTaskTrigger] = useState<AutomationTask['trigger']>('Schedule');
  const [newTaskAction, setNewTaskAction] = useState<AutomationTask['actionType']>('Run Script');

  const handleToggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t
      )
    );
  };

  const handleRunTaskNow = (taskName: string) => {
    alert(`Triggered task: "${taskName}" successfully! Macro payload dispatched to node.`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask: AutomationTask = {
      id: `auto-${Date.now()}`,
      name: newTaskName,
      description: newTaskDesc || 'Custom automation workflow macro.',
      trigger: newTaskTrigger,
      actionType: newTaskAction,
      targetDevice: devices[0]?.name || 'All Connected Nodes',
      status: 'active',
      lastRun: 'Just created',
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
    setNewTaskName('');
    setNewTaskDesc('');
  };

  // Macro Recorder Actions
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Add initial record notice step if empty
    } else {
      setIsRecording(false);
    }
  };

  const handleAddManualStep = (e: React.FormEvent) => {
    e.preventDefault();
    let details = '';
    let coords: { x: number; y: number } | undefined;
    let endCoords: { x: number; y: number } | undefined;
    let textValue: string | undefined;
    let buttonKey: string | undefined;

    if (newStepType === 'tap') {
      details = `Tap at (X: ${stepTapX}, Y: ${stepTapY})`;
      coords = { x: stepTapX, y: stepTapY };
    } else if (newStepType === 'swipe') {
      details = `Swipe UP from (${stepTapX}, ${stepTapY}) to (${stepTapX}, 300)`;
      coords = { x: stepTapX, y: stepTapY };
      endCoords = { x: stepTapX, y: 300 };
    } else if (newStepType === 'keystroke') {
      details = `Type text: "${stepText || 'Hello'}"`;
      textValue = stepText || 'Hello';
    } else if (newStepType === 'button') {
      details = `Hardware Button: ${stepButton}`;
      buttonKey = stepButton;
    } else if (newStepType === 'delay') {
      details = `Wait Delay: ${stepDelay} ms`;
    }

    const step: MacroStep = {
      id: `step-${Date.now()}`,
      type: newStepType,
      details,
      coords,
      endCoords,
      textValue,
      buttonKey,
      delayMs: stepDelay,
    };

    setRecordedSteps((prev) => [...prev, step]);
    setStepText('');
  };

  const handleDeleteStep = (id: string) => {
    setRecordedSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePlaybackMacro = async () => {
    if (recordedSteps.length === 0) {
      alert('No recorded macro steps to execute.');
      return;
    }

    setIsPlayingBack(true);
    for (let i = 0; i < recordedSteps.length; i++) {
      setActivePlaybackStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, recordedSteps[i].delayMs || 600));
    }
    setActivePlaybackStepIndex(null);
    setIsPlayingBack(false);
  };

  const handleSaveMacroAsWorkflow = () => {
    if (!macroName.trim()) return;

    const newTask: AutomationTask = {
      id: `macro-${Date.now()}`,
      name: macroName,
      description: `Recorded Macro (${recordedSteps.length} steps): ${recordedSteps.map((s) => s.type.toUpperCase()).join(' → ')}`,
      trigger: 'Manual',
      actionType: 'Run Script',
      targetDevice: selectedTargetDevice,
      status: 'active',
      lastRun: 'Just recorded',
    };

    setTasks((prev) => [newTask, ...prev]);
    alert(`Macro "${macroName}" saved successfully as a reusable automation workflow!`);
    setActiveTab('workflows');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Section Header & Tab Bar */}
      <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600">account_tree</span>
            <span className="text-xs uppercase font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              Automations & Macro Recorder
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scheduled Workflows & Touch Macro Sequence Recorder</h2>
          <p className="text-xs text-gray-500 max-w-xl mt-1">
            Record, simulate, and automate touch interactions, clicks, keystrokes, and ADB hardware triggers across all paired remote nodes.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#131b2e] p-1.5 rounded-xl border border-gray-200 dark:border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'workflows'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            Active Workflows ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('recorder')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'recorder'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">fiber_manual_record</span>
            Macro Sequence Recorder
          </button>
        </div>
      </div>

      {/* Tab Content 1: Active Workflows */}
      {activeTab === 'workflows' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Automation Schedules & Trigger Rules</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create Workflow Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                      <span className="material-symbols-outlined text-xs">
                        {t.actionType === 'Run Script' ? 'terminal' : t.actionType === 'File Sync' ? 'folder_copy' : 'lock'}
                      </span>
                      {t.actionType}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(t.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          t.status === 'active'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400'
                            : 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-white/5 dark:border-white/10'
                        }`}
                      >
                        {t.status === 'active' ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{t.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/5 font-mono text-[11px] text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Trigger Condition:</span>
                      <span className="text-gray-900 dark:text-gray-200 font-semibold">{t.trigger}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Remote Node:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[200px]">{t.targetDevice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Execution:</span>
                      <span className="text-gray-400">{t.lastRun}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                  <button
                    onClick={() => handleRunTaskNow(t.name)}
                    className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    Execute Now
                  </button>
                  <button
                    onClick={() => handleToggleTaskStatus(t.id)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-semibold text-xs transition-colors"
                  >
                    {t.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab Content 2: Macro Sequence Recorder */}
      {activeTab === 'recorder' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-12 gap-6"
        >
          {/* Left Column: Macro Steps & Controls (Spans 7 cols) */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-5 shadow-xs">
              
              {/* Macro Name & Target Node */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider">
                    Macro Sequence Name
                  </label>
                  <input
                    type="text"
                    value={macroName}
                    onChange={(e) => setMacroName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1 uppercase tracking-wider">
                    Target Remote Node
                  </label>
                  <select
                    value={selectedTargetDevice}
                    onChange={(e) => setSelectedTargetDevice(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.platform.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recorder Toolbar: Live Record, Playback Test, Save */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleRecording}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isRecording ? 'stop_circle' : 'fiber_manual_record'}
                    </span>
                    {isRecording ? 'Recording Live Interactions...' : 'Record Live Macro'}
                  </button>

                  <button
                    onClick={handlePlaybackMacro}
                    disabled={isPlayingBack || recordedSteps.length === 0}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    {isPlayingBack ? 'Executing Sequence...' : 'Test Playback'}
                  </button>
                </div>

                <button
                  onClick={handleSaveMacroAsWorkflow}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Save as Automation Rule
                </button>
              </div>

              {/* Recorded Steps Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600 text-base">format_list_bulleted</span>
                    Sequence Steps Timeline ({recordedSteps.length})
                  </h4>
                  {recordedSteps.length > 0 && (
                    <button
                      onClick={() => setRecordedSteps([])}
                      className="text-[11px] text-rose-500 hover:underline font-semibold"
                    >
                      Clear All Steps
                    </button>
                  )}
                </div>

                {recordedSteps.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 dark:bg-[#131b2e] rounded-xl border border-dashed border-gray-300 dark:border-white/10 space-y-2">
                    <span className="material-symbols-outlined text-4xl text-gray-400">touch_app</span>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">No macro steps recorded yet</p>
                    <p className="text-[11px] text-gray-400">
                      Click "Record Live Macro" or use the step builder on the right to add interactions manually.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {recordedSteps.map((step, idx) => {
                        const isCurrentActive = activePlaybackStepIndex === idx;
                        return (
                          <motion.div
                            key={step.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                              isCurrentActive
                                ? 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/40 dark:text-white shadow-md scale-[1.02]'
                                : 'bg-gray-50 dark:bg-[#131b2e] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="text-xs font-bold flex items-center gap-2">
                                  <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-mono font-extrabold">
                                    {step.type}
                                  </span>
                                  <span>{step.details}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                  Delay before next step: {step.delayMs} ms
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteStep(step.id)}
                              className="text-gray-400 hover:text-rose-500 p-1 rounded-lg"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Step Builder & Interactive Visualizer (Spans 5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            
            {/* Step Builder Panel */}
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-base">add_box</span>
                Add Interaction Step
              </h3>

              <form onSubmit={handleAddManualStep} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Interaction Type</label>
                  <select
                    value={newStepType}
                    onChange={(e) => setNewStepType(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="tap">Touch Tap (X, Y Coordinates)</option>
                    <option value="swipe">Swipe Gesture (Up / Down / Left / Right)</option>
                    <option value="keystroke">Send Keystroke / Text Payload</option>
                    <option value="button">Hardware Button Trigger (Home / Power)</option>
                    <option value="delay">Wait Delay Pause</option>
                  </select>
                </div>

                {/* Touch Tap / Swipe Coordinates */}
                {(newStepType === 'tap' || newStepType === 'swipe') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Tap X (0 - 1080px)</label>
                      <input
                        type="number"
                        value={stepTapX}
                        onChange={(e) => setStepTapX(Number(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Tap Y (0 - 2400px)</label>
                      <input
                        type="number"
                        value={stepTapY}
                        onChange={(e) => setStepTapY(Number(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Keystroke Text Payload */}
                {newStepType === 'keystroke' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Text String Payload</label>
                    <input
                      type="text"
                      placeholder="e.g. MyPasscode123!"
                      value={stepText}
                      onChange={(e) => setStepText(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                )}

                {/* Hardware Button Selector */}
                {newStepType === 'button' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Hardware Key</label>
                    <select
                      value={stepButton}
                      onChange={(e) => setStepButton(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="HOME">HOME Key</option>
                      <option value="BACK">BACK Key</option>
                      <option value="RECENTS">RECENTS Apps Key</option>
                      <option value="POWER">POWER / Lock Key</option>
                      <option value="VOLUME_UP">VOLUME + Key</option>
                      <option value="VOLUME_DOWN">VOLUME - Key</option>
                    </select>
                  </div>
                )}

                {/* Delay */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Delay Before Next Step (ms)</label>
                  <input
                    type="number"
                    value={stepDelay}
                    onChange={(e) => setStepDelay(Number(e.target.value))}
                    step={100}
                    className="w-full bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Append Step to Sequence
                </button>
              </form>
            </div>

            {/* Quick Virtual Touch Canvas Simulator */}
            <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center space-y-3 shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block">
                Touch Grid Coordinates Guide (1080 x 2400)
              </span>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 1080);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 2400);
                  setStepTapX(x);
                  setStepTapY(y);
                }}
                className="w-full aspect-[9/16] bg-gray-900 rounded-xl relative overflow-hidden border border-gray-300 dark:border-white/10 cursor-crosshair flex flex-col items-center justify-center p-4 text-white"
              >
                <div className="text-center space-y-1">
                  <span className="material-symbols-outlined text-3xl text-blue-500">touch_app</span>
                  <p className="text-xs font-bold">Click Screen to Auto-Pick Coordinates</p>
                  <p className="text-[11px] font-mono text-emerald-400">
                    Selected X: {stepTapX} • Y: {stepTapY}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171f33] border border-gray-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Create Automation Workflow</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Sync Screenshots on Connect"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Brief summary of what this automation executes..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Trigger Condition
                  </label>
                  <select
                    value={newTaskTrigger}
                    onChange={(e) => setNewTaskTrigger(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium"
                  >
                    <option value="Schedule">Schedule (Time)</option>
                    <option value="Device Connected">Device Connected</option>
                    <option value="Manual">Manual Trigger</option>
                    <option value="Threshold">System Threshold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Action Type
                  </label>
                  <select
                    value={newTaskAction}
                    onChange={(e) => setNewTaskAction(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#131b2e] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium"
                  >
                    <option value="Run Script">Run ADB / Terminal Script</option>
                    <option value="File Sync">Dual-Pane File Sync</option>
                    <option value="Screen Lock">Enforce Screen Lock</option>
                    <option value="App Restart">Restart Background App</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

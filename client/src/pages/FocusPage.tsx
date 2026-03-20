// FLOW Focus Page — Pomodoro timer, ambient sounds, deep work mode
// Design: "Precision Instrument" — full-screen focus, amber countdown ring
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, ArrowCounterClockwise, SkipForward,
  MusicNote, Drop, Wind, Leaf, Coffee,
  Timer, Brain, CheckSquare, X
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition } from '../lib/animations';
import { toast } from 'sonner';

type TimerMode = 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK' | 'DEEP_WORK';
type AmbientSound = 'none' | 'lofi' | 'rain' | 'forest' | 'cafe' | 'white_noise';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  POMODORO: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
  DEEP_WORK: 90 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  POMODORO: 'Focus',
  SHORT_BREAK: 'Short Break',
  LONG_BREAK: 'Long Break',
  DEEP_WORK: 'Deep Work',
};

const AMBIENT_SOUNDS: { id: AmbientSound; label: string; icon: any; emoji: string }[] = [
  { id: 'none', label: 'Silence', icon: X, emoji: '🔇' },
  { id: 'lofi', label: 'Lo-Fi', icon: MusicNote, emoji: '🎵' },
  { id: 'rain', label: 'Rain', icon: Drop, emoji: '🌧️' },
  { id: 'forest', label: 'Forest', icon: Leaf, emoji: '🌿' },
  { id: 'cafe', label: 'Café', icon: Coffee, emoji: '☕' },
  { id: 'white_noise', label: 'White Noise', icon: Wind, emoji: '🌊' },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function CircularProgress({
  progress, size = 280, strokeWidth = 6, color = 'var(--accent-primary)'
}: {
  progress: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--bg-elevated)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

export default function FocusPage() {
  const { tasks, focusSessions } = useFlowStore();
  const [mode, setMode] = useState<TimerMode>('POMODORO');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.POMODORO);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusMinutesTotal, setFocusMinutesTotal] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = TIMER_DURATIONS[mode];
  const progress = timeLeft / totalDuration;
  const activeTasks = tasks.filter(t => t.status !== 'DONE' && t.status !== 'CANCELLED');
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (mode === 'POMODORO') {
              setPomodoroCount(c => c + 1);
              setFocusMinutesTotal(m => m + 25);
              toast.success('Pomodoro complete! 🍅', {
                description: 'Take a short break',
                duration: 4000,
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(TIMER_DURATIONS[mode]);
    setIsRunning(false);
  };

  const handleSkip = () => {
    setTimeLeft(0);
    setIsRunning(false);
    if (mode === 'POMODORO') {
      setPomodoroCount(c => c + 1);
    }
  };

  const handleAmbient = (sound: AmbientSound) => {
    setAmbientSound(sound);
    if (sound !== 'none') {
      toast.info(`${AMBIENT_SOUNDS.find(s => s.id === sound)?.label} — ambient audio simulation`, { duration: 2000 });
    }
  };

  const timerColor = mode === 'POMODORO' ? 'var(--accent-primary)' :
                     mode === 'DEEP_WORK' ? '#7C3AED' :
                     mode === 'SHORT_BREAK' ? '#16A34A' : '#0891B2';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ maxWidth: 720, margin: '0 auto' }}
    >
      {/* Mode selector */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 40,
      }}>
        {(Object.keys(TIMER_DURATIONS) as TimerMode[]).map(m => (
          <motion.button
            key={m}
            onClick={() => handleModeChange(m)}
            whileTap={{ scale: 0.96 }}
            style={{
              height: 32, padding: '0 14px',
              background: mode === m ? 'var(--bg-elevated)' : 'transparent',
              border: mode === m ? '1px solid var(--border-default)' : 'none',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontWeight: mode === m ? 500 : 400,
              color: mode === m ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {MODE_LABELS[m]}
          </motion.button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 40,
      }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          <CircularProgress progress={progress} color={timerColor} />

          {/* Center content */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Time display */}
            <motion.div
              key={timeLeft}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 56, fontWeight: 300,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>

            <div style={{
              fontSize: 13, color: 'var(--text-tertiary)',
              fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {MODE_LABELS[mode]}
            </div>

            {selectedTask && (
              <div style={{
                fontSize: 11, color: 'var(--text-tertiary)',
                marginTop: 6, maxWidth: 180,
                textAlign: 'center', lineHeight: 1.3,
              }}>
                {selectedTask.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, marginBottom: 40,
      }}>
        <motion.button
          onClick={handleReset}
          whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid var(--border-default)',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}
          title="Reset"
        >
          <ArrowCounterClockwise size={18} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 72, height: 72, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: timerColor, border: 'none',
            cursor: 'pointer', color: 'white',
            boxShadow: `0 8px 24px ${timerColor}44`,
          }}
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Pause size={28} weight="fill" />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Play size={28} weight="fill" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={handleSkip}
          whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid var(--border-default)',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}
          title="Skip"
        >
          <SkipForward size={18} />
        </motion.button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 40,
      }}>
        {[
          { label: 'Pomodoros', value: pomodoroCount, icon: Timer },
          { label: 'Focus Time', value: `${focusMinutesTotal}m`, icon: Brain },
          { label: 'Sessions', value: focusSessions.length, icon: CheckSquare },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
              <stat.icon size={13} color="var(--text-tertiary)" weight="duotone" />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--text-primary)', fontWeight: 500 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Task selector */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
            Focus On
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
            <button
              onClick={() => setSelectedTaskId(null)}
              style={{
                padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: !selectedTaskId ? 'var(--accent-subtle)' : 'transparent',
                color: !selectedTaskId ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: 12, textAlign: 'left', fontFamily: 'var(--font-body)',
              }}
            >
              Free focus (no task)
            </button>
            {activeTasks.slice(0, 8).map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                style={{
                  padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: selectedTaskId === task.id ? 'var(--accent-subtle)' : 'transparent',
                  color: selectedTaskId === task.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: 12, textAlign: 'left', fontFamily: 'var(--font-body)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient sounds */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ambient Sound
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {AMBIENT_SOUNDS.map(sound => (
              <motion.button
                key={sound.id}
                onClick={() => handleAmbient(sound.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 6px', borderRadius: 8,
                  background: ambientSound === sound.id ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                  border: `1px solid ${ambientSound === sound.id ? 'var(--accent-primary)' : 'transparent'}`,
                  cursor: 'pointer', textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>{sound.emoji}</div>
                <div style={{
                  fontSize: 10, fontWeight: 500,
                  color: ambientSound === sound.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}>
                  {sound.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

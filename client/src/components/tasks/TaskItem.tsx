// FLOW TaskItem — Animated completion, amber checkbox, priority dot
// Design: "Precision Instrument" — every interaction has exactly one animation
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, DotsThree } from '@phosphor-icons/react';
import { listItemVariants, DURATIONS, EASINGS } from '../../lib/animations';
import { useFlowStore } from '../../store/flowStore';
import type { Task } from '../../lib/types';

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#DC2626',
  HIGH: '#D97706',
  MEDIUM: '#6B6B65',
  LOW: '#9B9B95',
  NONE: 'transparent',
};

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

function playTickSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 520;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {}
}

interface TaskItemProps {
  task: Task;
  showProject?: boolean;
}

export function TaskItem({ task, showProject = true }: TaskItemProps) {
  const { completeTask, setSelectedTask, setRightPanel } = useFlowStore();
  const [completing, setCompleting] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(task.status === 'DONE');

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localCompleted) return;
    setCompleting(true);
    setLocalCompleted(true);
    playTickSound();
    setTimeout(() => {
      completeTask(task.id);
      setCompleting(false);
    }, 600);
  };

  const handleClick = () => {
    setSelectedTask(task.id);
    setRightPanel(true, 'task');
  };

  return (
    <motion.li
      variants={listItemVariants}
      layout
      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0, transition: { duration: DURATIONS.normal } }}
      onClick={handleClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 var(--space-3)', height: 40,
        borderRadius: 6, cursor: 'pointer',
        opacity: localCompleted ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
        listStyle: 'none',
      }}
      whileHover={{ backgroundColor: 'var(--bg-hover)', transition: { duration: DURATIONS.instant } }}
    >
      {/* Animated amber checkbox */}
      <motion.button
        onClick={handleComplete}
        animate={completing ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3, times: [0, 0.4, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: `1.5px solid ${localCompleted ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
          background: localCompleted ? 'var(--accent-primary)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <AnimatePresence>
          {localCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15, ease: EASINGS.enter }}
            >
              <Check size={10} weight="bold" color="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Priority dot */}
      <div style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: PRIORITY_COLORS[task.priority] || 'transparent',
      }} />

      {/* Title */}
      <span style={{
        flex: 1, fontSize: 'var(--text-sm)',
        color: localCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)',
        textDecoration: localCompleted ? 'line-through' : 'none',
        transition: 'color 0.3s, text-decoration 0.3s',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {task.title}
      </span>

      {/* Project chip */}
      {showProject && task.project && (
        <span style={{
          fontSize: 'var(--text-xs)', padding: '2px 6px',
          borderRadius: 4,
          background: `${task.project.color}22`,
          color: task.project.color,
          fontWeight: 500,
          flexShrink: 0,
        }}>
          {task.project.name}
        </span>
      )}

      {/* Due date */}
      {task.dueDate && (
        <span style={{
          fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
          color: isOverdue(task.dueDate) ? 'var(--error)' :
                 isToday(task.dueDate) ? 'var(--warning)' :
                 'var(--text-tertiary)',
          flexShrink: 0,
        }}>
          {formatDueDate(task.dueDate)}
        </span>
      )}
    </motion.li>
  );
}

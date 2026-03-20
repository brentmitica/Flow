// FLOW Habits Page — Streak tracking, heatmap, completion rings
// Design: "Precision Instrument" — amber streaks, heat gradient
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Target, Plus, Flame, CheckCircle, Circle,
  TrendUp, Calendar, Lightning, Trophy
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition } from '../lib/animations';
import { toast } from 'sonner';
import type { Habit } from '../lib/types';

function HabitHeatmap({ habit }: { habit: Habit }) {
  const today = new Date();
  const cells = Array.from({ length: 91 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (90 - i));
    const dateStr = date.toISOString().split('T')[0];
    const completed = habit.completedDates.includes(dateStr);
    return { date: dateStr, completed, day: date.getDay() };
  });

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, maxWidth: 280 }}>
      {cells.map((cell, i) => (
        <div
          key={i}
          title={cell.date}
          style={{
            width: 10, height: 10, borderRadius: 2,
            background: cell.completed ? habit.color : 'var(--bg-elevated)',
            opacity: cell.completed ? 1 : 0.4,
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function HabitCard({ habit }: { habit: Habit }) {
  const { toggleHabit } = useFlowStore();
  const [animating, setAnimating] = useState(false);

  const handleToggle = () => {
    setAnimating(true);
    toggleHabit(habit.id);
    if (!habit.completedToday) {
      toast.success(`${habit.name} completed! 🎉`, {
        description: `${habit.currentStreak + 1} day streak`,
        duration: 2000,
      });
    }
    setTimeout(() => setAnimating(false), 400);
  };

  const completionRate = habit.completedDates.length > 0
    ? Math.round((habit.completedDates.filter(d => {
        const date = new Date(d);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
      }).length / 30) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${habit.completedToday ? `${habit.color}44` : 'var(--border-subtle)'}`,
        borderRadius: 12,
        padding: '16px 20px',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Completion ring */}
          <motion.button
            onClick={handleToggle}
            animate={animating ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: `2px solid ${habit.completedToday ? habit.color : 'var(--border-strong)'}`,
              background: habit.completedToday ? `${habit.color}22` : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {habit.completedToday ? (
              <CheckCircle size={20} color={habit.color} weight="duotone" />
            ) : (
              <Circle size={20} color="var(--text-tertiary)" />
            )}
          </motion.button>

          <div>
            <div style={{
              fontSize: 15, fontWeight: 500,
              color: habit.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
              textDecoration: habit.completedToday ? 'line-through' : 'none',
              transition: 'all 0.3s',
            }}>
              {habit.name}
            </div>
            {habit.description && (
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                {habit.description}
              </div>
            )}
          </div>
        </div>

        {/* Streak badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 6,
          background: habit.currentStreak > 0 ? `${habit.color}18` : 'var(--bg-elevated)',
        }}>
          <Flame size={12} color={habit.currentStreak > 0 ? habit.color : 'var(--text-tertiary)'} weight="duotone" />
          <span style={{
            fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)',
            color: habit.currentStreak > 0 ? habit.color : 'var(--text-tertiary)',
          }}>
            {habit.currentStreak}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
            Best streak
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {habit.longestStreak}d
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
            30-day rate
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {completionRate}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
            Total
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {habit.completedDates.length}d
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <HabitHeatmap habit={habit} />
    </motion.div>
  );
}

export default function HabitsPage() {
  const { habits, toggleHabit } = useFlowStore();
  const [showNewHabit, setShowNewHabit] = useState(false);

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const avgCompletion = Math.round((completedToday / habits.length) * 100);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: 2,
          }}>
            Habits
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {completedToday}/{habits.length} done today · {totalStreak} total streak days
          </p>
        </div>
        <motion.button
          onClick={() => toast.info('New habit creation coming soon', { duration: 2000 })}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          style={{
            height: 32, padding: '0 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-primary)', border: 'none',
            borderRadius: 6, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          <Plus size={14} weight="bold" />
          New Habit
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 28,
      }}>
        {[
          {
            label: "Today's Progress",
            value: `${completedToday}/${habits.length}`,
            icon: Target,
            color: 'var(--accent-primary)',
            sub: `${avgCompletion}% complete`,
          },
          {
            label: 'Total Streak Days',
            value: totalStreak,
            icon: Flame,
            color: '#D97706',
            sub: 'across all habits',
          },
          {
            label: 'Best Streak',
            value: Math.max(...habits.map(h => h.longestStreak)),
            icon: Trophy,
            color: '#16A34A',
            sub: 'days in a row',
          },
          {
            label: 'Habits Tracked',
            value: habits.length,
            icon: Lightning,
            color: '#7C3AED',
            sub: 'active habits',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <stat.icon size={14} color={stat.color} weight="duotone" />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                {stat.label}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, color: 'var(--text-primary)',
              letterSpacing: '-0.02em', lineHeight: 1,
              marginBottom: 4,
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Habits — Quick Toggle */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Calendar size={14} color="var(--accent-primary)" weight="duotone" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Today
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {habits.map(habit => {
            return (
              <motion.button
                key={habit.id}
                onClick={() => {
                  toggleHabit(habit.id);
                  if (!habit.completedToday) {
                    toast.success(`${habit.name} ✓`, { duration: 1500 });
                  }
                }}
                whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  height: 36, padding: '0 14px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: habit.completedToday ? `${habit.color}22` : 'var(--bg-surface)',
                  border: `1px solid ${habit.completedToday ? habit.color : 'var(--border-default)'}`,
                  borderRadius: 18, cursor: 'pointer',
                  fontSize: 13, fontWeight: 500,
                  color: habit.completedToday ? habit.color : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                }}
              >
                {habit.completedToday ? (
                  <CheckCircle size={14} weight="duotone" />
                ) : (
                  <Circle size={14} />
                )}
                {habit.name}
                {habit.currentStreak > 0 && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                    🔥{habit.currentStreak}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TrendUp size={14} color="var(--text-secondary)" weight="duotone" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Habit Details
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

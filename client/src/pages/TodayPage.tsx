// FLOW Today Page — "Your day, at a glance"
// Design: "Precision Instrument" — warm hero, amber accents, task density
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Sun, CheckSquare, Calendar, Target, Timer,
  Lightning, Flame, ArrowRight, Plus, Robot,
  TrendUp, Clock, Star
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition, listContainerVariants, listItemVariants, staggerContainer, staggerItem } from '../lib/animations';
import { TaskItem } from '../components/tasks/TaskItem';
import { toast } from 'sonner';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663458818249/XPpNLuV2vKDWBPY4XFZZf9/flow-hero-bg-Wc3hahTKwZkwcgQxEJwMQD.webp';

export default function TodayPage() {
  const { tasks, habits, user, calendarEvents } = useFlowStore();
  const [quickCapture, setQuickCapture] = useState('');
  const { addInboxItem } = useFlowStore();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const greeting = getGreeting();

  const todayTasks = tasks.filter(t =>
    t.dueDate === todayStr && t.status !== 'DONE' && t.status !== 'CANCELLED'
  );
  const completedToday = tasks.filter(t =>
    t.completedAt && t.completedAt.startsWith(todayStr)
  );
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const urgentTasks = tasks.filter(t =>
    t.priority === 'URGENT' && t.status !== 'DONE' && t.status !== 'CANCELLED'
  );

  const todayEvents = calendarEvents.filter(e => e.startTime.startsWith(todayStr));
  const habitsCompletedToday = habits.filter(h => h.completedToday).length;
  const habitProgress = Math.round((habitsCompletedToday / habits.length) * 100);

  const handleQuickCapture = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && quickCapture.trim()) {
      addInboxItem(quickCapture.trim());
      toast.success('Captured to inbox', { description: quickCapture.trim(), duration: 2000 });
      setQuickCapture('');
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ maxWidth: 800 }}
    >
      {/* Hero Section */}
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        minHeight: 160,
        background: `url(${HERO_BG}) center/cover no-repeat`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,15,13,0.85) 0%, rgba(15,15,13,0.4) 100%)',
        }} />
        <div style={{ position: 'relative', padding: '28px 32px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36, fontWeight: 400,
            color: '#F0F0EC',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {greeting}, {user.name.split(' ')[0]}.
          </div>
          <div style={{
            fontSize: 14, color: 'rgba(240,240,236,0.65)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-display)',
          }}>
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
            {[
              { icon: CheckSquare, value: `${completedToday.length}/${todayTasks.length + completedToday.length}`, label: 'tasks done' },
              { icon: Target, value: `${habitsCompletedToday}/${habits.length}`, label: 'habits' },
              { icon: Timer, value: `${Math.round(user.totalFocusMinutes / 60)}h`, label: 'focus time' },
              { icon: Flame, value: user.currentStreak, label: 'day streak' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <stat.icon size={14} color="var(--accent-primary)" weight="duotone" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F0F0EC' }}>{stat.value}</span>
                <span style={{ fontSize: 12, color: 'rgba(240,240,236,0.5)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Capture */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-xs)',
        }}>
          <Plus size={15} color="var(--text-tertiary)" />
          <input
            value={quickCapture}
            onChange={e => setQuickCapture(e.target.value)}
            onKeyDown={handleQuickCapture}
            placeholder="Capture a thought, task, or idea... (Press Enter)"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <kbd style={{ fontSize: 10 }}>↵</kbd>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Left: Tasks */}
        <div>
          {/* Urgent / In Progress */}
          {(urgentTasks.length > 0 || inProgressTasks.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
              }}>
                <Lightning size={14} color="var(--error)" weight="duotone" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Urgent & In Progress
                </span>
              </div>
              <motion.ul
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                <AnimatePresence>
                  {[...inProgressTasks, ...urgentTasks.filter(t => t.status !== 'IN_PROGRESS')]
                    .slice(0, 4)
                    .map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  }
                </AnimatePresence>
              </motion.ul>
            </div>
          )}

          {/* Today's Tasks */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sun size={14} color="var(--accent-primary)" weight="duotone" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Today
                </span>
                <span style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--text-tertiary)',
                }}>
                  {todayTasks.length} remaining
                </span>
              </div>
              <motion.button
                whileHover={{ color: 'var(--accent-primary)' }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-tertiary)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Plus size={12} />
                Add task
              </motion.button>
            </div>

            {todayTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '24px 16px', textAlign: 'center',
                  border: '1px dashed var(--border-default)',
                  borderRadius: 8,
                }}
              >
                <Sun size={24} color="var(--accent-primary)" weight="duotone" style={{ marginBottom: 8 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Nothing scheduled
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  A blank day is a gift. What will you make of it?
                </div>
              </motion.div>
            ) : (
              <motion.ul
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                <AnimatePresence>
                  {todayTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>

          {/* Completed */}
          {completedToday.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckSquare size={14} color="var(--success)" weight="duotone" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Completed ({completedToday.length})
                </span>
              </div>
              <motion.ul
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
                style={{ listStyle: 'none', padding: 0, margin: 0, opacity: 0.6 }}
              >
                {completedToday.slice(0, 5).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </motion.ul>
            </div>
          )}
        </div>

        {/* Right: Events + Habits + AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Today's Events */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Calendar size={14} color="var(--color-event)" weight="duotone" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Schedule
              </span>
            </div>
            {todayEvents.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Wide open. Rare and beautiful.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayEvents.map(event => {
                  const start = new Date(event.startTime);
                  const end = new Date(event.endTime);
                  const timeStr = `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
                  return (
                    <div key={event.id} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: 3, height: 36, borderRadius: 2,
                        background: event.color, flexShrink: 0, marginTop: 2,
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          {timeStr}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Habit Progress */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={14} color="var(--color-habit)" weight="duotone" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Habits
                </span>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                {habitsCompletedToday}/{habits.length}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              height: 4, background: 'var(--bg-elevated)',
              borderRadius: 2, marginBottom: 12, overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${habitProgress}%` }}
                transition={{ duration: 0.8, ease: [0.0, 0.0, 0.2, 1.0] }}
                style={{ height: '100%', background: 'var(--accent-primary)', borderRadius: 2 }}
              />
            </div>
            {habits.slice(0, 4).map(habit => (
              <div key={habit.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `1.5px solid ${habit.completedToday ? habit.color : 'var(--border-strong)'}`,
                  background: habit.completedToday ? habit.color : 'transparent',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {habit.completedToday && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 12, color: habit.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: habit.completedToday ? 'line-through' : 'none',
                  flex: 1,
                }}>
                  {habit.name}
                </span>
                {habit.currentStreak > 0 && (
                  <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    🔥{habit.currentStreak}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* AI Daily Briefing */}
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-surface) 100%)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Robot size={14} color="var(--accent-primary)" weight="duotone" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                AI Briefing
              </span>
            </div>
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: 12,
            }}>
              You have {urgentTasks.length} urgent tasks today. Your most productive window is typically 9–11am. Consider starting with the deployment task.
            </p>
            <motion.button
              whileHover={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toast.info('AI scheduling coming soon', { duration: 2000 })}
              style={{
                width: '100%', height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: 'transparent',
                border: '1px solid var(--accent-primary)',
                borderRadius: 6, cursor: 'pointer',
                fontSize: 12, fontWeight: 500, color: 'var(--accent-primary)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s ease',
              }}
            >
              <Lightning size={12} />
              Auto-schedule my day
            </motion.button>
          </div>

          {/* Productivity Score */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TrendUp size={14} color="var(--success)" weight="duotone" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Score
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 36, color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                {user.productivityScore}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>/100</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              ↑ 8 pts from yesterday
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// FLOW Calendar Page — Week view with time grid
// Design: "Precision Instrument" — precise time blocks, amber active day
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CaretLeft, CaretRight, Plus, Calendar,
  GoogleLogo, ArrowsClockwise
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition } from '../lib/animations';
import { toast } from 'sonner';

type ViewMode = 'week' | 'day' | 'month';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am to 10pm
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export default function CalendarPage() {
  const { calendarEvents } = useFlowStore();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const getEventsForDayHour = (day: Date, hour: number) => {
    const dayStr = day.toISOString().split('T')[0];
    return calendarEvents.filter(e => {
      const start = new Date(e.startTime);
      return e.startTime.startsWith(dayStr) && start.getHours() === hour;
    });
  };

  const weekLabel = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ margin: '-24px', height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Calendar Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.button
              onClick={() => navigateWeek(-1)}
              whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 30, height: 30, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              <CaretLeft size={14} />
            </motion.button>
            <motion.button
              onClick={() => setCurrentDate(new Date())}
              whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
              style={{
                height: 30, padding: '0 10px',
                background: 'transparent', border: '1px solid var(--border-default)',
                borderRadius: 6, cursor: 'pointer',
                fontSize: 12, color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Today
            </motion.button>
            <motion.button
              onClick={() => navigateWeek(1)}
              whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 30, height: 30, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              <CaretRight size={14} />
            </motion.button>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            {weekLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View mode */}
          <div style={{
            display: 'flex', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 2,
          }}>
            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  height: 26, padding: '0 10px',
                  background: viewMode === mode ? 'var(--bg-surface)' : 'transparent',
                  border: viewMode === mode ? '1px solid var(--border-subtle)' : 'none',
                  borderRadius: 4, cursor: 'pointer',
                  fontSize: 12, fontWeight: viewMode === mode ? 500 : 400,
                  color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-body)',
                  textTransform: 'capitalize',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => toast.info('Google Calendar sync coming soon', { duration: 2000 })}
            whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
            style={{
              height: 30, padding: '0 10px',
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <GoogleLogo size={12} />
            Sync
          </motion.button>

          <motion.button
            onClick={() => toast.info('New event creation coming soon', { duration: 2000 })}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 30, padding: '0 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-primary)', border: 'none',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 12, color: 'white', fontFamily: 'var(--font-body)',
            }}
          >
            <Plus size={12} weight="bold" />
            New Event
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Day headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px repeat(7, 1fr)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          position: 'sticky', top: 0, zIndex: 5,
          flexShrink: 0,
        }}>
          <div style={{ height: 48 }} />
          {weekDays.map((day, i) => {
            const dayStr = day.toISOString().split('T')[0];
            const isToday = dayStr === todayStr;
            return (
              <div key={i} style={{
                height: 48, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid var(--border-subtle)',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                }}>
                  {DAYS[day.getDay()]}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isToday ? 'var(--accent-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: isToday ? 600 : 400,
                    color: isToday ? 'white' : 'var(--text-primary)',
                  }}>
                    {day.getDate()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div style={{ flex: 1 }}>
          {HOURS.map(hour => (
            <div
              key={hour}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px repeat(7, 1fr)',
                height: 60,
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {/* Hour label */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                paddingRight: 8, paddingTop: 4,
                fontSize: 11, color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}>
                {formatHour(hour)}
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIdx) => {
                const events = getEventsForDayHour(day, hour);
                const dayStr = day.toISOString().split('T')[0];
                const isToday = dayStr === todayStr;
                return (
                  <div
                    key={dayIdx}
                    style={{
                      borderLeft: '1px solid var(--border-subtle)',
                      position: 'relative',
                      background: isToday ? 'rgba(217, 119, 6, 0.02)' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => toast.info('Click to create event — coming soon', { duration: 1500 })}
                  >
                    {events.map(event => {
                      const start = new Date(event.startTime);
                      const end = new Date(event.endTime);
                      const durationHours = (end.getTime() - start.getTime()) / 3600000;
                      const topOffset = (start.getMinutes() / 60) * 60;
                      return (
                        <div
                          key={event.id}
                          onClick={e => { e.stopPropagation(); toast.info(event.title, { duration: 2000 }); }}
                          style={{
                            position: 'absolute',
                            top: topOffset, left: 2, right: 2,
                            height: Math.max(durationHours * 60 - 4, 20),
                            background: `${event.color}22`,
                            border: `1px solid ${event.color}66`,
                            borderLeft: `3px solid ${event.color}`,
                            borderRadius: 4,
                            padding: '2px 6px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                        >
                          <div style={{ fontSize: 11, fontWeight: 500, color: event.color, lineHeight: 1.3 }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

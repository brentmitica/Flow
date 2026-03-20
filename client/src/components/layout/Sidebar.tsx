// FLOW Sidebar — 240px, amber active indicator, keyboard-first
// Design: "Precision Instrument" — Linear.app density, warm amber signal color
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Tray, Sun, CheckSquare, Calendar, FileText,
  Target, Timer, ChartBar, Gear, Plus,
  Briefcase, House, Rocket, BookOpen,
  MagnifyingGlass, SidebarSimple, Flame
} from '@phosphor-icons/react';
import { DURATIONS, EASINGS, sidebarIndicatorVariants } from '../../lib/animations';
import { useFlowStore } from '../../store/flowStore';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/inbox', label: 'Inbox', icon: Tray, shortcut: '⌘1' },
  { href: '/today', label: 'Today', icon: Sun, shortcut: '⌘2' },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, shortcut: '⌘3' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, shortcut: '⌘4' },
  { href: '/notes', label: 'Notes', icon: FileText, shortcut: '⌘5' },
  { href: '/habits', label: 'Habits', icon: Target, shortcut: '⌘6' },
  { href: '/focus', label: 'Focus', icon: Timer, shortcut: '⌘F' },
  { href: '/analytics', label: 'Analytics', icon: ChartBar },
];

const PROJECT_ICONS: Record<string, any> = {
  Briefcase, House, Rocket, BookOpen,
};

const PROJECT_ICON_FALLBACK = Briefcase;

export function Sidebar() {
  const [location] = useLocation();
  const { projects, inboxItems, ui, setSidebarOpen, setCommandPaletteOpen, addTask } = useFlowStore();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  
  const unprocessedCount = inboxItems.filter(i => !i.processed).length;
  const todayTaskCount = useFlowStore(s =>
    s.tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate === today && t.status !== 'DONE' && t.status !== 'CANCELLED';
    }).length
  );

  const getBadge = (href: string) => {
    if (href === '/inbox') return unprocessedCount > 0 ? unprocessedCount : null;
    if (href === '/today') return todayTaskCount > 0 ? todayTaskCount : null;
    return null;
  };

  return (
    <aside className="flow-sidebar" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        padding: '12px var(--space-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24,
            background: 'var(--accent-primary)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={14} weight="fill" color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            FLOW
          </span>
        </div>
        <motion.button
          onClick={() => setSidebarOpen(false)}
          whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 28, height: 28, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)',
          }}
          className="hidden-on-mobile"
        >
          <SidebarSimple size={14} />
        </motion.button>
      </div>

      {/* Quick Capture */}
      <div style={{ padding: '8px var(--space-3)' }}>
        <motion.button
          onClick={() => setCommandPaletteOpen(true)}
          whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', height: 32,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <MagnifyingGlass size={13} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search or jump to...</span>
          <kbd style={{ fontSize: 10 }}>⌘K</kbd>
        </motion.button>
      </div>

      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />

      {/* Navigation */}
      <nav style={{ padding: '4px var(--space-2)', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
          const Icon = item.icon;
          const badge = getBadge(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  height: 32, padding: '0 8px 0 10px',
                  borderRadius: 6,
                  textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  marginBottom: 1, cursor: 'pointer',
                  userSelect: 'none',
                }}
                whileHover={{
                  backgroundColor: 'var(--bg-overlay)',
                  transition: { duration: DURATIONS.instant }
                }}
                animate={{ backgroundColor: isActive ? 'var(--bg-overlay)' : 'transparent' }}
              >
                {/* Amber active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      variants={sidebarIndicatorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{
                        position: 'absolute', left: 0, top: 6, bottom: 6,
                        width: 2, background: 'var(--accent-primary)',
                        borderRadius: '0 2px 2px 0',
                      }}
                      transition={{ duration: DURATIONS.fast, ease: EASINGS.snappy }}
                    />
                  )}
                </AnimatePresence>

                <Icon
                  weight={isActive ? 'duotone' : 'regular'}
                  size={15}
                  color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'}
                  style={{ flexShrink: 0 }}
                />

                <span style={{ flex: 1, lineHeight: 1 }}>{item.label}</span>

                {badge !== null && (
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'white', background: 'var(--accent-primary)',
                    borderRadius: 9999, padding: '1px 5px',
                    minWidth: 18, textAlign: 'center',
                  }}>
                    {badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Projects Section */}
        <div style={{ marginTop: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 10px', marginBottom: 2,
          }}>
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <motion.span
                animate={{ rotate: projectsExpanded ? 0 : -90 }}
                transition={{ duration: DURATIONS.fast }}
                style={{ display: 'inline-block' }}
              >
                ▾
              </motion.span>
              Projects
            </button>
            <motion.button
              whileHover={{ color: 'var(--accent-primary)' }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center',
              }}
              title="New project"
            >
              <Plus size={13} />
            </motion.button>
          </div>

          <AnimatePresence>
            {projectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: DURATIONS.normal }}
                style={{ overflow: 'hidden' }}
              >
                {projects.map((project) => {
                  const isActive = location === `/tasks/project/${project.id}`;
                  const IconComp = PROJECT_ICONS[project.icon || ''] || PROJECT_ICON_FALLBACK;
                  return (
                    <Link key={project.id} href={`/tasks/project/${project.id}`}>
                      <motion.div
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          height: 30, padding: '0 8px 0 10px',
                          borderRadius: 6, cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          marginBottom: 1,
                        }}
                        whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
                        animate={{ backgroundColor: isActive ? 'var(--bg-overlay)' : 'transparent' }}
                      >
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: project.color, flexShrink: 0,
                        }} />
                        <span style={{ flex: 1, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.name}
                        </span>
                        {project.taskCount !== undefined && (
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {(project.taskCount || 0) - (project.completedCount || 0)}
                          </span>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Bottom: user + settings */}
      <div style={{
        padding: 'var(--space-3)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9999,
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: 'white',
            flexShrink: 0,
          }}>
            AC
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Alex Chen</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Free plan</div>
          </div>
        </div>
        <Link href="/settings">
          <motion.div
            whileHover={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
            style={{
              width: 28, height: 28, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-tertiary)', cursor: 'pointer',
            }}
          >
            <Gear size={15} />
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}

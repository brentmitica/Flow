// FLOW TopBar — 48px, breadcrumb, actions, theme toggle
// Design: "Precision Instrument" — minimal, functional, keyboard-first
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Plus, MagnifyingGlass, Bell, Moon, Sun as SunIcon,
  SidebarSimple, CaretRight
} from '@phosphor-icons/react';
import { useFlowStore } from '../../store/flowStore';
import { useTheme } from '../../contexts/ThemeContext';
import { DURATIONS } from '../../lib/animations';
import { toast } from 'sonner';

const PAGE_TITLES: Record<string, string> = {
  '/inbox': 'Inbox',
  '/today': 'Today',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/notes': 'Notes',
  '/habits': 'Habits',
  '/focus': 'Focus',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/onboarding': 'Onboarding',
};

const PAGE_ACTIONS: Record<string, { label: string; shortcut: string }> = {
  '/tasks': { label: 'New Task', shortcut: '⌘N' },
  '/notes': { label: 'New Note', shortcut: '⌘E' },
  '/habits': { label: 'New Habit', shortcut: '' },
  '/calendar': { label: 'New Event', shortcut: '' },
  '/inbox': { label: 'Capture', shortcut: '' },
};

export function TopBar() {
  const [location] = useLocation();
  const { setCommandPaletteOpen, setSidebarOpen, ui } = useFlowStore();
  const { theme, toggleTheme } = useTheme();

  const pageTitle = PAGE_TITLES[location] || 'FLOW';
  const pageAction = PAGE_ACTIONS[location];

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flow-topbar">
      {/* Mobile: sidebar toggle */}
      <motion.button
        onClick={() => setSidebarOpen(!ui.sidebarOpen)}
        whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 32, height: 32, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)',
        }}
        className="md:hidden"
      >
        <SidebarSimple size={16} />
      </motion.button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          {pageTitle}
        </span>
        {location === '/today' && (
          <>
            <CaretRight size={12} color="var(--text-tertiary)" />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              {dateStr}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Search */}
        <motion.button
          onClick={() => setCommandPaletteOpen(true)}
          whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            height: 32, padding: '0 10px',
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, cursor: 'pointer',
            fontSize: 12, color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-body)',
          }}
          title="Search (⌘K)"
        >
          <MagnifyingGlass size={13} />
          <span className="hidden sm:inline">Search</span>
          <kbd style={{ fontSize: 10 }}>⌘K</kbd>
        </motion.button>

        {/* Primary action */}
        {pageAction && (
          <motion.button
            onClick={() => toast.info(`${pageAction.label} — use the form below`, { duration: 2000 })}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 32, padding: '0 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-primary)',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: 500,
              color: 'white', fontFamily: 'var(--font-body)',
            }}
            transition={{ duration: DURATIONS.fast }}
          >
            <Plus size={14} weight="bold" />
            <span className="hidden sm:inline">{pageAction.label}</span>
          </motion.button>
        )}

        {/* Notifications */}
        <motion.button
          onClick={() => toast.info('Notifications coming soon', { duration: 2000 })}
          whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 32, height: 32, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell size={15} />
        </motion.button>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 32, height: 32, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon size={15} /> : <Moon size={15} />}
        </motion.button>
      </div>
    </div>
  );
}

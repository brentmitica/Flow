// FLOW Command Palette — ⌘K, glass, fuzzy search
// Design: "Precision Instrument" — keyboard-first, instant results
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  MagnifyingGlass, CheckSquare, FileText, Calendar,
  Target, Timer, ChartBar, Gear, Sun, Tray,
  ArrowRight, Plus
} from '@phosphor-icons/react';
import { useFlowStore } from '../../store/flowStore';
import { DURATIONS, EASINGS } from '../../lib/animations';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: any;
  shortcut?: string;
  action: () => void;
  category: 'navigate' | 'create' | 'task' | 'note';
}

export function CommandPalette() {
  const { ui, setCommandPaletteOpen, tasks, notes } = useFlowStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    if (ui.commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [ui.commandPaletteOpen]);

  const navigationCommands: CommandItem[] = [
    { id: 'nav-inbox', label: 'Go to Inbox', icon: Tray, shortcut: '⌘1', category: 'navigate', action: () => { navigate('/inbox'); close(); } },
    { id: 'nav-today', label: 'Go to Today', icon: Sun, shortcut: '⌘2', category: 'navigate', action: () => { navigate('/today'); close(); } },
    { id: 'nav-tasks', label: 'Go to Tasks', icon: CheckSquare, shortcut: '⌘3', category: 'navigate', action: () => { navigate('/tasks'); close(); } },
    { id: 'nav-calendar', label: 'Go to Calendar', icon: Calendar, shortcut: '⌘4', category: 'navigate', action: () => { navigate('/calendar'); close(); } },
    { id: 'nav-notes', label: 'Go to Notes', icon: FileText, shortcut: '⌘5', category: 'navigate', action: () => { navigate('/notes'); close(); } },
    { id: 'nav-habits', label: 'Go to Habits', icon: Target, shortcut: '⌘6', category: 'navigate', action: () => { navigate('/habits'); close(); } },
    { id: 'nav-focus', label: 'Go to Focus Mode', icon: Timer, shortcut: '⌘F', category: 'navigate', action: () => { navigate('/focus'); close(); } },
    { id: 'nav-analytics', label: 'Go to Analytics', icon: ChartBar, category: 'navigate', action: () => { navigate('/analytics'); close(); } },
    { id: 'nav-settings', label: 'Go to Settings', icon: Gear, category: 'navigate', action: () => { navigate('/settings'); close(); } },
  ];

  const createCommands: CommandItem[] = [
    { id: 'create-task', label: 'New Task', icon: Plus, shortcut: '⌘N', category: 'create', action: () => { navigate('/tasks'); close(); } },
    { id: 'create-note', label: 'New Note', icon: Plus, shortcut: '⌘E', category: 'create', action: () => { navigate('/notes'); close(); } },
  ];

  // Search tasks and notes
  const taskResults: CommandItem[] = query.length > 1
    ? tasks
        .filter(t => t.title.toLowerCase().includes(query.toLowerCase()) && t.status !== 'DONE')
        .slice(0, 5)
        .map(t => ({
          id: `task-${t.id}`,
          label: t.title,
          description: t.project?.name,
          icon: CheckSquare,
          category: 'task' as const,
          action: () => { navigate('/tasks'); close(); },
        }))
    : [];

  const noteResults: CommandItem[] = query.length > 1
    ? notes
        .filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(n => ({
          id: `note-${n.id}`,
          label: n.title,
          description: n.project?.name,
          icon: FileText,
          category: 'note' as const,
          action: () => { navigate(`/notes/${n.id}`); close(); },
        }))
    : [];

  const filteredNav = query
    ? navigationCommands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : navigationCommands;

  const filteredCreate = query
    ? createCommands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : createCommands;

  const allItems = [
    ...(taskResults.length > 0 ? taskResults : []),
    ...(noteResults.length > 0 ? noteResults : []),
    ...filteredCreate,
    ...filteredNav,
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      allItems[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const renderSection = (items: CommandItem[], title: string) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div style={{
          padding: '6px 12px 4px',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-body)',
        }}>
          {title}
        </div>
        {items.map((item, idx) => {
          const globalIdx = allItems.indexOf(item);
          const isSelected = globalIdx === selectedIndex;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setSelectedIndex(globalIdx)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', border: 'none', cursor: 'pointer',
                background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                borderRadius: 6, margin: '1px 4px',
                fontFamily: 'var(--font-body)',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon
                  size={14}
                  color={isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'}
                />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{
                  fontSize: 'var(--text-sm)', fontWeight: 400,
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                  {item.label}
                </div>
                {item.description && (
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {item.description}
                  </div>
                )}
              </div>
              {item.shortcut && (
                <kbd style={{ fontSize: 10 }}>{item.shortcut}</kbd>
              )}
              {isSelected && (
                <ArrowRight size={12} color="var(--text-tertiary)" />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {ui.commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: DURATIONS.normal, ease: EASINGS.enter }}
            className="glass"
            style={{
              position: 'fixed',
              top: '15vh', left: '50%',
              transform: 'translateX(-50%)',
              width: 560, maxWidth: 'calc(100vw - 32px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-lg)',
              zIndex: 101,
              overflow: 'hidden',
            }}
          >
            {/* Search input */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <MagnifyingGlass size={16} color="var(--text-secondary)" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or jump to..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  background: 'transparent',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <kbd style={{ fontSize: 10 }}>Esc</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 400, overflowY: 'auto', padding: '4px 0' }}>
              {allItems.length === 0 && query ? (
                <div style={{
                  padding: '24px 16px', textAlign: 'center',
                  fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)',
                }}>
                  No results for "{query}"
                </div>
              ) : (
                <>
                  {taskResults.length > 0 && renderSection(taskResults, 'Tasks')}
                  {noteResults.length > 0 && renderSection(noteResults, 'Notes')}
                  {filteredCreate.length > 0 && renderSection(filteredCreate, 'Create')}
                  {filteredNav.length > 0 && renderSection(filteredNav, 'Navigate')}
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 11, color: 'var(--text-tertiary)',
            }}>
              <span><kbd style={{ fontSize: 9 }}>↑↓</kbd> navigate</span>
              <span><kbd style={{ fontSize: 9 }}>↵</kbd> select</span>
              <span><kbd style={{ fontSize: 9 }}>Esc</kbd> close</span>
              <span style={{ marginLeft: 'auto' }}>
                {allItems.length} result{allItems.length !== 1 ? 's' : ''}
                {query && ` for "${query}"`}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// FLOW Tasks Page — List, Board, and project views
// Design: "Precision Instrument" — dense, keyboard-first, amber accents
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  CheckSquare, Plus, Funnel, List, SquaresFour,
  Calendar, ArrowsDownUp, MagnifyingGlass, X,
  Circle, CircleHalf, CheckCircle, Warning
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition, listContainerVariants, listItemVariants } from '../lib/animations';
import { TaskItem } from '../components/tasks/TaskItem';
import { toast } from 'sonner';
import type { Priority, TaskStatus } from '../lib/types';

type ViewMode = 'list' | 'board';
type FilterStatus = 'all' | 'todo' | 'in_progress' | 'done';

const PRIORITY_ORDER: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3, NONE: 4 };

const STATUS_COLUMNS = [
  { id: 'TODO', label: 'To Do', icon: Circle, color: 'var(--text-tertiary)' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: CircleHalf, color: 'var(--info)' },
  { id: 'DONE', label: 'Done', icon: CheckCircle, color: 'var(--success)' },
];

export default function TasksPage() {
  const { tasks, projects, addTask } = useFlowStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');

  // Filter tasks
  const filteredTasks = tasks
    .filter(t => {
      if (filterStatus === 'todo') return t.status === 'TODO';
      if (filterStatus === 'in_progress') return t.status === 'IN_PROGRESS';
      if (filterStatus === 'done') return t.status === 'DONE';
      return t.status !== 'CANCELLED';
    })
    .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      status: 'TODO',
      priority: selectedPriority,
      order: tasks.length,
    });
    toast.success('Task added', { duration: 1500 });
    setNewTaskTitle('');
    setShowNewTask(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask();
    if (e.key === 'Escape') { setShowNewTask(false); setNewTaskTitle(''); }
  };

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<string, typeof tasks>);

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
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 2,
          }}>
            All Tasks
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {filteredTasks.filter(t => t.status !== 'DONE').length} remaining · {filteredTasks.filter(t => t.status === 'DONE').length} completed
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, padding: 2,
          }}>
            {[
              { mode: 'list' as ViewMode, icon: List },
              { mode: 'board' as ViewMode, icon: SquaresFour },
            ].map(({ mode, icon: Icon }) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode)}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 28, height: 26, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: viewMode === mode ? 'var(--bg-surface)' : 'transparent',
                  border: viewMode === mode ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer',
                  color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: viewMode === mode ? 'var(--shadow-xs)' : 'none',
                }}
              >
                <Icon size={14} />
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setShowNewTask(true)}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 32, padding: '0 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-primary)',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'white',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Plus size={14} weight="bold" />
            New Task
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 6, flex: '0 0 200px',
        }}>
          <MagnifyingGlass size={13} color="var(--text-tertiary)" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter tasks..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status filters */}
        {[
          { value: 'all', label: 'All' },
          { value: 'todo', label: 'To Do' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'done', label: 'Done' },
        ].map(filter => (
          <motion.button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value as FilterStatus)}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 30, padding: '0 10px',
              background: filterStatus === filter.value ? 'var(--accent-subtle)' : 'var(--bg-surface)',
              border: `1px solid ${filterStatus === filter.value ? 'var(--accent-primary)' : 'var(--border-default)'}`,
              borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: filterStatus === filter.value ? 500 : 400,
              color: filterStatus === filter.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* New Task Input */}
      <AnimatePresence>
        {showNewTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 16, overflow: 'hidden' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-focus)',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '1.5px solid var(--border-strong)',
                flexShrink: 0,
              }} />
              <input
                autoFocus
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task title... (try 'Call dentist tomorrow 3pm')"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                }}
              />
              {/* Priority selector */}
              <div style={{ display: 'flex', gap: 4 }}>
                {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: selectedPriority === p
                        ? (p === 'URGENT' ? '#DC2626' : p === 'HIGH' ? '#D97706' : p === 'MEDIUM' ? '#6B6B65' : '#9B9B95')
                        : 'var(--bg-elevated)',
                      border: 'none', cursor: 'pointer',
                      fontSize: 9, color: selectedPriority === p ? 'white' : 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                    title={p}
                  >
                    {p[0]}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleAddTask}
                  style={{
                    height: 28, padding: '0 10px',
                    background: 'var(--accent-primary)', border: 'none',
                    borderRadius: 5, cursor: 'pointer',
                    fontSize: 12, color: 'white', fontFamily: 'var(--font-body)',
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowNewTask(false); setNewTaskTitle(''); }}
                  style={{
                    height: 28, padding: '0 8px',
                    background: 'transparent', border: '1px solid var(--border-default)',
                    borderRadius: 5, cursor: 'pointer',
                    fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List View */}
      {viewMode === 'list' && (
        <div>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '48px 24px', textAlign: 'center',
                border: '1px dashed var(--border-default)',
                borderRadius: 10,
              }}
            >
              <CheckSquare size={32} color="var(--text-tertiary)" weight="duotone" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>
                No tasks here
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                Everything's done, or nothing's started.
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
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      )}

      {/* Board View */}
      {viewMode === 'board' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}>
          {STATUS_COLUMNS.map(col => {
            const colTasks = tasksByStatus[col.id] || [];
            const Icon = col.icon;
            return (
              <div key={col.id} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Column header */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} color={col.color} weight="duotone" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {col.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                    background: 'var(--bg-elevated)',
                    padding: '1px 6px', borderRadius: 4,
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div style={{ padding: '8px', minHeight: 100 }}>
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <motion.div
                        key={task.id}
                        variants={listItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{
                          padding: '10px 12px',
                          background: 'var(--bg-base)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 8, marginBottom: 6,
                          cursor: 'pointer',
                        }}
                        whileHover={{ borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-sm)' }}
                      >
                        <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4 }}>
                          {task.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {task.project && (
                            <span style={{
                              fontSize: 10, padding: '1px 5px', borderRadius: 3,
                              background: `${task.project.color}22`, color: task.project.color,
                              fontWeight: 500,
                            }}>
                              {task.project.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
                    onClick={() => setShowNewTask(true)}
                    style={{
                      width: '100%', height: 32,
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: 12, color: 'var(--text-tertiary)',
                      borderRadius: 6, padding: '0 8px',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Plus size={12} />
                    Add task
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

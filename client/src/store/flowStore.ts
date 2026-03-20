// FLOW Global State Store — Zustand
import { create } from 'zustand';
import type { Task, Note, Habit, Project, InboxItem, CalendarEvent, FocusSession, User } from '../lib/types';
import {
  mockTasks, mockNotes, mockHabits, mockProjects,
  mockInboxItems, mockCalendarEvents, mockFocusSessions, mockUser
} from '../lib/mockData';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelContent: 'task' | 'note' | 'ai' | null;
  selectedTaskId: string | null;
  selectedNoteId: string | null;
  commandPaletteOpen: boolean;
  activeView: string;
  focusModeActive: boolean;
}

interface FlowStore {
  // User
  user: User;
  
  // Data
  tasks: Task[];
  notes: Note[];
  habits: Habit[];
  projects: Project[];
  inboxItems: InboxItem[];
  calendarEvents: CalendarEvent[];
  focusSessions: FocusSession[];
  
  // UI State
  ui: UIState;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Habit actions
  toggleHabit: (id: string) => void;
  
  // Inbox actions
  addInboxItem: (content: string) => void;
  processInboxItem: (id: string) => void;
  deleteInboxItem: (id: string) => void;
  
  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setRightPanel: (open: boolean, content?: 'task' | 'note' | 'ai' | null) => void;
  setSelectedTask: (id: string | null) => void;
  setSelectedNote: (id: string | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  setFocusModeActive: (active: boolean) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFlowStore = create<FlowStore>((set) => ({
  user: mockUser,
  tasks: mockTasks,
  notes: mockNotes,
  habits: mockHabits,
  projects: mockProjects,
  inboxItems: mockInboxItems,
  calendarEvents: mockCalendarEvents,
  focusSessions: mockFocusSessions,
  
  ui: {
    sidebarOpen: true,
    rightPanelOpen: false,
    rightPanelContent: null,
    selectedTaskId: null,
    selectedNoteId: null,
    commandPaletteOpen: false,
    activeView: 'today',
    focusModeActive: false,
  },
  
  // Task actions
  addTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id
      ? { ...t, ...updates, updatedAt: new Date().toISOString() }
      : t
    ),
  })),
  
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id
      ? { ...t, status: 'DONE', completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      : t
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id),
  })),
  
  // Note actions
  addNote: (noteData) => set((state) => ({
    notes: [...state.notes, {
      ...noteData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map(n => n.id === id
      ? { ...n, ...updates, updatedAt: new Date().toISOString() }
      : n
    ),
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id),
  })),
  
  // Habit actions
  toggleHabit: (id) => set((state) => ({
    habits: state.habits.map(h => {
      if (h.id !== id) return h;
      const todayStr = new Date().toISOString().split('T')[0];
      const wasCompleted = h.completedToday;
      return {
        ...h,
        completedToday: !wasCompleted,
        currentStreak: wasCompleted ? Math.max(0, h.currentStreak - 1) : h.currentStreak + 1,
        completedDates: wasCompleted
          ? h.completedDates.filter(d => d !== todayStr)
          : [todayStr, ...h.completedDates],
      };
    }),
  })),
  
  // Inbox actions
  addInboxItem: (content) => set((state) => ({
    inboxItems: [{
      id: generateId(),
      content,
      type: 'UNPROCESSED',
      processed: false,
      createdAt: new Date().toISOString(),
    }, ...state.inboxItems],
  })),
  
  processInboxItem: (id) => set((state) => ({
    inboxItems: state.inboxItems.map(item =>
      item.id === id ? { ...item, processed: true } : item
    ),
  })),
  
  deleteInboxItem: (id) => set((state) => ({
    inboxItems: state.inboxItems.filter(item => item.id !== id),
  })),
  
  // UI actions
  setSidebarOpen: (open) => set((state) => ({ ui: { ...state.ui, sidebarOpen: open } })),
  setRightPanel: (open, content = null) => set((state) => ({
    ui: { ...state.ui, rightPanelOpen: open, rightPanelContent: open ? content : null }
  })),
  setSelectedTask: (id) => set((state) => ({ ui: { ...state.ui, selectedTaskId: id } })),
  setSelectedNote: (id) => set((state) => ({ ui: { ...state.ui, selectedNoteId: id } })),
  setCommandPaletteOpen: (open) => set((state) => ({ ui: { ...state.ui, commandPaletteOpen: open } })),
  setActiveView: (view) => set((state) => ({ ui: { ...state.ui, activeView: view } })),
  setFocusModeActive: (active) => set((state) => ({ ui: { ...state.ui, focusModeActive: active } })),
}));

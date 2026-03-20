// FLOW Type Definitions

export type TaskStatus = 'INBOX' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'DEFERRED';
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
export type HabitFrequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';
export type FocusType = 'POMODORO' | 'DEEP_WORK' | 'CUSTOM';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: ProjectStatus;
  taskCount?: number;
  completedCount?: number;
}

export interface Area {
  id: string;
  name: string;
  icon?: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  startDate?: string;
  scheduledAt?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  completedAt?: string;
  isRecurring?: boolean;
  projectId?: string;
  project?: Project;
  areaId?: string;
  parentTaskId?: string;
  subTasks?: Task[];
  tags?: Tag[];
  order: number;
  aiScheduled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: any;
  contentText?: string;
  projectId?: string;
  project?: Project;
  tags?: Tag[];
  isPinned?: boolean;
  isFavorite?: boolean;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completedDates: string[];
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  count: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  color: string;
  source: 'flow' | 'google';
  taskId?: string;
}

export interface InboxItem {
  id: string;
  content: string;
  type: 'TASK' | 'NOTE' | 'EVENT' | 'IDEA' | 'UNPROCESSED';
  processed: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  task?: Task;
  type: FocusType;
  startedAt: string;
  endedAt?: string;
  durationMin?: number;
  completed: boolean;
  ambientSound?: string;
}

export interface Analytics {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  focusMinutes: number;
  pomodorosCompleted: number;
  habitsCompleted: number;
  habitsTotal: number;
  productivityScore: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  timezone: string;
  workStartHour: number;
  workEndHour: number;
  productivityScore: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  karmaPoints: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  avatar?: string;
  roles: UserRole[];
  currentRole: UserRole;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  visible: boolean;
  disabled: boolean;
  order: number;
}

export interface MenuConfig {
  id: string;
  name: string;
  role: UserRole | 'custom';
  items: MenuItem[];
  isDefault: boolean;
}

export interface AvailableModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'operations' | 'hr' | 'analytics' | 'communication' | 'other';
  path: string;
  isActive: boolean;
  isPremium?: boolean;
  features: string[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  status: 'pending' | 'in-progress' | 'completed';
  template?: 'summer' | 'winter';
  images: string[];
  createdAt: string;
  dueDate?: string;
}

export interface Incident {
  id: string;
  name: string;
  description: string;
  reportedBy: string;
  assignedTo: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  images: string[];
  createdAt: string;
  resolvedAt?: string;
}

export interface HistoryRecord {
  id: string;
  type: 'task' | 'incident';
  name: string;
  equipment?: string;
  user: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'resolved' | 'cancelled';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface Message {
  id: string;
  subject: string;
  body: string;
  from: string;
  createdAt: string;
  read: boolean;
  priority: 'normal' | 'important' | 'urgent';
}

export interface Publication {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  updatedAt?: string;
  type: 'notice' | 'training' | 'info';
  coverImage?: string;
  read: boolean;
  isNew: boolean;
  audience: 'all' | UserRole | string;
  attachments?: string[];
}

export interface FeatureFlags {
  tasks: boolean;
  incidents: boolean;
  history: boolean;
  exams: boolean;
  messages: boolean;
  publications: boolean;
  administration: boolean;
}
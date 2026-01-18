import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, MenuConfig, FeatureFlags } from '@/app/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, company?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  menuConfigs: MenuConfig[];
  updateMenuConfig: (config: MenuConfig) => void;
  featureFlags: FeatureFlags;
  updateFeatureFlags: (flags: Partial<FeatureFlags>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultMenuConfigs: MenuConfig[] = [
  {
    id: 'admin-menu',
    name: 'Menú Admin',
    role: 'admin',
    isDefault: true,
    items: [
      { id: 'tasks', label: 'Tareas', icon: 'CheckSquare', path: '/tasks', visible: true, disabled: false, order: 1 },
      { id: 'incidents', label: 'Incidencias', icon: 'AlertCircle', path: '/incidents', visible: true, disabled: false, order: 2 },
      { id: 'history', label: 'Histórico', icon: 'History', path: '/history', visible: true, disabled: false, order: 3 },
      { id: 'exams', label: 'Exámenes', icon: 'GraduationCap', path: '/exams', visible: true, disabled: false, order: 4 },
      { id: 'messages', label: 'Mensajes', icon: 'Mail', path: '/messages', visible: true, disabled: false, order: 5 },
      { id: 'publications', label: 'Publicaciones', icon: 'FileText', path: '/publications', visible: true, disabled: false, order: 6 },
      { id: 'administration', label: 'Administración', icon: 'Settings', path: '/administration', visible: true, disabled: false, order: 7 },
    ]
  },
  {
    id: 'manager-menu',
    name: 'Menú Manager',
    role: 'manager',
    isDefault: true,
    items: [
      { id: 'tasks', label: 'Tareas', icon: 'CheckSquare', path: '/tasks', visible: true, disabled: false, order: 1 },
      { id: 'incidents', label: 'Incidencias', icon: 'AlertCircle', path: '/incidents', visible: true, disabled: false, order: 2 },
      { id: 'history', label: 'Histórico', icon: 'History', path: '/history', visible: true, disabled: false, order: 3 },
      { id: 'exams', label: 'Exámenes', icon: 'GraduationCap', path: '/exams', visible: true, disabled: false, order: 4 },
      { id: 'messages', label: 'Mensajes', icon: 'Mail', path: '/messages', visible: true, disabled: false, order: 5 },
      { id: 'publications', label: 'Publicaciones', icon: 'FileText', path: '/publications', visible: true, disabled: false, order: 6 },
    ]
  },
  {
    id: 'employee-menu',
    name: 'Menú Empleado',
    role: 'employee',
    isDefault: true,
    items: [
      { id: 'tasks', label: 'Tareas', icon: 'CheckSquare', path: '/tasks', visible: true, disabled: false, order: 1 },
      { id: 'incidents', label: 'Incidencias', icon: 'AlertCircle', path: '/incidents', visible: true, disabled: false, order: 2 },
      { id: 'exams', label: 'Exámenes', icon: 'GraduationCap', path: '/exams', visible: true, disabled: false, order: 3 },
      { id: 'messages', label: 'Mensajes', icon: 'Mail', path: '/messages', visible: true, disabled: false, order: 4 },
      { id: 'publications', label: 'Publicaciones', icon: 'FileText', path: '/publications', visible: true, disabled: false, order: 5 },
    ]
  }
];

const defaultFeatureFlags: FeatureFlags = {
  tasks: true,
  incidents: true,
  history: true,
  exams: true,
  messages: true,
  publications: true,
  administration: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>(defaultMenuConfigs);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(defaultFeatureFlags);

  const login = async (email: string, password: string, company?: string) => {
    // Mock login - en producción esto llamaría a una API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determinar roles basado en el email (mock)
    let roles: UserRole[] = ['employee'];
    if (email.includes('admin')) {
      roles = ['admin', 'manager', 'employee'];
    } else if (email.includes('manager')) {
      roles = ['manager', 'employee'];
    }

    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
      company: company || 'Mi Empresa',
      roles,
      currentRole: roles[0],
      avatar: undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setUser({ ...user, currentRole: role });
    }
  };

  const updateMenuConfig = (config: MenuConfig) => {
    setMenuConfigs(prev => {
      const index = prev.findIndex(c => c.id === config.id);
      if (index >= 0) {
        const newConfigs = [...prev];
        newConfigs[index] = config;
        return newConfigs;
      }
      return [...prev, config];
    });
  };

  const updateFeatureFlags = (flags: Partial<FeatureFlags>) => {
    setFeatureFlags(prev => ({ ...prev, ...flags }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        menuConfigs,
        updateMenuConfig,
        featureFlags,
        updateFeatureFlags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

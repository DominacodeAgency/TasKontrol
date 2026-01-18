import { useAuth } from '@/app/context/AuthContext';
import { cn } from '@/app/components/ui/utils';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { MenuItem } from '@/app/types';

interface AppSidebarProps {
  currentView: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export function AppSidebar({ currentView, onNavigate, className }: AppSidebarProps) {
  const { user, menuConfigs, featureFlags } = useAuth();

  if (!user) return null;

  // Obtener el menú correspondiente al rol actual
  const currentMenu = menuConfigs.find(m => m.role === user.currentRole);
  if (!currentMenu) return null;

  // Filtrar items según feature flags
  const visibleItems = currentMenu.items
    .filter(item => item.visible)
    .filter(item => {
      const featureKey = item.id as keyof typeof featureFlags;
      return featureFlags[featureKey] !== false;
    })
    .sort((a, b) => a.order - b.order);

  const getIcon = (iconName: string): LucideIcon => {
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.Circle;
  };

  return (
    <aside className={cn(
      'bg-card border-r border-border flex flex-col',
      className
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icons.Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">OptiControl</h2>
            <p className="text-xs text-muted-foreground">{user.company}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = getIcon(item.icon);
          const isActive = currentView === item.path;

          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavigate(item.path)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                'hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
                !isActive && 'text-foreground'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-1">Rol activo</div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            user.currentRole === 'admin' && 'bg-purple-100 text-purple-700',
            user.currentRole === 'manager' && 'bg-blue-100 text-blue-700',
            user.currentRole === 'employee' && 'bg-green-100 text-green-700'
          )}>
            {user.currentRole === 'admin' && 'Administrador'}
            {user.currentRole === 'manager' && 'Manager'}
            {user.currentRole === 'employee' && 'Empleado'}
          </div>
        </div>
      </div>
    </aside>
  );
}

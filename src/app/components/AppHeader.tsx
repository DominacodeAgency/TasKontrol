import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Menu, User, LogOut, Users, ChevronRight } from 'lucide-react';
import { UserRole } from '@/app/types';
import { toast } from 'sonner';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  if (!user) return null;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleDialog(false);
    toast.success('Perfil cambiado', {
      description: `Ahora estás usando el perfil de ${
        role === 'admin' ? 'Administrador' : role === 'manager' ? 'Manager' : 'Empleado'
      }`,
    });
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrador',
          description: 'Acceso completo al sistema',
          icon: '👑',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'manager':
        return {
          label: 'Manager',
          description: 'Gestión de equipos y tareas',
          icon: '👔',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'employee':
        return {
          label: 'Empleado',
          description: 'Acceso a tareas asignadas',
          icon: '👤',
          color: 'bg-green-100 text-green-700 border-green-200',
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Company name - Desktop only */}
        <div className="hidden md:block">
          <h2 className="font-semibold text-foreground">{user.company}</h2>
          <p className="text-xs text-muted-foreground">Sistema de Gestión Operativa</p>
        </div>

        {/* Mobile company name */}
        <div className="md:hidden">
          <h2 className="text-sm font-semibold text-foreground">{user.company}</h2>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 h-auto py-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getRoleInfo(user.currentRole).label}
                </div>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            {user.roles.length > 1 && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowRoleDialog(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Cambiar perfil
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Role switch dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar perfil</DialogTitle>
            <DialogDescription>
              Selecciona el perfil con el que deseas trabajar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {user.roles.map((role) => {
              const roleInfo = getRoleInfo(role);
              const isActive = role === user.currentRole;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  disabled={isActive}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  } disabled:cursor-default`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${roleInfo.color} flex items-center justify-center text-2xl border`}>
                      {roleInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{roleInfo.label}</div>
                      <div className="text-sm text-muted-foreground">{roleInfo.description}</div>
                    </div>
                    {isActive && (
                      <div className="text-xs font-medium text-primary">Activo</div>
                    )}
                    {!isActive && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

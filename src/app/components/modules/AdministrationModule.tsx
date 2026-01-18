import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { MenuEditor } from '@/app/components/modules/admin/MenuEditor';
import { ModulesManager } from '@/app/components/modules/admin/ModulesManager';
import { useAuth } from '@/app/context/AuthContext';
import { Settings, Users, UserCheck, Menu as MenuIcon, ToggleLeft, Shield, Package } from 'lucide-react';
import { toast } from 'sonner';

export function AdministrationModule() {
  const { featureFlags, updateFeatureFlags } = useAuth();

  const handleFeatureToggle = (feature: keyof typeof featureFlags) => {
    const newValue = !featureFlags[feature];
    updateFeatureFlags({ [feature]: newValue });
    toast.success(
      newValue ? 'Módulo activado' : 'Módulo desactivado',
      {
        description: `El módulo ha sido ${newValue ? 'activado' : 'desactivado'} correctamente`,
      }
    );
  };

  const featureList = [
    { key: 'tasks' as const, label: 'Tareas', icon: '✓', description: 'Gestión de tareas y asignaciones' },
    { key: 'incidents' as const, label: 'Incidencias', icon: '⚠️', description: 'Reportes y seguimiento de incidencias' },
    { key: 'history' as const, label: 'Histórico', icon: '📊', description: 'Análisis de registros históricos' },
    { key: 'exams' as const, label: 'Exámenes', icon: '🎓', description: 'Evaluaciones y formación' },
    { key: 'messages' as const, label: 'Mensajes', icon: '✉️', description: 'Comunicaciones internas' },
    { key: 'publications' as const, label: 'Publicaciones', icon: '📄', description: 'Contenido y novedades' },
    { key: 'administration' as const, label: 'Administración', icon: '⚙️', description: 'Panel de administración' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Administración</h1>
        <p className="text-sm text-muted-foreground">
          Configuración y gestión del sistema
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:w-auto">
          <TabsTrigger value="modules">
            <Package className="w-4 h-4 mr-2" />
            Módulos
          </TabsTrigger>
          <TabsTrigger value="menu">
            <MenuIcon className="w-4 h-4 mr-2" />
            Menú
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="w-4 h-4 mr-2" />
            Permisos
          </TabsTrigger>
          <TabsTrigger value="features">
            <ToggleLeft className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* Modules Manager Tab */}
        <TabsContent value="modules" className="space-y-6">
          <ModulesManager />
        </TabsContent>

        {/* Menu Editor Tab */}
        <TabsContent value="menu" className="space-y-6">
          <MenuEditor />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        JD
                      </div>
                      <div>
                        <h4 className="font-medium">Juan Pérez</h4>
                        <p className="text-sm text-muted-foreground">admin@empresa.com</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      Administrador
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        MG
                      </div>
                      <div>
                        <h4 className="font-medium">María García</h4>
                        <p className="text-sm text-muted-foreground">manager@empresa.com</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Manager
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                        CL
                      </div>
                      <div>
                        <h4 className="font-medium">Carlos López</h4>
                        <p className="text-sm text-muted-foreground">empleado@empresa.com</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Empleado
                    </Badge>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  <Users className="w-4 h-4 mr-2" />
                  Agregar usuario
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitudes pendientes</CardTitle>
              <CardDescription>
                Aprueba o rechaza nuevas solicitudes de registro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No hay solicitudes pendientes
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de permisos</CardTitle>
              <CardDescription>
                Define los permisos por rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Admin permissions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-medium">Administrador</h4>
                  </div>
                  <div className="pl-5 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Acceso completo al sistema</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Gestión de usuarios y roles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Configuración del sistema</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Creación y asignación de tareas</span>
                    </div>
                  </div>
                </div>

                {/* Manager permissions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <h4 className="font-medium">Manager</h4>
                  </div>
                  <div className="pl-5 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Gestión de tareas de su equipo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Visualización de históricos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Gestión de incidencias</span>
                    </div>
                  </div>
                </div>

                {/* Employee permissions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h4 className="font-medium">Empleado</h4>
                  </div>
                  <div className="pl-5 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Visualización de tareas asignadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Reporte de incidencias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span>Realización de exámenes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Activa o desactiva módulos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureList.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-medium">{feature.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          featureFlags[feature.key]
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }
                      >
                        {featureFlags[feature.key] ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Switch
                        checked={featureFlags[feature.key]}
                        onCheckedChange={() => handleFeatureToggle(feature.key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Información sobre Feature Flags
                  </h4>
                  <p className="text-sm text-blue-700">
                    Los módulos desactivados no aparecerán en el menú de navegación y no estarán
                    accesibles para ningún usuario. Los cambios se aplican inmediatamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
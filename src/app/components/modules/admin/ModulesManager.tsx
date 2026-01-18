import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AvailableModule } from '@/app/types';
import { availableModules, getCategoryLabel, getCategoryColor } from '@/app/data/availableModules';
import * as Icons from 'lucide-react';
import { Search, Filter, Crown, Check, Info, Sparkles, Package, Wrench, CheckCircle2, Palmtree, Wallet, LayoutDashboard, FileBarChart, Megaphone, Users2, TrendingUp, ClipboardList, Receipt, CalendarCheck, FolderOpen, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';

type CategoryFilter = 'all' | 'productivity' | 'operations' | 'hr' | 'analytics' | 'communication' | 'other';

export function ModulesManager() {
  const { menuConfigs, updateMenuConfig } = useAuth();
  const [modules, setModules] = useState<AvailableModule[]>(availableModules);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AvailableModule | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const activeModulesCount = modules.filter(m => m.isActive).length;
  const totalModulesCount = modules.length;

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    const matchesActive = !showActiveOnly || module.isActive;
    return matchesSearch && matchesCategory && matchesActive;
  });

  const toggleModule = (moduleId: string) => {
    setModules(prevModules =>
      prevModules.map(m =>
        m.id === moduleId ? { ...m, isActive: !m.isActive } : m
      )
    );

    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    // Actualizar menús para agregar/quitar el módulo
    menuConfigs.forEach(menuConfig => {
      const menuItem = {
        id: module.id,
        label: module.name,
        icon: module.icon,
        path: module.path,
        visible: true,
        disabled: false,
        order: menuConfig.items.length + 1,
      };

      if (!module.isActive) {
        // Activar: agregar a todos los menús
        if (!menuConfig.items.find(item => item.id === module.id)) {
          updateMenuConfig({
            ...menuConfig,
            items: [...menuConfig.items, menuItem],
          });
        }
        toast.success(`${module.name} activado`, {
          description: 'El módulo ha sido agregado a todos los menús',
        });
      } else {
        // Desactivar: eliminar de todos los menús
        updateMenuConfig({
          ...menuConfig,
          items: menuConfig.items.filter(item => item.id !== module.id),
        });
        toast.success(`${module.name} desactivado`, {
          description: 'El módulo ha sido eliminado de todos los menús',
        });
      }
    });
  };

  const showModuleDetails = (module: AvailableModule) => {
    setSelectedModule(module);
    setShowDetailsDialog(true);
  };

  const groupedByCategory = filteredModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, AvailableModule[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Módulos</h1>
          <p className="text-sm text-muted-foreground">
            Activa o desactiva módulos para personalizar tu plataforma
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Package className="w-3 h-3 mr-1" />
            {activeModulesCount} / {totalModulesCount} activos
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{activeModulesCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold">{totalModulesCount - activeModulesCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="text-2xl font-bold">
                  {modules.filter(m => m.isPremium).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categorías</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
            >
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="productivity">Productividad</SelectItem>
                <SelectItem value="operations">Operaciones</SelectItem>
                <SelectItem value="hr">Recursos Humanos</SelectItem>
                <SelectItem value="analytics">Análisis</SelectItem>
                <SelectItem value="communication">Comunicación</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 px-4 py-2 border rounded-md">
              <Switch
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <label className="text-sm">Solo activos</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid - Grouped by Category */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-1">No se encontraron módulos</h3>
            <p className="text-sm text-muted-foreground">
              Intenta cambiar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedByCategory).map(([category, categoryModules]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{getCategoryLabel(category)}</h2>
              <Badge variant="outline" className="text-xs">
                {categoryModules.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryModules.map((module) => {
                const Icon = (Icons as any)[module.icon] || Icons.Package;
                return (
                  <Card
                    key={module.id}
                    className={`relative transition-all ${
                      module.isActive
                        ? 'border-primary shadow-md'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            module.isActive ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              module.isActive ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{module.name}</CardTitle>
                              {module.isPremium && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCategoryColor(module.category)}`}
                            >
                              {getCategoryLabel(module.category)}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={module.isActive}
                          onCheckedChange={() => toggleModule(module.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="line-clamp-2">
                        {module.description}
                      </CardDescription>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Características:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {module.features.slice(0, 3).map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {module.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{module.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => showModuleDetails(module)}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedModule && (
                <>
                  {(() => {
                    const Icon = (Icons as any)[selectedModule.icon] || Icons.Package;
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()}
                  {selectedModule.name}
                  {selectedModule.isPremium && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedModule?.description}</DialogDescription>
          </DialogHeader>

          {selectedModule && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={getCategoryColor(selectedModule.category)}
                >
                  {getCategoryLabel(selectedModule.category)}
                </Badge>
                <Badge variant={selectedModule.isActive ? 'default' : 'outline'}>
                  {selectedModule.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Características completas:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedModule.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Información técnica:</h4>
                <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                  <p><strong>ID:</strong> {selectedModule.id}</p>
                  <p><strong>Ruta:</strong> {selectedModule.path}</p>
                  <p><strong>Icono:</strong> {selectedModule.icon}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    toggleModule(selectedModule.id);
                    setShowDetailsDialog(false);
                  }}
                >
                  {selectedModule.isActive ? 'Desactivar' : 'Activar'} módulo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
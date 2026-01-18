import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useAuth } from '@/app/context/AuthContext';
import { MenuConfig, MenuItem, UserRole } from '@/app/types';
import * as Icons from 'lucide-react';
import { GripVertical, Plus, Copy, Trash2, Eye, EyeOff, Save, AlertCircle, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { toast } from 'sonner';

// Lista de iconos disponibles (minimalistas de lucide-react)
const availableIcons = [
  'CheckSquare', 'AlertCircle', 'History', 'BookOpen', 'MessageSquare',
  'FileText', 'Settings', 'Users', 'BarChart3', 'Calendar',
  'Clipboard', 'Clock', 'Database', 'FolderOpen', 'Home',
  'Layout', 'List', 'Mail', 'PieChart', 'Sparkles',
  'Target', 'TrendingUp', 'Zap', 'Bell', 'Flag'
];

interface DraggableMenuItemProps {
  item: MenuItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onToggleVisible: (id: string) => void;
  onToggleDisabled: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function DraggableMenuItem({ 
  item, 
  index, 
  moveItem, 
  onToggleVisible, 
  onToggleDisabled, 
  onDelete,
  onEdit,
  isExpanded,
  onToggleExpand
}: DraggableMenuItemProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'menu-item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'menu-item',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const Icon = (Icons as any)[item.icon] || Icons.Circle;

  return (
    <div className={`${isDragging ? 'opacity-50' : ''}`}>
      <div 
        ref={(node) => drag(drop(node))}
        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
      >
        <div ref={preview}>
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        </div>
        
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-accent rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1 font-medium text-sm">{item.label}</span>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisible(item.id)}
            title={item.visible ? 'Ocultar' : 'Mostrar'}
            className="h-7 w-7 p-0"
          >
            {item.visible ? (
              <Eye className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
          <Switch
            checked={!item.disabled}
            onCheckedChange={() => onToggleDisabled(item.id)}
            disabled={!item.visible}
          />
        </div>
      </div>

      {/* Expanded options */}
      {isExpanded && (
        <div className="ml-10 mt-2 p-3 bg-muted/50 border border-border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">ID: {item.id}</p>
              <p className="text-xs text-muted-foreground">Ruta: {item.path}</p>
              <p className="text-xs text-muted-foreground">Icono: {item.icon}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item.id)}
                className="h-7"
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-7"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MenuEditor() {
  const { menuConfigs, updateMenuConfig } = useAuth();
  const [selectedMenuId, setSelectedMenuId] = useState<string>(menuConfigs[0]?.id || '');
  const [editingMenu, setEditingMenu] = useState<MenuConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const selectedMenu = menuConfigs.find(m => m.id === selectedMenuId);

  const startEditing = (menu: MenuConfig) => {
    setEditingMenu({ ...menu, items: [...menu.items] });
    setHasChanges(false);
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    if (!editingMenu) return;

    const items = [...editingMenu.items];
    const [removed] = items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, removed);

    // Actualizar el orden
    items.forEach((item, index) => {
      item.order = index + 1;
    });

    setEditingMenu({ ...editingMenu, items });
    setHasChanges(true);
  };

  const toggleVisible = (itemId: string) => {
    if (!editingMenu) return;

    setEditingMenu({
      ...editingMenu,
      items: editingMenu.items.map(item =>
        item.id === itemId ? { ...item, visible: !item.visible } : item
      ),
    });
    setHasChanges(true);
  };

  const toggleDisabled = (itemId: string) => {
    if (!editingMenu) return;

    setEditingMenu({
      ...editingMenu,
      items: editingMenu.items.map(item =>
        item.id === itemId ? { ...item, disabled: !item.disabled } : item
      ),
    });
    setHasChanges(true);
  };

  const deleteItem = (itemId: string) => {
    if (!editingMenu) return;

    if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
      setEditingMenu({
        ...editingMenu,
        items: editingMenu.items.filter(item => item.id !== itemId),
      });
      setHasChanges(true);
      toast.success('Item eliminado');
    }
  };

  const startEditingItem = (itemId: string) => {
    setEditingItemId(itemId);
    setShowEditItemDialog(true);
  };

  const saveChanges = () => {
    if (!editingMenu) return;

    updateMenuConfig(editingMenu);
    setHasChanges(false);
    toast.success('Menú actualizado', {
      description: 'Los cambios han sido guardados correctamente',
    });
  };

  const duplicateMenu = (menu: MenuConfig) => {
    const newMenu: MenuConfig = {
      ...menu,
      id: `${menu.id}-copy-${Date.now()}`,
      name: `${menu.name} (Copia)`,
      role: 'custom',
      isDefault: false,
    };

    updateMenuConfig(newMenu);
    setSelectedMenuId(newMenu.id);
    toast.success('Menú duplicado', {
      description: 'Se ha creado una copia del menú',
    });
  };

  const handleCreateMenu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newMenu: MenuConfig = {
      id: `menu-${Date.now()}`,
      name: formData.get('name') as string,
      role: formData.get('role') as UserRole,
      isDefault: false,
      items: [
        { id: 'tasks', label: 'Tareas', icon: 'CheckSquare', path: '/tasks', visible: true, disabled: false, order: 1 },
        { id: 'incidents', label: 'Incidencias', icon: 'AlertCircle', path: '/incidents', visible: true, disabled: false, order: 2 },
      ],
    };

    updateMenuConfig(newMenu);
    setSelectedMenuId(newMenu.id);
    setShowCreateDialog(false);
    toast.success('Menú creado', {
      description: 'El nuevo menú ha sido creado',
    });
  };

  const handleCreateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMenu) return;

    const formData = new FormData(e.currentTarget);
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: formData.get('label') as string,
      icon: formData.get('icon') as string,
      path: formData.get('path') as string,
      visible: true,
      disabled: false,
      order: editingMenu.items.length + 1,
    };

    setEditingMenu({
      ...editingMenu,
      items: [...editingMenu.items, newItem],
    });
    setHasChanges(true);
    setShowCreateItemDialog(false);
    toast.success('Feature creado');
  };

  const handleEditItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMenu || !editingItemId) return;

    const formData = new FormData(e.currentTarget);
    
    setEditingMenu({
      ...editingMenu,
      items: editingMenu.items.map(item =>
        item.id === editingItemId
          ? {
              ...item,
              label: formData.get('label') as string,
              icon: formData.get('icon') as string,
              path: formData.get('path') as string,
            }
          : item
      ),
    });
    setHasChanges(true);
    setShowEditItemDialog(false);
    setEditingItemId(null);
    toast.success('Feature actualizado');
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (!selectedMenu) {
    return <div>No hay menús disponibles</div>;
  }

  if (!editingMenu) {
    startEditing(selectedMenu);
  }

  const editingItem = editingItemId ? editingMenu?.items.find(i => i.id === editingItemId) : null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Menu list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Menús</CardTitle>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear nuevo menú</DialogTitle>
                    <DialogDescription>
                      Define un nuevo menú personalizado
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateMenu} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del menú</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ej: Menú Supervisores"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol asociado</Label>
                      <Select name="role" defaultValue="employee">
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Empleado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Crear</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Selecciona un menú para editar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {menuConfigs.map((menu) => (
              <div
                key={menu.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedMenuId === menu.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => {
                  if (hasChanges) {
                    if (confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?')) {
                      setSelectedMenuId(menu.id);
                      startEditing(menu);
                    }
                  } else {
                    setSelectedMenuId(menu.id);
                    startEditing(menu);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{menu.name}</h4>
                  {menu.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Por defecto
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                  Rol: {menu.role}
                </p>
                {!menu.isDefault && (
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateMenu(menu);
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Duplicar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right column - Menu editor */}
        <div className="lg:col-span-2 space-y-6">
          {editingMenu && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{editingMenu.name}</CardTitle>
                      <CardDescription>
                        Personaliza los módulos visibles y su orden
                      </CardDescription>
                    </div>
                    {hasChanges && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Sin guardar
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Features del menú ({editingMenu.items.length})</Label>
                    <Dialog open={showCreateItemDialog} onOpenChange={setShowCreateItemDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Crear feature
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crear nuevo feature</DialogTitle>
                          <DialogDescription>
                            Añade un nuevo módulo al menú
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateItem} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="item-label">Nombre</Label>
                            <Input
                              id="item-label"
                              name="label"
                              placeholder="Ej: Informes"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-icon">Icono</Label>
                            <Select name="icon" defaultValue="FileText">
                              <SelectTrigger id="item-icon">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableIcons.map(icon => {
                                  const IconComponent = (Icons as any)[icon];
                                  return (
                                    <SelectItem key={icon} value={icon}>
                                      <div className="flex items-center gap-2">
                                        <IconComponent className="w-4 h-4" />
                                        {icon}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-path">Ruta</Label>
                            <Input
                              id="item-path"
                              name="path"
                              placeholder="/informes"
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowCreateItemDialog(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">Crear</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Arrastra para reordenar • Click en la flecha para más opciones
                  </p>

                  <div className="space-y-2">
                    {editingMenu.items.map((item, index) => (
                      <DraggableMenuItem
                        key={item.id}
                        item={item}
                        index={index}
                        moveItem={moveItem}
                        onToggleVisible={toggleVisible}
                        onToggleDisabled={toggleDisabled}
                        onDelete={deleteItem}
                        onEdit={startEditingItem}
                        isExpanded={expandedItems.has(item.id)}
                        onToggleExpand={() => toggleExpandItem(item.id)}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => startEditing(selectedMenu)}
                      disabled={!hasChanges}
                    >
                      Descartar cambios
                    </Button>
                    <Button onClick={saveChanges} disabled={!hasChanges}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-medium text-blue-900">Guía rápida</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Arrastra</strong> los items para cambiar el orden</li>
                        <li>• <strong>Ojo</strong>: Muestra/oculta el item en el menú</li>
                        <li>• <strong>Switch</strong>: Habilita/deshabilita el acceso</li>
                        <li>• <strong>Flecha</strong>: Expande para ver opciones avanzadas</li>
                        <li>• <strong>Crear feature</strong>: Añade nuevos módulos personalizados</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar feature</DialogTitle>
            <DialogDescription>
              Modifica las propiedades del módulo
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-label">Nombre</Label>
                <Input
                  id="edit-label"
                  name="label"
                  defaultValue={editingItem.label}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icono</Label>
                <Select name="icon" defaultValue={editingItem.icon}>
                  <SelectTrigger id="edit-icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map(icon => {
                      const IconComponent = (Icons as any)[icon];
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {icon}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-path">Ruta</Label>
                <Input
                  id="edit-path"
                  name="path"
                  defaultValue={editingItem.path}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditItemDialog(false);
                    setEditingItemId(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}

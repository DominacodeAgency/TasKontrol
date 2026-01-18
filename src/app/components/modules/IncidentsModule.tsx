import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { EmptyState } from '@/app/components/EmptyState';
import { mockIncidents } from '@/app/data/mockData';
import { Incident } from '@/app/types';
import { AlertCircle, Plus, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';

export function IncidentsModule() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [filter, setFilter] = useState<'all' | Incident['status']>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.status === filter;
  });

  const getPriorityBadge = (priority: Incident['priority']) => {
    const variants = {
      'low': 'bg-gray-100 text-gray-700 border-gray-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'high': 'bg-orange-100 text-orange-700 border-orange-200',
      'critical': 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Crítica',
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  const getStatusBadge = (status: Incident['status']) => {
    const variants = {
      'open': 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'resolved': 'bg-green-100 text-green-700 border-green-200',
      'closed': 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const labels = {
      'open': 'Abierta',
      'in-progress': 'En progreso',
      'resolved': 'Resuelta',
      'closed': 'Cerrada',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleCreateIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newIncident: Incident = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      reportedBy: user?.id || '',
      assignedTo: '',
      status: 'open',
      priority: formData.get('priority') as Incident['priority'],
      images: [],
      createdAt: new Date().toISOString(),
    };

    setIncidents(prev => [newIncident, ...prev]);
    setShowCreateDialog(false);
    toast.success('Incidencia creada', {
      description: 'La incidencia ha sido reportada exitosamente',
    });
  };

  const handleStatusChange = (incidentId: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(incident =>
      incident.id === incidentId
        ? {
            ...incident,
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : incident.resolvedAt,
          }
        : incident
    ));
    toast.success('Estado actualizado', {
      description: 'El estado de la incidencia ha sido actualizado',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incidencias</h1>
          <p className="text-sm text-muted-foreground">
            Reporta y gestiona incidencias operativas
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Reportar incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Reportar incidencia</DialogTitle>
              <DialogDescription>
                Describe el problema detectado
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Título de la incidencia</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Fuga de agua"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe el problema en detalle..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Reportar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'open' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('open')}
        >
          Abiertas
        </Button>
        <Button
          variant={filter === 'in-progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('in-progress')}
        >
          En progreso
        </Button>
        <Button
          variant={filter === 'resolved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('resolved')}
        >
          Resueltas
        </Button>
      </div>

      {/* Incidents list */}
      {filteredIncidents.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={AlertCircle}
              title="No hay incidencias"
              description="No se encontraron incidencias con los filtros seleccionados"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CardTitle className="text-lg">{incident.name}</CardTitle>
                      {getPriorityBadge(incident.priority)}
                      {getStatusBadge(incident.status)}
                    </div>
                    <CardDescription>{incident.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(incident.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {incident.resolvedAt && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span>
                          Resuelta: {new Date(incident.resolvedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                  </div>
                  {incident.status !== 'closed' && user?.currentRole !== 'employee' && (
                    <Select
                      value={incident.status}
                      onValueChange={(value) => handleStatusChange(incident.id, value as Incident['status'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Abierta</SelectItem>
                        <SelectItem value="in-progress">En progreso</SelectItem>
                        <SelectItem value="resolved">Resuelta</SelectItem>
                        <SelectItem value="closed">Cerrada</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

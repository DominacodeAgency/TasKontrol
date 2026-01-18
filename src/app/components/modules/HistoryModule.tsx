import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { DatePicker } from '@/app/components/ui/date-picker';
import { EmptyState } from '@/app/components/EmptyState';
import { mockHistory } from '@/app/data/mockData';
import { HistoryRecord } from '@/app/types';
import { History, Filter, X, Calendar, Search } from 'lucide-react';

export function HistoryModule() {
  const [records, setRecords] = useState<HistoryRecord[]>(mockHistory);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filtros
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [equipment, setEquipment] = useState('all');
  const [type, setType] = useState<'all' | 'task' | 'incident'>('all');
  const [user, setUser] = useState('');

  // Equipos únicos para el selector
  const equipments = Array.from(new Set(mockHistory.map(r => r.equipment).filter(Boolean)));

  const applyFilters = () => {
    let filtered = [...mockHistory];

    if (dateFrom) {
      filtered = filtered.filter(r => new Date(r.startDate) >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter(r => new Date(r.startDate) <= dateTo);
    }

    if (equipment && equipment !== 'all') {
      filtered = filtered.filter(r => r.equipment === equipment);
    }

    if (type !== 'all') {
      filtered = filtered.filter(r => r.type === type);
    }

    if (user) {
      filtered = filtered.filter(r => 
        r.user.toLowerCase().includes(user.toLowerCase())
      );
    }

    setRecords(filtered);
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setEquipment('all');
    setType('all');
    setUser('');
    setRecords(mockHistory);
  };

  const activeFiltersCount = [
    dateFrom,
    dateTo,
    equipment !== 'all' ? equipment : '',
    type !== 'all' ? type : '',
    user,
  ].filter(Boolean).length;

  const setDatePreset = (preset: 'today' | 'week' | 'month' | 'year') => {
    const today = new Date();
    const from = new Date();
    
    switch (preset) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case 'week':
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        from.setFullYear(today.getFullYear() - 1);
        break;
    }

    setDateFrom(from);
    setDateTo(today);
  };

  const getTypeBadge = (type: HistoryRecord['type']) => {
    return type === 'task' ? (
      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
        Tarea
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
        Incidencia
      </Badge>
    );
  };

  const getStatusBadge = (status: HistoryRecord['status']) => {
    const variants = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'resolved': 'bg-blue-100 text-blue-700 border-blue-200',
      'cancelled': 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const labels = {
      'completed': 'Completada',
      'resolved': 'Resuelta',
      'cancelled': 'Cancelada',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <p className="text-sm text-muted-foreground">
            Análisis de tareas e incidencias pasadas
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Rango de fechas */}
              <div className="space-y-2">
                <Label>Rango de fechas</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('today')}
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('week')}
                  >
                    7 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('month')}
                  >
                    30 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDatePreset('year')}
                  >
                    1 año
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">Desde</Label>
                    <DatePicker
                      date={dateFrom}
                      onSelect={setDateFrom}
                      placeholder="Selecciona fecha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">Hasta</Label>
                    <DatePicker
                      date={dateTo}
                      onSelect={setDateTo}
                      placeholder="Selecciona fecha"
                    />
                  </div>
                </div>
              </div>

              {/* Otros filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipo / Instrumento</Label>
                  <Select value={equipment} onValueChange={setEquipment}>
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Todos los equipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los equipos</SelectItem>
                      {equipments.map((eq) => (
                        <SelectItem key={eq} value={eq!}>
                          {eq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as any)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="task">Tareas</SelectItem>
                      <SelectItem value="incident">Incidencias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-filter">Usuario</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="user-filter"
                      type="text"
                      placeholder="Buscar usuario..."
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
                <Button onClick={applyFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar filtros
                </Button>
              </div>

              {/* Indicador de filtros activos */}
              {activeFiltersCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    📊 {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''} • {records.length} resultado{records.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={History}
              title="No hay registros"
              description="No se encontraron registros con los filtros seleccionados"
              action={{
                label: 'Limpiar filtros',
                onClick: clearFilters,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha inicio</TableHead>
                    <TableHead>Fecha fin</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{getTypeBadge(record.type)}</TableCell>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.equipment || '-'}</TableCell>
                      <TableCell>{record.user}</TableCell>
                      <TableCell>
                        {new Date(record.startDate).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        {record.endDate
                          ? new Date(record.endDate).toLocaleDateString('es-ES')
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {records.map((record) => (
                <div key={record.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-foreground">{record.name}</h3>
                      {record.equipment && (
                        <p className="text-sm text-muted-foreground">{record.equipment}</p>
                      )}
                    </div>
                    {getTypeBadge(record.type)}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>👤 {record.user}</span>
                    <span>•</span>
                    <span>📅 {new Date(record.startDate).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div>{getStatusBadge(record.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
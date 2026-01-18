import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { EmptyState } from '@/app/components/EmptyState';
import { mockPublications } from '@/app/data/mockData';
import { Publication } from '@/app/types';
import { FileText, Calendar, User, Sparkles, BookOpen, Info, Bell } from 'lucide-react';

export function PublicationsModule() {
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [filter, setFilter] = useState<'all' | Publication['type']>('all');

  const filteredPublications = publications.filter(pub => {
    if (filter === 'all') return true;
    return pub.type === filter;
  });

  const openPublication = (publication: Publication) => {
    setSelectedPublication(publication);
    if (!publication.read) {
      setPublications(prev =>
        prev.map(p => (p.id === publication.id ? { ...p, read: true, isNew: false } : p))
      );
    }
  };

  const getTypeIcon = (type: Publication['type']) => {
    switch (type) {
      case 'notice':
        return <Bell className="w-4 h-4" />;
      case 'training':
        return <BookOpen className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: Publication['type']) => {
    const variants = {
      'notice': 'bg-orange-100 text-orange-700 border-orange-200',
      'training': 'bg-purple-100 text-purple-700 border-purple-200',
      'info': 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const labels = {
      'notice': 'Aviso',
      'training': 'Formación',
      'info': 'Información',
    };

    return (
      <Badge variant="outline" className={`${variants[type]} flex items-center gap-1 w-fit`}>
        {getTypeIcon(type)}
        {labels[type]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Publicaciones</h1>
        <p className="text-sm text-muted-foreground">
          Novedades, avisos y contenido formativo
        </p>
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
          variant={filter === 'notice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('notice')}
        >
          <Bell className="w-3 h-3 mr-1" />
          Avisos
        </Button>
        <Button
          variant={filter === 'training' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('training')}
        >
          <BookOpen className="w-3 h-3 mr-1" />
          Formación
        </Button>
        <Button
          variant={filter === 'info' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('info')}
        >
          <Info className="w-3 h-3 mr-1" />
          Información
        </Button>
      </div>

      {/* Publications feed */}
      {filteredPublications.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={FileText}
              title="No hay publicaciones"
              description="No se encontraron publicaciones con los filtros seleccionados"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPublications.map((publication) => (
            <Card
              key={publication.id}
              className={`cursor-pointer hover:shadow-lg transition-all overflow-hidden ${
                publication.isNew ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => openPublication(publication)}
            >
              {/* Cover image placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center relative">
                <FileText className="w-16 h-16 text-primary/30" />
                {publication.isNew && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Nuevo
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="space-y-2">
                  {getTypeBadge(publication.type)}
                  <CardTitle className="text-lg line-clamp-2">
                    {publication.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {publication.excerpt}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-foreground">{publication.author}</div>
                      <div className="text-xs">{publication.authorRole}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(publication.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Publication detail dialog */}
      <Dialog
        open={!!selectedPublication}
        onOpenChange={(open) => !open && setSelectedPublication(null)}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPublication && (
            <>
              <DialogHeader>
                <div className="space-y-3">
                  {getTypeBadge(selectedPublication.type)}
                  <DialogTitle className="text-2xl">
                    {selectedPublication.title}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Publicación de {selectedPublication.author}
                  </DialogDescription>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{selectedPublication.author}</span>
                      <span className="text-muted-foreground">• {selectedPublication.authorRole}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(selectedPublication.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-6">
                {/* Cover image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-20 h-20 text-primary/30" />
                </div>

                {/* Content */}
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedPublication.content }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedPublication(null)}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
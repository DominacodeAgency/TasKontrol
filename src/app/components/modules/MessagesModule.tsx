import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { EmptyState } from '@/app/components/EmptyState';
import { mockMessages } from '@/app/data/mockData';
import { Message } from '@/app/types';
import { Mail, MailOpen, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function MessagesModule() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      setMessages(prev =>
        prev.map(m => (m.id === message.id ? { ...m, read: true } : m))
      );
    }
  };

  const getPriorityBadge = (priority: Message['priority']) => {
    const variants = {
      'normal': 'bg-gray-100 text-gray-700 border-gray-200',
      'important': 'bg-blue-100 text-blue-700 border-blue-200',
      'urgent': 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
      'normal': 'Normal',
      'important': 'Importante',
      'urgent': 'Urgente',
    };

    if (priority === 'normal') return null;

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
        {labels[priority]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
          <p className="text-sm text-muted-foreground">
            Comunicaciones internas de la empresa
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-primary">
            {unreadCount} sin leer
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          No leídos
        </Button>
      </div>

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={Mail}
              title="No hay mensajes"
              description={
                filter === 'unread'
                  ? '¡Enhorabuena! Has leído todos tus mensajes'
                  : 'No tienes mensajes en este momento'
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer hover:shadow-md transition-all ${
                !message.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
              onClick={() => openMessage(message)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {message.read ? (
                        <MailOpen className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className={`text-base ${!message.read ? 'font-bold' : ''}`}>
                          {message.subject}
                        </CardTitle>
                        {getPriorityBadge(message.priority)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {message.body}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{message.from}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(message.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message detail dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <DialogTitle className="flex-1">{selectedMessage.subject}</DialogTitle>
                  {getPriorityBadge(selectedMessage.priority)}
                </div>
                <DialogDescription>
                  De: {selectedMessage.from} • {' '}
                  {new Date(selectedMessage.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{selectedMessage.body}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setSelectedMessage(null)}>Cerrar</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

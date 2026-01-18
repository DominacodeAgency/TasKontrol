import { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { AuthForm } from '@/app/components/AuthForm';
import { AppHeader } from '@/app/components/AppHeader';
import { AppSidebar } from '@/app/components/AppSidebar';
import { TasksModule } from '@/app/components/modules/TasksModule';
import { IncidentsModule } from '@/app/components/modules/IncidentsModule';
import { HistoryModule } from '@/app/components/modules/HistoryModule';
import { ExamsModule } from '@/app/components/modules/ExamsModule';
import { MessagesModule } from '@/app/components/modules/MessagesModule';
import { PublicationsModule } from '@/app/components/modules/PublicationsModule';
import { AdministrationModule } from '@/app/components/modules/AdministrationModule';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
import { Toaster } from '@/app/components/ui/sonner';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('/tasks');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const handleNavigate = (path: string) => {
    setCurrentView(path);
    setShowMobileSidebar(false);
  };

  const renderView = () => {
    switch (currentView) {
      case '/tasks':
        return <TasksModule />;
      case '/incidents':
        return <IncidentsModule />;
      case '/history':
        return <HistoryModule />;
      case '/exams':
        return <ExamsModule />;
      case '/messages':
        return <MessagesModule />;
      case '/publications':
        return <PublicationsModule />;
      case '/administration':
        return <AdministrationModule />;
      default:
        return <TasksModule />;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <AppHeader onMenuClick={() => setShowMobileSidebar(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <AppSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          className="hidden md:block w-64 flex-shrink-0"
        />

        {/* Mobile Sidebar */}
        <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
          <SheetContent side="left" className="p-0 w-64">
            <AppSidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              className="h-full"
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

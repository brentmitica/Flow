import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { CommandPalette } from "./components/layout/CommandPalette";
import { MobileNav } from "./components/layout/MobileNav";
import { Footer } from "./components/layout/Footer";
import { useFlowStore } from "./store/flowStore";
import { useEffect } from "react";

// Pages
import TodayPage from "./pages/TodayPage";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import HabitsPage from "./pages/HabitsPage";
import CalendarPage from "./pages/CalendarPage";
import FocusPage from "./pages/FocusPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InboxPage from "./pages/InboxPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

function AppShell() {
  const { ui, setCommandPaletteOpen } = useFlowStore();
  const [location, navigate] = useLocation();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(true); }
      if (meta && e.key === '1') { e.preventDefault(); navigate('/inbox'); }
      if (meta && e.key === '2') { e.preventDefault(); navigate('/today'); }
      if (meta && e.key === '3') { e.preventDefault(); navigate('/tasks'); }
      if (meta && e.key === '4') { e.preventDefault(); navigate('/calendar'); }
      if (meta && e.key === '5') { e.preventDefault(); navigate('/notes'); }
      if (meta && e.key === '6') { e.preventDefault(); navigate('/habits'); }
      if (meta && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); navigate('/focus'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flow-main" style={{ display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div className="flow-content" style={{ flex: 1, overflowY: 'auto' }}>
          <Switch>
            <Route path="/" component={() => { navigate('/today'); return null; }} />
            <Route path="/today" component={TodayPage} />
            <Route path="/inbox" component={InboxPage} />
            <Route path="/tasks" component={TasksPage} />
            <Route path="/tasks/project/:id" component={TasksPage} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/notes" component={NotesPage} />
            <Route path="/notes/:id" component={NotesPage} />
            <Route path="/habits" component={HabitsPage} />
            <Route path="/focus" component={FocusPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-lg)',
              },
            }}
          />
          <AppShell />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

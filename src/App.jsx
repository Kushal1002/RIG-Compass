import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Engagements from './pages/Engagements/Engagements';
import EngagementCopilot from './components/EngagementCopilot/EngagementCopilot';
import ExecutiveReport from './components/ExecutiveReport/ExecutiveReport';
import Settings from './pages/Settings/Settings';
import { useEngagements } from './hooks/useEngagements';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRegional, setIsRegional] = useState(false);
  const { engagements, updateEngagement } = useEngagements();

  const visibleEngagements = isRegional
    ? engagements.filter(e => e.region === 'APJ')
    : engagements;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard engagements={visibleEngagements} isRegional={isRegional} />;
      case 'engagements':
        return <Engagements engagements={visibleEngagements} onUpdate={updateEngagement} />;
      case 'copilot':
        return <EngagementCopilot engagements={visibleEngagements} />;
      case 'reports':
        return <ExecutiveReport engagements={visibleEngagements} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard engagements={visibleEngagements} isRegional={isRegional} />;
    }
  };

  return (
    <div className="app-layout">
      <Header isRegional={isRegional} onToggleRegion={() => setIsRegional(r => !r)} onNavigate={setActivePage} />
      <div className="app-body">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

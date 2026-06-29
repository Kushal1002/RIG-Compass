import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Engagements from './pages/Engagements/Engagements';
import EngagementCopilot from './components/EngagementCopilot/EngagementCopilot';
import BTPSolutionAdvisor from './components/BTPSolutionAdvisor/BTPSolutionAdvisor';
import ExecutiveReport from './components/ExecutiveReport/ExecutiveReport';
import Settings from './pages/Settings/Settings';
import { useEngagements } from './hooks/useEngagements';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { engagements, updateEngagement } = useEngagements();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard engagements={engagements} />;
      case 'engagements':
        return <Engagements engagements={engagements} onUpdate={updateEngagement} />;
      case 'copilot':
        return <EngagementCopilot engagements={engagements} />;
      case 'advisor':
        return <BTPSolutionAdvisor />;
      case 'reports':
        return <ExecutiveReport engagements={engagements} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard engagements={engagements} />;
    }
  };

  return (
    <div className="app-layout">
      <Header />
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

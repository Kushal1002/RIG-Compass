import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Engagements from './pages/Engagements/Engagements';
import EngagementCopilot from './components/EngagementCopilot/EngagementCopilot';
import BTPSolutionAdvisor from './components/BTPSolutionAdvisor/BTPSolutionAdvisor';
import ExecutiveReport from './components/ExecutiveReport/ExecutiveReport';
import Settings from './pages/Settings/Settings';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'engagements':
        return <Engagements />;
      case 'copilot':
        return <EngagementCopilot />;
      case 'advisor':
        return <BTPSolutionAdvisor />;
      case 'reports':
        return <ExecutiveReport />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
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

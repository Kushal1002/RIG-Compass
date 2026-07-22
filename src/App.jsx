import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import ProposalsDashboard from './pages/ProposalsDashboard/ProposalsDashboard';
import EngagementCopilot from './components/EngagementCopilot/EngagementCopilot';
import ExecutiveReport from './components/ExecutiveReport/ExecutiveReport';
import Settings from './pages/Settings/Settings';
import { useEngagements } from './hooks/useEngagements';
import { useProposals } from './hooks/useProposals';

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem('rig_user_profile');
    if (raw) return { name: 'Kushal Kumar', ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { name: 'Kushal Kumar', role: 'RIG Architect', team: 'SAP BTP RIG' };
}

function App() {
  const [activePage, setActivePage] = useState('proposals');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRegional, setIsRegional] = useState(false);
  const [showMyProjects, setShowMyProjects] = useState(true);
  const currentUser = loadCurrentUser();
  const { engagements, addEngagement, updateEngagement, deleteEngagement, loading, error } = useEngagements();
  const { proposals, addProposal, updateProposal, loading: proposalsLoading } = useProposals();

  if (loading || proposalsLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#c00' }}>Error: {error}<br/>Make sure the backend is running: <code>cd backend &amp;&amp; npm run dev</code></div>;

  const regionFiltered = isRegional
    ? engagements.filter(e => e.region === 'APJ')
    : engagements;

  const visibleEngagements = showMyProjects
    ? regionFiltered.filter(e => e.owner === currentUser.name)
    : regionFiltered;

  const projectsProps = {
    engagements: visibleEngagements,
    allEngagements: regionFiltered,
    isRegional,
    onToggleRegion: () => setIsRegional(r => !r),
    showMyProjects,
    onToggleView: () => setShowMyProjects(v => !v),
    currentUser,
    onAdd: addEngagement,
    onUpdate: updateEngagement,
    onDelete: deleteEngagement,
  };

  const proposalsProps = {
    proposals,
    isRegional,
    onToggleRegion: () => setIsRegional(r => !r),
    currentUser,
    onAddProposal: addProposal,
    onUpdateProposal: updateProposal,
    onAddEngagement: addEngagement,
  };

  const renderPage = () => {
    switch (activePage) {
      case 'proposals': return <ProposalsDashboard {...proposalsProps} />;
      case 'projects':  return <Dashboard {...projectsProps} />;
      case 'copilot':   return <EngagementCopilot engagements={regionFiltered} />;
      case 'reports':   return <ExecutiveReport engagements={regionFiltered} />;
      case 'settings':  return <Settings />;
      default:          return <ProposalsDashboard {...proposalsProps} />;
    }
  };

  return (
    <div className="app-layout">
      <Header onNavigate={setActivePage} />
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

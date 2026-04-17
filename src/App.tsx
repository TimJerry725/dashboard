import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Note: In a real app, the sidebar should pass its state up or use a context
  // For this demonstration, I'll keep it simple
  
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div style={{ flex: 1, marginLeft: '60px' }}>
          <Header sidebarCollapsed={sidebarCollapsed} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Other routes would go here */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

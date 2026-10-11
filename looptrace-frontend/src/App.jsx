import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Layout Components
import TopHeader from './components/layout/TopHeader';
import BottomNav from './components/layout/BottomNav';

// Pages
import LandingPage from './pages/LandingPage';
import PickupRequest from './pages/Household/PickupRequest';
import ImpactDashboard from './pages/Household/ImpactDashboard';
import CollectorDashboard from './pages/Collector/Dashboard';
import TraceabilityTimeline from './pages/Shared/TraceabilityTimeline';
import AdminDashboard from './pages/Admin/Dashboard';
import RecyclerDashboard from './pages/Recycler/Dashboard';
import AuthPage from './pages/AuthPage';

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(sessionStorage.getItem('looptrace_user') || 'null');
  if (!sessionStorage.getItem('looptrace_access_token')) return <Navigate to="/auth" replace />;
  if (roles && (!user || !roles.includes(user.role))) return <Navigate to="/" replace />;
  return children;
};

const AppLayout = ({ children, role, setRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    const routeRole = location.pathname.startsWith('/collector/')
      ? 'collector'
      : location.pathname.startsWith('/recycler/')
        ? 'recycler'
        : location.pathname.startsWith('/admin/')
          ? 'admin'
          : location.pathname.startsWith('/household/')
            ? 'household'
            : location.pathname.startsWith('/shared/')
              ? ({ HOUSEHOLD: 'household', COLLECTOR: 'collector', RECYCLER: 'recycler', SUPER_ADMIN: 'admin' }[
                JSON.parse(sessionStorage.getItem('looptrace_user') || 'null')?.role] || 'household')
            : null;

    if (routeRole && routeRole !== role) setRole(routeRole);
    if (routeRole) {
      const titles = {
        household: 'Household',
        collector: 'Collector',
        recycler: 'Recycler',
        admin: 'Super Admin',
      };
      document.title = `${titles[routeRole]} | LoopTrace`;
    } else {
      document.title = 'LoopTrace';
    }
  }, [location.pathname, role, setRole]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/impact')) return 'impact';
    if (path.includes('/timeline')) return 'requests';
    if (path.includes('/dashboard') || path.includes('/request')) return 'home';
    return 'home';
  };

  const handleTabChange = (tabId) => {
    if (role === 'household') {
      switch (tabId) {
        case 'home': navigate('/household/request'); break;
        case 'requests': navigate('/shared/timeline'); break;
        case 'impact': navigate('/household/impact'); break;
        default: navigate('/household/request'); break;
      }
    } else {
      switch (tabId) {
        case 'home': navigate(role === 'admin' ? '/admin/dashboard' : role === 'recycler' ? '/recycler/dashboard' : '/collector/dashboard'); break;
        case 'requests': navigate('/shared/timeline'); break;
        case 'impact':
          if (role === 'household') navigate('/household/impact');
          break;
        default: navigate('/collector/dashboard'); break;
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFA] relative font-sans text-textMain">
      
      {/* ALWAYS render TopHeader, passing the page state so it knows what to show */}
      <TopHeader 
        variant={role} 
        setRole={setRole}
        activeTab={getActiveTab()} 
        onTabChange={handleTabChange} 
        isLandingPage={isLandingPage}
        isAuthPage={isAuthPage}
      />
      
      <main className={`flex-1 w-full mx-auto relative ${(isLandingPage || isAuthPage) ? 'max-w-full' : 'max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children}
      </main>
      
      {!isLandingPage && !isAuthPage && (
        <BottomNav
          role={role}
          activeTab={getActiveTab()} 
          onTabChange={handleTabChange} 
        />
      )}
    </div>
  );
};

const App = () => {
  const [role, setRole] = useState('household'); 

  return (
    <Router>
      <AppLayout role={role} setRole={setRole}>
        <Routes>
          <Route path="/household/impact" element={<ImpactDashboard />} />
          <Route path="/" element={<LandingPage setRole={setRole} />} />
          <Route path="/auth" element={<AuthPage onAuthenticated={(value) => setRole(value.role.toLowerCase())} />} />
          <Route path="/household/request" element={<ProtectedRoute roles={['HOUSEHOLD']}><PickupRequest /></ProtectedRoute>} />
          {/* <Route path="/household/impact" element={<ProtectedRoute roles={['HOUSEHOLD']}><ImpactDashboard /></ProtectedRoute>} /> */}
          <Route path="/collector/dashboard" element={<ProtectedRoute roles={['COLLECTOR']}><CollectorDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/recycler/dashboard" element={<ProtectedRoute roles={['RECYCLER']}><RecyclerDashboard /></ProtectedRoute>} />
          <Route path="/shared/timeline" element={<ProtectedRoute><TraceabilityTimeline /></ProtectedRoute>} />
          <Route path="/shared/timeline/:requestId" element={<ProtectedRoute><TraceabilityTimeline /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
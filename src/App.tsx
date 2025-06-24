import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { TrainerDashboard } from './components/Dashboard/TrainerDashboard';
import { ClientDashboard } from './components/Dashboard/ClientDashboard';
import { ClientsPage } from './components/Clients/ClientsPage';
import { ClientDetailPage } from './components/Clients/ClientDetailPage';
import { WorkoutsPage } from './components/Workouts/WorkoutsPage';
import { ProgressPage } from './components/Progress/ProgressPage';
import { MessagesPage } from './components/Messages/MessagesPage';
import { CalendarPage } from './components/Calendar/CalendarPage';
import { Layout } from './components/Layout/Layout';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={
          user.role === 'trainer' ? <TrainerDashboard /> : <ClientDashboard />
        } />
        
        {/* Trainer Routes */}
        {user.role === 'trainer' && (
          <>
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:clientId" element={<ClientDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </>
        )}
        
        {/* Client Routes */}
        {user.role === 'client' && (
          <>
            <Route path="/progress" element={<ProgressPage />} />
          </>
        )}
        
        {/* Shared Routes */}
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
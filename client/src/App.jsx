import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Progress from './pages/Progress';
import AdminPanel from './pages/AdminPanel';
import Landing from './pages/Landing';
import Planning from './pages/Planning';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Onboarding from './components/Onboarding';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Cargando FitProgress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {user && <Navbar />}
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12"><Dashboard /></div>
          </ProtectedRoute>
        } />
        <Route path="/routine" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12"><Routine /></div>
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12"><Progress /></div>
          </ProtectedRoute>
        } />
        <Route path="/planning" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12"><Planning /></div>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12"><AdminPanel /></div>
          </AdminRoute>
        } />
      </Routes>

      {user && <ChatBot />}
    </div>
  );
}

export default App;


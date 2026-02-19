import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Progress from './pages/Progress';
import AdminPanel from './pages/AdminPanel';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Cargando FitProgress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {user && <Navbar />}

      <Routes>
        {/* Public landing — only for non-authenticated users */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />

        {/* Auth routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected app routes — wrapped in a padded container */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-6 py-6"><Dashboard /></div>
          </ProtectedRoute>
        } />
        <Route path="/routine" element={
          <ProtectedRoute>
            <Routine />
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute>
            <div className="container mx-auto px-4 sm:px-6 py-6"><Progress /></div>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <div className="container mx-auto px-4 sm:px-6 py-6"><AdminPanel /></div>
          </AdminRoute>
        } />
      </Routes>

      {user && <ChatBot />}
    </div>
  );
}

export default App;

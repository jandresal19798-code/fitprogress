import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/routine', label: 'Rutina' },
    { path: '/planning', label: 'Planificación' },
    { path: '/progress', label: 'Progreso' }
  ];

  if (user?.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin' });
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="bg-gradient-to-tr from-green-500 to-emerald-400 p-2.5 rounded-xl shadow-lg shadow-green-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              FitProgress
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${location.pathname === link.path
                    ? 'text-white shadow-lg shadow-green-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {location.pathname === link.path && (
                    <span className="absolute inset-0 bg-slate-800 rounded-xl -z-10 animate-fade-in"></span>
                  )}
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-white tracking-wide">{user?.name}</div>
                <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Miembro Pro</div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden flex items-center justify-center ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              style={{ transitionDelay: `${idx * 100}ms` }}
              className={`text-2xl font-display font-medium transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${location.pathname === link.path ? 'text-green-400' : 'text-slate-300'}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            style={{ transitionDelay: '300ms' }}
            className={`mt-4 flex items-center gap-2 text-red-400 text-lg font-medium transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

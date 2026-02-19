import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    goal: 'mantener'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const goals = [
    { value: 'perder_peso', label: 'Perder Peso' },
    { value: 'ganar_musculo', label: 'Ganar Músculo' },
    { value: 'mantener', label: 'Mantener' },
    { value: 'resistencia', label: 'Mejorar Resistencia' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-500">FitProgress</h1>
          <p className="text-slate-400 mt-2">Comienza tu transformación</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Crear Cuenta</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </div>
            
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Edad</label>
                <input
                  type="number"
                  name="age"
                  className="input"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="10"
                  max="100"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="label">Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="input"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="200"
                  placeholder="70"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Objetivo</label>
              <select
                name="goal"
                className="input"
                value={formData.goal}
                onChange={handleChange}
              >
                {goals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn-primary w-full">
              Crear Cuenta
            </button>
          </form>
          
          <p className="text-center text-slate-400 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-green-500 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

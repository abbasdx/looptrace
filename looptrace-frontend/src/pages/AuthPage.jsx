import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Briefcase, Hash, 
  ChevronDown, Loader2, AlertTriangle, ArrowRight 
} from 'lucide-react';
import api from '../services/api';
import logo from '../assets/looptrace.png';

const AuthPage = ({ onAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState(location.state?.mode || 'login');
  const [form, setForm] = useState({ email: '', password: '', role: 'HOUSEHOLD', participantId: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = mode === 'login'
        ? await api.auth.login({ email: form.email, password: form.password })
        : await api.auth.register(form);
      
      sessionStorage.setItem('looptrace_access_token', result.accessToken);
      sessionStorage.setItem('looptrace_user', JSON.stringify(result));
      onAuthenticated({ ...result, role: result.role === 'SUPER_ADMIN' ? 'admin' : result.role.toLowerCase() });
      
      navigate(location.state?.from?.pathname || (
        result.role === 'SUPER_ADMIN' ? '/admin/dashboard' :
        result.role === 'COLLECTOR' ? '/collector/dashboard' :
        result.role === 'RECYCLER' ? '/recycler/dashboard' : '/household/request'
      ), { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-borderMain/60 relative z-10 animate-fade-in-up">
        
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logo} 
            alt="LoopTrace Logo" 
            className="w-14 h-14 object-contain mb-5 cursor-pointer drop-shadow-sm transition-transform hover:scale-105" 
            onClick={() => navigate('/')} 
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain tracking-tight mb-2 text-center">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-secondary text-sm font-medium text-center">
            {mode === 'login' ? 'Sign in to access your dashboard.' : 'Join the verifiable e-waste network.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2.5 items-start text-red-600 mb-6 animate-fade-in">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-textMain focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400" 
                type="email" 
                required 
                placeholder="name@example.com"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-textMain focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400" 
                type="password" 
                minLength={6} 
                required 
                placeholder="6+ characters"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
              />
            </div>
          </div>

          {/* Registration Extra Fields */}
          {mode === 'register' && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider ml-1">
                  Account Role
                </label>
                <div className="relative flex items-center">
                  <Briefcase size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-10 py-3.5 text-sm font-semibold text-textMain appearance-none focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="HOUSEHOLD">Household</option>
                    <option value="COLLECTOR">Collector</option>
                    <option value="RECYCLER">Recycler</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {form.role !== 'HOUSEHOLD' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[11px] font-bold text-secondary uppercase tracking-wider ml-1">
                    Participant ID
                  </label>
                  <div className="relative flex items-center">
                    <Hash size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
                    <input 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-textMain focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400" 
                      placeholder="Approved network ID"
                      required
                      value={form.participantId} 
                      onChange={(e) => setForm({ ...form, participantId: e.target.value })} 
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <button 
              disabled={busy} 
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:scale-100 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              {busy ? (
                <><Loader2 size={18} className="animate-spin" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-borderMain/50 text-center">
          <button 
            className="text-sm font-semibold text-secondary hover:text-textMain transition-colors" 
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? (
              <>Don't have an account? <span className="text-primary hover:underline">Register here</span></>
            ) : (
              <>Already registered? <span className="text-primary hover:underline">Sign in</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
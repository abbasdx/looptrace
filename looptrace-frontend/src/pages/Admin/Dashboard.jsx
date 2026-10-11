import React, { useState, useEffect } from 'react';
import { adminService, pickupService } from '../../services/api';
import { 
  Users, Activity, FileText, Truck, Recycle, 
  CheckCircle2, XCircle, AlertTriangle, Plus, 
  Loader2, ShieldCheck, MapPin
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const isApproved = status === 'APPROVED';
  const isSuspended = status === 'SUSPENDED';
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
      isApproved ? 'bg-green-50 text-green-700 border-green-200' :
      isSuspended ? 'bg-red-50 text-red-700 border-red-200' :
      'bg-warning/10 text-[#996500] border-warning/20'
    }`}>
      {status || 'PENDING'}
    </span>
  );
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [participants, setParticipants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [newParticipant, setNewParticipant] = useState({ name: '', role: 'COLLECTOR' });

  const load = async () => {
    setIsLoading(true); setError(null);
    try {
      const [s, p, a, r, c, rec] = await Promise.all([
        adminService.dashboard(), 
        adminService.participants(), 
        adminService.applications(), 
        pickupService.getAllPickups(), 
        adminService.eligibleCollectors(), 
        adminService.eligibleRecyclers()
      ]);
      setSummary(s); setParticipants(p); setApplications(a); setPickups(r); setCollectors(c); setRecyclers(rec);
    } catch (loadError) {
      setError(loadError.response?.status === 401 
        ? 'Admin access is not configured for this frontend session.' 
        : (loadError.response?.data?.error || 'Unable to load admin data.'));
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  const action = async (fn) => { 
    setActionError(null); 
    try { 
      await fn(); 
      await load(); 
    } catch (actionFailure) { 
      setActionError(actionFailure.response?.data?.error || 'The admin action failed.'); 
    } 
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 animate-pulse">
        <Loader2 size={40} className="animate-spin mb-4 text-primary" />
        <p className="text-sm font-bold uppercase tracking-wider">Syncing Admin Ledger...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in-up">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mb-3">
          <ShieldCheck size={14} /> Operations Control
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain tracking-tight">Super Admin Dashboard</h1>
        <p className="text-gray-500 font-medium mt-2 max-w-2xl">
          Manage network participants, review pending applications, and manually orchestrate unassigned pickups across the ecosystem.
        </p>
      </div>

      {/* Error Banners */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-3 text-red-700 shadow-sm">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">System Error</h3>
            <p className="text-sm font-medium mt-1">{error}</p>
            <button onClick={load} className="mt-2 text-xs font-bold underline hover:text-red-800 transition-colors">Retry Connection</button>
          </div>
        </div>
      )}
      
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3 text-red-700 shadow-sm">
          <XCircle size={18} className="shrink-0" />
          <p className="text-sm font-bold">{actionError}</p>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          ['Total Participants', summary.participants, Users, 'bg-blue-50 text-blue-600 border-blue-100'],
          ['Active Entities', summary.activeParticipants, Activity, 'bg-surface text-primary border-primary/20'],
          ['Pending Apps', summary.pendingApplications, FileText, 'bg-[#FFF8E6] text-warning border-warning/20'],
          ['Open Pickups', summary.openPickups, Truck, 'bg-purple-50 text-purple-600 border-purple-100']
        ].map(([label, value, Icon, colorClass]) => (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between transition-transform hover:-translate-y-1" key={label}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colorClass}`}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{value ?? '—'}</div>
              <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (Wider on Desktop) */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Collectors Network Section */}
          <section className="bg-white rounded-[2rem] border border-borderMain/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#FAFCFA]">
              <div>
                <h2 className="font-extrabold text-lg text-textMain flex items-center gap-2"><Truck size={20} className="text-blue-600"/> Collector Network</h2>
                <p className="text-xs font-medium text-gray-500 mt-1">Manage active kabadiwalas.</p>
              </div>
              <form 
                className="flex flex-col sm:flex-row gap-2" 
                onSubmit={e => { e.preventDefault(); action(() => adminService.createParticipant(newParticipant)); setNewParticipant({ name: '', role: 'COLLECTOR' }); }}
              >
                <input required value={newParticipant.name} onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })} placeholder="Participant Name" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                <select value={newParticipant.role} onChange={e => setNewParticipant({ ...newParticipant, role: e.target.value })} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="COLLECTOR">Collector</option>
                  <option value="RECYCLER">Recycler</option>
                </select>
                <button className="px-4 py-2 rounded-lg bg-textMain hover:bg-black text-white text-sm font-bold flex items-center justify-center gap-1 transition-colors shadow-sm">
                  <Plus size={16}/> Add
                </button>
              </form>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Participant</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Workload</th>
                    <th className="p-4 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.filter(p => p.id?.startsWith('COL-')).length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">No collectors registered.</td></tr>
                  ) : (
                    participants.filter(p => p.id?.startsWith('COL-')).map(p => (
                      <tr className="hover:bg-gray-50/50 transition-colors" key={p.id}>
                        <td className="p-4">
                          <div className="font-bold text-textMain">{p.name}</div>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">{p.id}</div>
                        </td>
                        <td className="p-4"><StatusBadge status={p.status} /></td>
                        <td className="p-4 font-semibold text-secondary">
                          {pickups.filter(pickup => pickup.collectorId === p.id).length} jobs
                        </td>
                        <td className="p-4 text-right space-x-3">
                          {p.status === 'SUSPENDED' 
                            ? <button className="text-primary font-bold text-xs hover:underline" onClick={() => action(() => adminService.status(p.id, 'APPROVED'))}>Reactivate</button> 
                            : <button className="text-warning font-bold text-xs hover:underline" onClick={() => action(() => adminService.status(p.id, 'SUSPENDED'))}>Suspend</button>
                          }
                          <button className="text-red-500 font-bold text-xs hover:underline" onClick={() => window.confirm('Remove this participant?') && action(() => adminService.remove(p.id))}>Remove</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recyclers Section */}
          <section className="bg-white rounded-[2rem] border border-borderMain/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden p-6">
            <h2 className="font-extrabold text-lg text-textMain flex items-center gap-2 mb-4"><Recycle size={20} className="text-primary"/> Certified Recyclers</h2>
            <div className="divide-y divide-gray-100">
              {participants.filter(p => p.id?.startsWith('REC-')).length === 0 ? (
                <p className="text-sm text-gray-400 font-medium py-4">No recyclers registered.</p>
              ) : (
                participants.filter(p => p.id?.startsWith('REC-')).map(r => (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4" key={r.id}>
                    <div>
                      <div className="font-bold text-textMain">{r.name}</div>
                      <div className="text-[11px] font-medium text-gray-500 mt-0.5 flex items-center gap-1">
                        {r.demo ? 'Demo facility · Unverified' : (r.verified ? 'Verified endpoint' : 'Verification pending')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={r.status} />
                      <button 
                        className={`text-xs font-bold hover:underline ${r.status === 'SUSPENDED' ? 'text-primary' : 'text-warning'}`} 
                        onClick={() => action(() => adminService.status(r.id, r.status === 'SUSPENDED' ? 'APPROVED' : 'SUSPENDED'))}
                      >
                        {r.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column (Narrower on Desktop) */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* Applications Section */}
          <section className="bg-white rounded-[2rem] border border-borderMain/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
            <h2 className="font-extrabold text-lg text-textMain flex items-center gap-2 mb-1"><FileText size={20} className="text-warning"/> Applications</h2>
            <p className="text-xs font-medium text-gray-500 mb-5">Review incoming network requests.</p>
            
            <div className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <div className="py-6 text-center text-gray-400">
                  <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Inbox zero.</p>
                </div>
              ) : (
                applications.map(a => (
                  <div className="py-4" key={a.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-textMain">{a.name}</div>
                        <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mt-0.5">{a.role}</div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    {a.status === 'PENDING' && (
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors" onClick={() => action(() => adminService.decide(a.id, true))}>
                          Approve
                        </button>
                        <button className="flex-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors" onClick={() => action(() => adminService.decide(a.id, false))}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Manual Dispatch Section */}
          <section className="bg-white rounded-[2rem] border border-borderMain/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
            <h2 className="font-extrabold text-lg text-textMain flex items-center gap-2 mb-1"><MapPin size={20} className="text-purple-600"/> Dispatch Hub</h2>
            <p className="text-xs font-medium text-gray-500 mb-5">Manually assign unrouted pickups.</p>
            
            <div className="divide-y divide-gray-100">
              {pickups.filter(p => p.status === 'NEW' && !p.collectorId).length === 0 ? (
                <div className="py-6 text-center text-gray-400">
                  <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">All jobs routed automatically.</p>
                </div>
              ) : (
                pickups.filter(p => p.status === 'NEW' && !p.collectorId).map(p => (
                  <div className="py-4" key={p.id}>
                    <div className="font-bold text-textMain mb-1">{p.householdName}</div>
                    <div className="text-xs font-medium text-gray-500 mb-3 flex justify-between items-center">
                      <span>{p.materialCategory}</span>
                      <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">{p.id.split('-')[0]}</span>
                    </div>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-semibold text-textMain focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                      defaultValue="" 
                      onChange={e => e.target.value && action(() => adminService.assign(p.id, e.target.value))}
                    >
                      <option value="" disabled>Assign to collector...</option>
                      {collectors.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
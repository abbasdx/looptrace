import React, { useState, useEffect } from 'react';
import { 
  MapPin, CheckCircle2, Leaf, Truck, Smartphone, 
  Monitor, Cable, Loader2, Weight, Navigation 
} from 'lucide-react';
import api from '../../services/api';

const CollectorDashboard = () => {
  const authenticatedUser = JSON.parse(sessionStorage.getItem('looptrace_user') || 'null');
  const COLLECTOR_ID = authenticatedUser?.participantId;

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  const [actualWeights, setActualWeights] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [selectedRecyclers, setSelectedRecyclers] = useState({});

  const fetchJobs = async () => {
    setIsLoading(true);
    setLoadError(null);
    if (!COLLECTOR_ID) {
      setRequests([]);
      setLoadError('Your account is not linked to an approved collector participant.');
      setIsLoading(false);
      return;
    }
    try {
      const [myJobs, availableRecyclers] = await Promise.all([
        api.collector.getAssignedJobs(COLLECTOR_ID),
        api.public.getRecyclers()
      ]);
      setRecyclers(availableRecyclers.filter(recycler =>
        recycler.status === 'APPROVED' && (recycler.demo || recycler.verified)
      ));
      const activeJobs = myJobs.filter(req => req.status !== 'HANDED_OFF');
      setRequests(activeJobs);
    } catch (error) {
      console.error(error);
      setRequests([]);
      setLoadError(error.response?.data?.error || 'Unable to load pickup requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try { 
      await api.collector.acceptJob(requestId, COLLECTOR_ID); 
      await fetchJobs(); 
    } catch (error) { 
      alert("Failed to accept job."); 
    } finally { 
      setActionLoading(null); 
    }
  };

  const handleConfirmPickup = async (requestId, estimatedWeight) => {
    const weight = actualWeights[requestId] || estimatedWeight;
    setActionLoading(requestId);
    try { 
      await api.collector.recordPickup(requestId, COLLECTOR_ID, weight); 
      await fetchJobs(); 
    } catch (error) { 
      alert("Failed to confirm pickup."); 
    } finally { 
      setActionLoading(null); 
    }
  };

  const handleHandoff = async (requestId, estimatedWeight) => {
    const recyclerId = selectedRecyclers[requestId];
    if (!recyclerId) return;
    setActionLoading(requestId);
    try {
      await api.collector.recordHandoff(
        requestId,
        COLLECTOR_ID,
        recyclerId,
        actualWeights[requestId] || estimatedWeight
      );
      await fetchJobs();
    } catch (error) {
      setLoadError(error.response?.data?.error || 'Failed to confirm recycler handoff.');
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryIcon = (category) => {
    if (category.includes('Phone')) return Smartphone;
    if (category.includes('Cable')) return Cable;
    return Monitor;
  };

  const nearbyCount = requests.filter(r => r.status === 'MATCHED' || r.status === 'NEW').length;
  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED').length;
  const collectedWeight = requests.filter(r => r.status === 'PICKED_UP').reduce((sum, r) => sum + (r.actualWeightKg || 0), 0).toFixed(1);

  return (
    <div className="pb-24 font-sans animate-fade-in-up">
      
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain tracking-tight">Active Jobs</h1>
          <p className="text-secondary text-sm font-medium mt-1">Manage assigned pickups and recycler handoffs.</p>
        </div>
        <button 
          onClick={fetchJobs} 
          className="bg-white border border-borderMain hover:bg-surface text-textMain text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {/* Mobile-First Swipeable Stats Grid */}
      <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto snap-x snap-mandatory flex sm:grid sm:grid-cols-3 gap-4 lg:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary mb-4 border border-primary/10">
            <Navigation size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : nearbyCount}</div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Available Near You</div>
          </div>
        </div>

        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : acceptedCount}</div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">In Progress</div>
          </div>
        </div>

        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-md shadow-primary/20">
            <Leaf size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : collectedWeight}<span className="text-base font-bold ml-1 text-secondary">kg</span></div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Collected</div>
          </div>
        </div>

      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider">Syncing Ledger...</p>
        </div>
      ) : loadError ? (
        <div className="bg-red-50 rounded-3xl p-8 sm:p-12 text-center border border-red-100 shadow-sm">
          <AlertTriangle size={32} className="mx-auto text-red-500 mb-4" />
          <p className="text-lg font-bold text-red-800 mb-1">Access Restricted</p>
          <p className="text-sm text-red-700 font-medium">{loadError}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-borderMain/60 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
            <CheckCircle2 size={36} />
          </div>
          <p className="text-xl font-extrabold text-textMain mb-2">All caught up!</p>
          <p className="text-sm text-secondary font-medium max-w-sm">
            Your queue is empty. New AI-matched e-waste pickup requests will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {requests.map((request, index) => {
            const TagIcon = getCategoryIcon(request.materialCategory);
            const isProcessing = actionLoading === request.id;
            const isMatched = request.status === 'MATCHED';
            const isAccepted = request.status === 'ACCEPTED';
            const isPickedUp = request.status === 'PICKED_UP';

            return (
              <div key={request.id} className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col">
                
                {/* Job Card Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    ID: {request.id.split('-')[0]}
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    isMatched ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    isAccepted ? 'bg-[#FFF8E6] text-[#996500] border-warning/20' :
                    'bg-surface text-primary border-primary/20'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Job Info */}
                <div className="flex gap-4 mb-6 flex-1">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isMatched ? 'bg-blue-50 border-blue-100 text-blue-500' :
                    isAccepted ? 'bg-warning/10 border-warning/20 text-warning' :
                    'bg-surface border-primary/20 text-primary'
                  }`}>
                    <TagIcon size={24} strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-lg font-extrabold text-textMain truncate leading-tight mb-2">
                      {request.materialCategory}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Navigation size={14} className="text-secondary" /> 
                          {request.distanceKm != null ? `${request.distanceKm} km` : 'Near you'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Weight size={14} className="text-secondary" /> 
                          Est: {request.estimatedWeightKg} kg
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-secondary truncate">
                        <MapPin size={14} className="shrink-0" /> {request.pickupArea}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-First Stacked Actions */}
                <div className="pt-5 border-t border-borderMain/50">
                  
                  {isMatched && (
                    <button 
                      onClick={() => handleAccept(request.id)} 
                      disabled={isProcessing} 
                      className="w-full bg-textMain hover:bg-black disabled:bg-gray-400 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-gray-200"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Navigation size={18} /> Accept Job</>}
                    </button>
                  )}
                  
                  {isAccepted && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                      <div className="w-full sm:flex-1">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1.5 ml-1">
                          Actual Weight
                        </label>
                        <div className="relative">
                          <input 
                            type="number" 
                            step="0.1" 
                            placeholder={request.estimatedWeightKg} 
                            value={actualWeights[request.id] || ''} 
                            onChange={(e) => setActualWeights({...actualWeights, [request.id]: e.target.value})} 
                            className="w-full bg-gray-50/50 border border-borderMain rounded-xl pl-3 pr-9 py-3.5 text-sm font-semibold text-textMain focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary pointer-events-none">kg</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleConfirmPickup(request.id, request.estimatedWeightKg)} 
                        disabled={isProcessing} 
                        className="w-full sm:flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-primary/20"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Picked Up</>}
                      </button>
                    </div>
                  )}
                  
                  {isPickedUp && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="w-full sm:flex-1 relative">
                        <select
                          value={selectedRecyclers[request.id] || ''}
                          onChange={(e) => setSelectedRecyclers({ ...selectedRecyclers, [request.id]: e.target.value })}
                          className="w-full bg-gray-50/50 border border-borderMain rounded-xl px-3 py-3.5 text-sm font-semibold text-textMain focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                        >
                          <option value="" disabled>Select recycler hub...</option>
                          {recyclers.map(recycler => (
                            <option value={recycler.id} key={recycler.id}>{recycler.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleHandoff(request.id, request.actualWeightKg || request.estimatedWeightKg)}
                        disabled={isProcessing || !selectedRecyclers[request.id]}
                        className="w-full sm:flex-1 bg-surface hover:bg-borderMain text-primary disabled:opacity-50 font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 border border-primary/20 transition-colors"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Truck size={18} /> Secure Handoff</>}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectorDashboard;
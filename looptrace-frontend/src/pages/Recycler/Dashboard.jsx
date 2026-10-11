import React, { useEffect, useState } from 'react';
import { 
  Recycle, Loader2, Factory, CheckCircle2, 
  AlertTriangle, Truck, Settings, ShieldCheck, 
  Box
} from 'lucide-react';
import api from '../../services/api';

const RecyclerDashboard = () => {
  const sessionUser = JSON.parse(sessionStorage.getItem('looptrace_user') || '{}');
  const RECYCLER_ID = sessionUser?.participantId;

  const [facilities, setFacilities] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchData = async (isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
      setLoadError(null);
    }
    
    if (!RECYCLER_ID) {
      setLoadError("Your account is not linked to an approved recycler facility. Please contact an administrator.");
      setIsLoading(false);
      return;
    }

    try {
      const [networkFacilities, assignedJobs] = await Promise.all([
        api.public.getRecyclers(),
        api.recycler.getAssignedJobs(RECYCLER_ID)
      ]);
      setFacilities(networkFacilities);
      setJobs(assignedJobs);
      setLoadError(null);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Unable to load facility data from the server.';
      
      if (!isSilentRefresh) {
        setLoadError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (jobId, actionType, statusParam = null) => {
    setActionLoading(jobId);
    setActionError(null); 
    
    try {
      if (actionType === 'RECEIVE') {
        await api.recycler.confirmReceipt(jobId, RECYCLER_ID);
      } else if (actionType === 'UPDATE_STATUS') {
        await api.recycler.updateStatus(jobId, RECYCLER_ID, statusParam);
      }
      await fetchData(true); 
    } catch (error) {
      console.error("Transaction Error:", error);
      let errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to process transaction.";
      
      // SANITIZER: Mask raw SQL/Database trace leaks from the backend
      if (errorMsg.includes('could not execute statement') || errorMsg.includes('constraint')) {
        errorMsg = `Database Error: The status '${statusParam}' is blocked by a database constraint. Please update the DB schema.`;
      } else if (errorMsg.includes('SQL')) {
        errorMsg = "A database query failed during the transaction.";
      } else if (errorMsg === 'Internal Server Error') {
        errorMsg = "Ledger validation failed. The backend may be synchronizing.";
      }
      
      // Fallback: If the string is still massively long, truncate it so it doesn't break the UI
      if (errorMsg.length > 150) {
        errorMsg = "An unexpected backend error occurred. Please check server logs.";
      }
      
      setActionError({ id: jobId, message: errorMsg });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingReceiptCount = jobs.filter(j => j.status === 'HANDED_OFF').length;
  const processingCount = jobs.filter(j => j.status === 'RECYCLER_RECEIVED' || j.status === 'RECYCLING_PROCESSING').length;
  const completedCount = jobs.filter(j => j.status === 'RECYCLING_COMPLETED').length;
  
  const myFacility = facilities.find(f => f.id === RECYCLER_ID);

  return (
    <div className="pb-24 font-sans animate-fade-in-up">
      
      {/* Premium Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mb-3">
            <Factory size={14} /> Facility Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain tracking-tight">
            {myFacility ? myFacility.name : 'Recycler Dashboard'}
          </h1>
          <p className="text-secondary text-sm font-medium mt-1">Manage incoming handoffs and processing pipelines.</p>
        </div>
        <button 
          onClick={() => fetchData()} 
          className="bg-white border border-borderMain hover:bg-surface text-textMain text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {/* Mobile-First Swipeable Stats Grid */}
      <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto snap-x snap-mandatory flex sm:grid sm:grid-cols-3 gap-4 lg:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center text-warning mb-4 border border-warning/20">
            <Truck size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : pendingReceiptCount}</div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Pending Receipt</div>
          </div>
        </div>

        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 border border-purple-100">
            <Settings size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : processingCount}</div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">In Processing</div>
          </div>
        </div>

        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary mb-4 border border-primary/20">
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-textMain leading-none mb-1">{isLoading ? '-' : completedCount}</div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Total Completed</div>
          </div>
        </div>

      </div>

      {/* Main Jobs Pipeline */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider">Syncing Facility Ledger...</p>
        </div>
      ) : loadError ? (
        <div className="bg-red-50 rounded-3xl p-8 sm:p-12 text-center border border-red-100 shadow-sm">
          <AlertTriangle size={32} className="mx-auto text-red-500 mb-4" />
          <p className="text-lg font-bold text-red-800 mb-1">Access Restricted</p>
          <p className="text-sm text-red-700 font-medium">{loadError}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-borderMain/60 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
            <Box size={36} />
          </div>
          <p className="text-xl font-extrabold text-textMain mb-2">Pipeline Empty</p>
          <p className="text-sm text-secondary font-medium max-w-sm">
            There are no assigned handoffs from collectors waiting at this facility.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl font-extrabold text-textMain tracking-tight px-1">Active Pipeline</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {jobs.map(job => {
              const isProcessing = actionLoading === job.id;
              const hasError = actionError?.id === job.id;
              
              // Determine UI based on status
              const isHandedOff = job.status === 'HANDED_OFF';
              const isReceived = job.status === 'RECYCLER_RECEIVED';
              const isProcessingPipeline = job.status === 'RECYCLING_PROCESSING';
              const isCompleted = job.status === 'RECYCLING_COMPLETED';

              return (
                <div key={job.id} className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col">
                  
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      ID: {job.id.split('-')[0]}
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      isHandedOff ? 'bg-[#FFF8E6] text-[#996500] border-warning/20' :
                      isReceived ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      isProcessingPipeline ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      'bg-surface text-primary border-primary/20'
                    }`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="flex gap-4 mb-6 flex-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border bg-gray-50 border-gray-100 text-gray-500">
                      <Recycle size={24} strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-lg font-extrabold text-textMain truncate leading-tight mb-2">
                        {job.materialCategory}
                      </h3>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                          <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded text-gray-500 truncate">
                            {job.collectorId || 'Unknown Collector'}
                          </span>
                        </div>
                        {job.actualWeightKg && (
                          <div className="text-xs font-medium text-secondary">
                            Recorded Weight: <strong className="text-textMain">{job.actualWeightKg} kg</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sanitized Inline Action Error */}
                  {hasError && (
                    <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2.5 items-center text-red-600 animate-fade-in text-xs font-bold shadow-sm">
                      <AlertTriangle size={16} className="shrink-0" />
                      <p className="leading-tight">{actionError.message}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-5 border-t border-borderMain/50">
                    
                    {isHandedOff && (
                      <button 
                        onClick={() => handleAction(job.id, 'RECEIVE')}
                        disabled={isProcessing}
                        className="w-full bg-textMain hover:bg-black disabled:bg-gray-400 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-gray-200"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Confirm Receipt & Hash</>}
                      </button>
                    )}

                    {isReceived && (
                      <button 
                        onClick={() => handleAction(job.id, 'UPDATE_STATUS', 'RECYCLING_PROCESSING')}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-blue-200"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Settings size={18} /> Start Processing</>}
                      </button>
                    )}

                    {isProcessingPipeline && (
                      <button 
                        onClick={() => handleAction(job.id, 'UPDATE_STATUS', 'RECYCLING_COMPLETED')}
                        disabled={isProcessing}
                        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-primary/20"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Complete Recycling</>}
                      </button>
                    )}

                    {isCompleted && (
                      <div className="w-full bg-surface text-primary font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 border border-primary/20">
                        <CheckCircle2 size={18} /> Verifiably Recycled
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclerDashboard;
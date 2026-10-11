import React, { useState, useEffect } from 'react';
import { 
  Calendar, Info, TrendingUp, Laptop,
  Smartphone, Battery, Cable, CheckCircle2, 
  ShieldCheck, ArrowRight, ExternalLink, 
  BarChart3, Users, FileText, IndianRupee,
  Activity, ArrowUpRight, ChevronDown, Leaf
} from 'lucide-react';
import api from '../../services/api';

const ImpactDashboard = () => {
  const [impactData, setImpactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Fetch real metrics from the backend if available
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.public.getImpactTotals();
        setImpactData(data);
      } catch (error) {
        setLoadError(error.response?.data?.error || 'Unable to load impact statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Demo Recent Activity (Usually fetched from a dedicated endpoint)
  const recentActivity = [];

  // Derived values for the UI
  const totalWeight = impactData ? impactData.totalCollectedWeightKg.toFixed(1) : '-';
  const estimatedValue = '—';
  const categoryTotals = impactData?.weightByCategoryKg
    ? Object.entries(impactData.weightByCategoryKg)
    : [];

  return (
    <div className="min-h-screen bg-[#FAFCFA] pb-28 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-borderMain/50">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" strokeWidth={2.5} />
            <span className="font-extrabold text-lg tracking-tight text-textMain">Impact</span>
          </div>
          {loadError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {loadError}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FFF8E6] border border-warning/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#996500]">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
              Live Network
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain tracking-tight mb-2">Macro Overview</h1>
            <p className="text-secondary text-sm sm:text-base font-medium max-w-md">
              System-wide e-waste recovery, material flow, and verifiable environmental impact.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-borderMain px-4 py-2 rounded-full text-xs font-bold text-textMain shadow-sm hover:border-primary/30 transition-colors">
              <Calendar size={14} className="text-primary" />
              This Month
            </button>
          </div>
        </div>

        {/* Top KPI Cards (Bento Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          
          {/* KPI 1 */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary mb-4 border border-primary/10">
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-textMain mb-1">
              {isLoading ? '-' : totalWeight}<span className="text-sm font-bold text-secondary ml-1">kg</span>
            </div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3">Diverted</div>
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold">
              <span className="text-secondary font-medium">Live API total</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-textMain mb-1">
              {isLoading || !impactData ? '-' : impactData.completedHandoffs}
            </div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3">Verified Handoffs</div>
            <div className="flex items-center gap-1 text-blue-600 text-[10px] font-bold">
              <span className="text-secondary font-medium">Live API total</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-textMain mb-1">
              {isLoading || !impactData ? '-' : impactData.activeRequests}
            </div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3">Active Jobs</div>
            <div className="flex items-center gap-1 text-indigo-600 text-[10px] font-bold">
              <Activity size={12} /> Live tracking
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center text-warning mb-4 border border-warning/20">
              <IndianRupee size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-textMain mb-1">
              {isLoading ? '-' : estimatedValue}
            </div>
            <div className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3">Est. Value</div>
            <div className="flex items-center gap-1 text-warning text-[10px] font-bold">
              <span className="text-secondary font-medium">Not provided by API</span>
            </div>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          
          {/* Smooth Line Chart (SVG) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-lg font-extrabold text-textMain tracking-tight">Recovery Velocity</h2>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mt-1">Kg diverted over time</p>
              </div>
              <button className="bg-surface border border-primary/20 rounded-full px-4 py-2 text-xs font-bold text-primary flex items-center gap-1 hover:bg-primary hover:text-white transition-colors">
                Last 30 Days <ChevronDown size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="flex-1 w-full min-h-[200px] flex items-center justify-center rounded-xl border border-dashed border-borderMain/60">
              <p className="text-sm font-medium text-secondary text-center px-6">
                Recovery history is not provided by the impact API yet.
              </p>
            </div>
          </div>

          {/* Premium Donut Chart */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60">
            <h2 className="text-lg font-extrabold text-textMain tracking-tight mb-1">Material Flow</h2>
            <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-8">Composition by category</p>
            
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full mb-8 shadow-inner bg-gray-100">
                <div className="absolute inset-[18%] bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgb(0,0,0,0.05)]">
                  <div className="text-xl sm:text-2xl font-extrabold text-textMain">{totalWeight}</div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">Total kg</div>
                </div>
              </div>
              
              <div className="w-full space-y-3.5">
                {categoryTotals.length === 0 ? (
                  <p className="text-sm font-medium text-secondary text-center">No category data available.</p>
                ) : categoryTotals.map(([name, value], i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-sm"></div>
                      <span className="font-bold text-textMain">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-textMain">{value.toFixed(2)} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Table & Security) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Recent Activity List (Mobile Optimized) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-borderMain/60">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-textMain tracking-tight">Ledger Activity</h2>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mt-1">Recent cryptographic entries</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="rounded-xl border border-dashed border-borderMain/60 p-8 text-center text-sm font-medium text-secondary">
                  Recent activity is not provided by the API yet.
                </p>
              ) : recentActivity.map((activity, i) => {
                const MatIcon = activity.icon;
                const isComplete = activity.status === 'Picked up' || activity.status === 'Delivered';
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-borderMain/50 hover:bg-[#FAFCFA] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <MatIcon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-sm text-textMain">{activity.material}</h4>
                          <span className="text-[10px] font-mono text-secondary px-1.5 py-0.5 bg-gray-100 rounded">
                            {activity.id}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-secondary">
                          {activity.collector} • <span className="text-textMain">{activity.weight}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        isComplete ? 'bg-surface text-primary border-primary/20' : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {activity.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Deep Dive Cards */}
          <div className="space-y-5">
            <div className="bg-textMain text-white rounded-[2rem] p-6 shadow-lg border border-gray-800">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-primary mb-5 border border-gray-700">
                <Info size={24} />
              </div>
              <h3 className="text-lg font-extrabold tracking-tight mb-2">Calculation Methodology</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                Environmental benefits and material value recovered are algorithmic estimates based on live market rates and documented average device composition.
              </p>
              <button className="text-sm font-bold text-primary flex items-center gap-1 hover:text-white transition-colors group">
                Read whitepaper <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <button className="w-full bg-white hover:bg-surface border border-borderMain rounded-[2rem] p-6 flex items-center justify-between group transition-colors shadow-sm">
              <div className="flex gap-4 items-center text-left">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
                  <ExternalLink size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-textMain mb-1">Verify Traceability</h3>
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Explore the SHA-256 Ledger</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
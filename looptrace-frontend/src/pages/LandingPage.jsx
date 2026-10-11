import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Truck, BarChart3, ShieldCheck, 
  Sparkles, ArrowRight, Lock, Server, Database,
  CheckCircle2, MapPin, Recycle, AlertTriangle,
  UploadCloud, BrainCircuit, Fingerprint, Globe, ImagePlus
} from 'lucide-react';

const LandingPage = ({ setRole }) => {
  const navigate = useNavigate();

  const handleNavigation = (role, path) => {
    setRole(role);
    navigate(path);
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] flex flex-col font-sans selection:bg-primary selection:text-white overflow-hidden relative">
      
      {/* Premium Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-20 md:pt-28 md:pb-28 px-5 max-w-5xl mx-auto w-full text-center z-10 animate-fade-in-up">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/20 text-primary font-bold text-xs md:text-sm mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
          <Sparkles size={14} className="text-primary animate-pulse" /> 
          AI-Powered E-Waste Traceability
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-textMain tracking-tighter mb-6 leading-[1.05]">
          Formalizing the informal <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
            e-waste economy.
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-secondary font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          LoopTrace bridges the gap between households and recyclers. We use <strong className="text-textMain">advanced AI</strong> to categorize electronics and a <strong className="text-textMain">SHA-256 verifiable ledger</strong> to guarantee secure, end-to-end recycling.
        </p>

        {/* Premium Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-textMain hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-[0_8px_20px_rgb(0,0,0,0.12)] group"
          >
            Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => handleNavigation('public', '/household/impact')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-textMain border border-gray-200 px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            <Globe size={18} className="text-gray-400" /> Impact Overview
          </button>
        </div>
      </div>

      {/* Expanded Architecture Bento Grid */}
      <div id="architecture-section" className="bg-white py-24 border-y border-gray-100 relative z-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">Under the Hood</h2>
            <p className="text-secondary font-medium text-sm md:text-base max-w-2xl mx-auto">
              Enterprise-grade infrastructure built for transparency, security, and global scale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">Advanced AI Vision</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                Sophisticated vision models automatically analyze uploaded photos to categorize electronics and accurately estimate material weight.
              </p>
            </div>

            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#FFF8E6] text-warning rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Server size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">Amazon EC2 Compute</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                Our high-performance Spring Boot matching engine is hosted on scalable Amazon EC2 instances, ensuring low latency and high availability.
              </p>
            </div>

            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">Amazon S3 Storage</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                User-uploaded images and documents are securely isolated in private S3 buckets, guaranteeing data privacy and rapid retrieval.
              </p>
            </div>

            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-surface text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Fingerprint size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">SHA-256 Custody</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                Every physical handoff is cryptographically hashed in the backend, creating an immutable and auditable timeline.
              </p>
            </div>

            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">Smart Matching</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                Hyperlocal dispatch algorithms instantly ping nearby informal collectors based on geolocation, optimizing their daily routes.
              </p>
            </div>

            <div className="bg-[#FAFCFA] p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Database size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-textMain mb-2">PostgreSQL Database</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium">
                Relational state, participant roles, and spatial data are securely persisted in a fully managed PostgreSQL relational database.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 5-Step Visual Journey */}
      <div className="bg-[#FAFCFA] py-24 border-b border-gray-100 relative z-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">The Traceability Journey</h2>
            <p className="text-secondary font-medium text-sm md:text-base">How we mathematically guarantee e-waste stays out of the landfill.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              
              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#FAFCFA] border border-gray-100 rounded-2xl flex items-center justify-center text-primary mb-5 shadow-sm">
                  <ImagePlus size={26} strokeWidth={2.5} />
                </div>
                <h5 className="font-extrabold text-sm text-textMain mb-2">1. Upload Photo</h5>
                <p className="text-xs text-secondary leading-relaxed font-medium">User uploads a photo securely via our responsive UI.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#FAFCFA] border border-gray-100 rounded-2xl flex items-center justify-center text-primary mb-5 shadow-sm">
                  <BrainCircuit size={26} strokeWidth={2.5} />
                </div>
                <h5 className="font-extrabold text-sm text-textMain mb-2">2. AI Analysis</h5>
                <p className="text-xs text-secondary leading-relaxed font-medium">Vision models extract the material category and weight.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#FAFCFA] border border-gray-100 rounded-2xl flex items-center justify-center text-primary mb-5 shadow-sm">
                  <Truck size={26} strokeWidth={2.5} />
                </div>
                <h5 className="font-extrabold text-sm text-textMain mb-2">3. Collector Pickup</h5>
                <p className="text-xs text-secondary leading-relaxed font-medium">A matched local kabadiwala accepts and logs the pickup.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#FAFCFA] border border-gray-100 rounded-2xl flex items-center justify-center text-primary mb-5 shadow-sm">
                  <Recycle size={26} strokeWidth={2.5} />
                </div>
                <h5 className="font-extrabold text-sm text-textMain mb-2">4. Recycler Handoff</h5>
                <p className="text-xs text-secondary leading-relaxed font-medium">The informal collector safely transfers to a certified facility.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-textMain rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-black/10">
                  <ShieldCheck size={26} strokeWidth={2.5} className="text-primary" />
                </div>
                <h5 className="font-extrabold text-sm text-textMain mb-2">5. Cryptographic Proof</h5>
                <p className="text-xs text-secondary leading-relaxed font-medium">The entire chain is mathematically hashed via SHA-256.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Section */}
      {/* <div id="impact-section" className="bg-textMain py-24 text-center relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-primary/5 opacity-50 pattern-grid-lg pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white font-bold text-xs mb-8">
            <Globe size={14} /> Global Impact Metrics
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Projected Environmental Impact
          </h2>
          <p className="text-gray-400 font-medium text-sm md:text-lg mb-16 max-w-2xl mx-auto">
            These figures represent our target scaling goals for the first year of deployment, assuming successful adoption by the informal sector.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-extrabold text-primary mb-3">50K+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kg E-Waste Diverted</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-extrabold text-blue-400 mb-3">2.5K+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Collectors</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-5xl font-extrabold text-warning mb-3">100%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">SHA-256 Verified</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Interactive Demo Portals */}
      <div id="demo-portals" className="bg-white py-24 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight">Interactive Portals</h2>
            <p className="text-secondary font-medium mt-3 text-sm md:text-base max-w-2xl mx-auto">
              Experience the platform from the perspective of our key stakeholders. Select a role below to launch the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Household Portal */}
            <div 
              onClick={() => handleNavigation('household', '/household/request')}
              className="group relative bg-[#FAFCFA] rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-primary/40 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <User size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-textMain mb-3">Household Role</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                Upload a photo of your e-waste. Let AI categorize it, and instantly match with a nearby collector.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-gray-100 group-hover:border-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">Launch Portal</span>
                <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Collector Portal */}
            <div 
              onClick={() => handleNavigation('collector', '/collector/dashboard')}
              className="group relative bg-[#FAFCFA] rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-blue-400/40 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-textMain mb-3">Collector Role</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                Act as the informal kabadiwala. View AI-matched jobs nearby, accept pickups, and log verified handoffs.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-gray-100 group-hover:border-blue-200 transition-colors">
                <span className="text-blue-600 font-bold text-sm">Open Dashboard</span>
                <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Impact Dashboard */}
            <div 
              onClick={() => handleNavigation('public', '/household/impact')}
              className="group relative bg-[#FAFCFA] rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-warning/40 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-warning/5 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center text-warning mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-textMain mb-3">Impact Overview</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                View the macro results. A live dashboard displaying total kg of e-waste successfully diverted and system health.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-gray-100 group-hover:border-warning/20 transition-colors">
                <span className="text-warning font-bold text-sm">View Metrics</span>
                <ArrowRight size={18} className="text-warning group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
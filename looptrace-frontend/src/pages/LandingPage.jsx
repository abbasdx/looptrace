// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, Truck, BarChart3, ShieldCheck, 
//   Sparkles, ArrowRight, Lock,
//   CheckCircle2, MapPin, Recycle, AlertTriangle,
//   UploadCloud, BrainCircuit, Fingerprint, Globe, ImagePlus
// } from 'lucide-react';

// const LandingPage = ({ setRole }) => {
//   const navigate = useNavigate();

//   const handleNavigation = (role, path) => {
//     setRole(role);
//     navigate(path);
//   };

//   const scrollToSection = (id) => {
//     document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="min-h-screen bg-[#FAFCFA] flex flex-col font-sans selection:bg-primary selection:text-white overflow-hidden">
      
//       {/* Hero Section */}
//       <div className="relative pt-16 pb-16 md:pt-28 md:pb-20 px-5 max-w-7xl mx-auto w-full text-center z-10">
//         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

//         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-primary/20 text-primary font-bold text-xs md:text-sm mb-6 animate-fade-in">
//           <Sparkles size={14} /> AI-Powered E-Waste Recovery
//         </div>
        
//         <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-textMain tracking-tighter mb-6 leading-[1.05]">
//           Formalizing the informal <br className="hidden md:block" />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
//             e-waste economy.
//           </span>
//         </h1>
        
//         <p className="text-base md:text-xl text-secondary font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
//           LoopTrace bridges the gap between households and recyclers. We use <strong className="text-textMain">Google Gemini AI</strong> to identify your electronics and a <strong className="text-textMain">SHA-256 verifiable ledger</strong> to guarantee safe, end-to-end recycling.
//         </p>

//         {/* Updated Hero CTAs */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <button 
//             onClick={() => navigate('/auth')}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all active:scale-95 shadow-xl shadow-primary/20"
//           >
//             Get Started <ArrowRight size={18} />
//           </button>
//           <button 
//             onClick={() => handleNavigation('public', '/household/impact')}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-textMain border border-borderMain px-8 py-4 rounded-full font-bold text-base transition-all active:scale-95 shadow-sm"
//           >
//             <Globe size={18} className="text-secondary" /> Impact Overview
//           </button>
//         </div>
//       </div>

//       {/* Feature Architecture Cards */}
//       <div id="architecture-section" className="bg-[#F8FAF7] py-20 border-y border-borderMain relative z-20 scroll-mt-16">
//         <div className="max-w-7xl mx-auto px-5">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">Under the Hood</h2>
//             <p className="text-secondary font-medium text-sm md:text-base">Modern infrastructure built for transparency, security, and scale.</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
//                 <UploadCloud size={24} />
//               </div>
//               <h3 className="text-lg font-bold text-textMain mb-2">Private S3 Storage</h3>
//               <p className="text-sm text-secondary leading-relaxed">
//                 User-uploaded images are securely stored in private cloud buckets, ensuring data privacy and efficient retrieval.
//               </p>
//             </div>
            
//             <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
//                 <BrainCircuit size={24} />
//               </div>
//               <h3 className="text-lg font-bold text-textMain mb-2">Google Gemini AI</h3>
//               <p className="text-sm text-secondary leading-relaxed">
//                 Advanced vision models automatically categorize uploaded electronics and accurately estimate material weight.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-[#FFF8E6] text-warning rounded-xl flex items-center justify-center mb-4">
//                 <MapPin size={24} />
//               </div>
//               <h3 className="text-lg font-bold text-textMain mb-2">Smart Matching</h3>
//               <p className="text-sm text-secondary leading-relaxed">
//                 Hyperlocal dispatch algorithms instantly ping nearby informal collectors, optimizing their routes and income.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
//               <div className="w-12 h-12 bg-surface text-primary rounded-xl flex items-center justify-center mb-4">
//                 <Fingerprint size={24} />
//               </div>
//               <h3 className="text-lg font-bold text-textMain mb-2">SHA-256 Custody</h3>
//               <p className="text-sm text-secondary leading-relaxed">
//                 Every physical handoff is cryptographically hashed in our Spring Boot backend, creating an immutable timeline.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 5-Step Visual Journey */}
//       <div className="bg-white py-20 border-b border-borderMain relative z-20">
//         <div className="max-w-7xl mx-auto px-5">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">The Traceability Journey</h2>
//             <p className="text-secondary font-medium text-sm md:text-base">How we guarantee e-waste stays out of the landfill.</p>
//           </div>

//           <div className="relative">
//             <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-borderMain -translate-y-1/2 z-0"></div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              
//               <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
//                 <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
//                   <ImagePlus size={24} />
//                 </div>
//                 <h5 className="font-bold text-sm text-textMain mb-2">1. Upload Photo</h5>
//                 <p className="text-xs text-secondary leading-relaxed">User uploads a photo securely via our responsive PWA interface.</p>
//               </div>

//               <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
//                 <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
//                   <BrainCircuit size={24} />
//                 </div>
//                 <h5 className="font-bold text-sm text-textMain mb-2">2. AI Analysis</h5>
//                 <p className="text-xs text-secondary leading-relaxed">Google Gemini processes the image to extract material category and weight.</p>
//               </div>

//               <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
//                 <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
//                   <Truck size={24} />
//                 </div>
//                 <h5 className="font-bold text-sm text-textMain mb-2">3. Collector Pickup</h5>
//                 <p className="text-xs text-secondary leading-relaxed">A matched local kabadiwala accepts the job and records the physical pickup.</p>
//               </div>

//               <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
//                 <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
//                   <Recycle size={24} />
//                 </div>
//                 <h5 className="font-bold text-sm text-textMain mb-2">4. Recycler Handoff</h5>
//                 <p className="text-xs text-secondary leading-relaxed">The informal collector safely transfers the batch to a certified facility.</p>
//               </div>

//               <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
//                 <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-md shadow-primary/30">
//                   <ShieldCheck size={24} />
//                 </div>
//                 <h5 className="font-bold text-sm text-textMain mb-2">5. Cryptographic Proof</h5>
//                 <p className="text-xs text-secondary leading-relaxed">The entire chain is verified and mathematically hashed via SHA-256.</p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Environmental Impact (Prototype Targets) */}
//       <div id="impact-section" className="bg-textMain py-20 text-center relative overflow-hidden scroll-mt-16">
//         <div className="absolute inset-0 bg-primary/5 opacity-50 pattern-grid-lg pointer-events-none"></div>
//         <div className="max-w-4xl mx-auto px-5 relative z-10">
//           <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-bold text-xs mb-6">
//             <Globe size={14} /> Prototype Demo Metrics
//           </div>
//           <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
//             Projected Environmental Impact
//           </h2>
//           <p className="text-gray-400 font-medium text-sm md:text-lg mb-12 max-w-2xl mx-auto">
//             These figures represent our target scaling goals for the first year of deployment, assuming successful adoption by the informal sector.
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
//               <div className="text-4xl font-extrabold text-primary mb-2">50,000+</div>
//               <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kg E-Waste Diverted Target</div>
//             </div>
//             <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
//               <div className="text-4xl font-extrabold text-blue-400 mb-2">2,500+</div>
//               <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Collectors Goal</div>
//             </div>
//             <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
//               <div className="text-4xl font-extrabold text-warning mb-2">100%</div>
//               <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">SHA-256 Verified</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Interactive Demo Portals (Bento Grid) */}
//       <div id="demo-portals" className="bg-[#FAFCFA] py-20 scroll-mt-16">
//         <div className="max-w-7xl mx-auto px-5">
          
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight">Hackathon Demo Portals</h2>
//             <p className="text-secondary font-medium mt-3 text-sm md:text-base">Experience the platform from the perspective of our key stakeholders. <br className="hidden md:block"/> (Bypasses authentication for demo purposes).</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
//             {/* Household Portal */}
//             <div 
//               onClick={() => handleNavigation('household', '/household/request')}
//               className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
//             >
//               <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <User size={28} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-2xl font-bold text-textMain mb-3">Household Role</h3>
//               <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
//                 Upload a photo of your e-waste. Let Google Gemini categorize it, and instantly match with a nearby collector.
//               </p>
//               <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
//                 <span className="text-primary font-bold text-sm">Launch Portal</span>
//                 <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
//               </div>
//             </div>

//             {/* Collector Portal */}
//             <div 
//               onClick={() => handleNavigation('collector', '/collector/dashboard')}
//               className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-blue-400/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col"
//             >
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Truck size={28} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-2xl font-bold text-textMain mb-3">Collector Role</h3>
//               <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
//                 Act as the informal kabadiwala. View AI-matched jobs nearby, accept pickups, and log verified handoffs.
//               </p>
//               <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
//                 <span className="text-blue-600 font-bold text-sm">Open Dashboard</span>
//                 <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
//               </div>
//             </div>

//             {/* Impact Dashboard */}
//             <div 
//               onClick={() => handleNavigation('public', '/household/impact')}
//               className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-warning/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-warning/10 hover:-translate-y-1 flex flex-col"
//             >
//               <div className="w-14 h-14 bg-[#FFF8E6] rounded-2xl flex items-center justify-center text-warning mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <BarChart3 size={28} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-2xl font-bold text-textMain mb-3">Impact Overview</h3>
//               <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
//                 View the macro results. A live dashboard displaying total kg of e-waste successfully diverted and system health.
//               </p>
//               <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
//                 <span className="text-warning font-bold text-sm">View Metrics</span>
//                 <ArrowRight size={18} className="text-warning group-hover:translate-x-1 transition-transform" />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default LandingPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Truck, BarChart3, ShieldCheck, 
  Sparkles, ArrowRight, Lock,
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
    <div className="min-h-screen bg-[#FAFCFA] flex flex-col font-sans selection:bg-primary selection:text-white overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-16 md:pt-28 md:pb-20 px-5 max-w-7xl mx-auto w-full text-center z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-primary/20 text-primary font-bold text-xs md:text-sm mb-6 animate-fade-in">
          <Sparkles size={14} /> AI-Powered E-Waste Recovery
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-textMain tracking-tighter mb-6 leading-[1.05]">
          Formalizing the informal <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            e-waste economy.
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-secondary font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          LoopTrace bridges the gap between households and recyclers. We use <strong className="text-textMain">advanced AI</strong> to identify your electronics, <strong className="text-textMain">Amazon S3</strong> for secure uploads, and a <strong className="text-textMain">SHA-256 verifiable ledger</strong> to guarantee safe, end-to-end recycling.
        </p>

        {/* Updated Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all active:scale-95 shadow-xl shadow-primary/20"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => scrollToSection('impact-section')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-textMain border border-borderMain px-8 py-4 rounded-full font-bold text-base transition-all active:scale-95 shadow-sm"
          >
            <Globe size={18} className="text-secondary" /> Impact Overview
          </button>
        </div>
      </div>

      {/* Feature Architecture Cards */}
      <div id="architecture-section" className="bg-[#F8FAF7] py-20 border-y border-borderMain relative z-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">Under the Hood</h2>
            <p className="text-secondary font-medium text-sm md:text-base">Modern infrastructure built for transparency, security, and scale.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <UploadCloud size={24} />
              </div>
              <h3 className="text-lg font-bold text-textMain mb-2">Amazon S3 Storage</h3>
              <p className="text-sm text-secondary leading-relaxed">
                User-uploaded images are securely stored in private Amazon S3 buckets, ensuring data privacy and robust scalability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-lg font-bold text-textMain mb-2">Advanced AI Vision</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Sophisticated AI models automatically analyze uploaded photos to categorize electronics and accurately estimate material weight.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFF8E6] text-warning rounded-xl flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-textMain mb-2">Smart Matching</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Hyperlocal dispatch algorithms instantly ping nearby informal collectors, optimizing their routes and income.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-borderMain shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-surface text-primary rounded-xl flex items-center justify-center mb-4">
                <Fingerprint size={24} />
              </div>
              <h3 className="text-lg font-bold text-textMain mb-2">SHA-256 Custody</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Every physical handoff is cryptographically hashed in our Spring Boot backend, creating an immutable timeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Visual Journey */}
      <div className="bg-white py-20 border-b border-borderMain relative z-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight mb-4">The Traceability Journey</h2>
            <p className="text-secondary font-medium text-sm md:text-base">How we guarantee e-waste stays out of the landfill.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-borderMain -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
              
              <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
                <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
                  <ImagePlus size={24} />
                </div>
                <h5 className="font-bold text-sm text-textMain mb-2">1. Upload Photo</h5>
                <p className="text-xs text-secondary leading-relaxed">User uploads a photo securely via our responsive PWA interface.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
                <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
                  <BrainCircuit size={24} />
                </div>
                <h5 className="font-bold text-sm text-textMain mb-2">2. AI Analysis</h5>
                <p className="text-xs text-secondary leading-relaxed">Our AI vision model processes the image to extract material category and weight.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
                <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
                  <Truck size={24} />
                </div>
                <h5 className="font-bold text-sm text-textMain mb-2">3. Collector Pickup</h5>
                <p className="text-xs text-secondary leading-relaxed">A matched local kabadiwala accepts the job and records the physical pickup.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
                <div className="w-14 h-14 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
                  <Recycle size={24} />
                </div>
                <h5 className="font-bold text-sm text-textMain mb-2">4. Recycler Handoff</h5>
                <p className="text-xs text-secondary leading-relaxed">The informal collector safely transfers the batch to a certified facility.</p>
              </div>

              <div className="flex flex-col items-center text-center bg-[#FAFCFA] p-6 rounded-3xl border border-borderMain shadow-sm">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-md shadow-primary/30">
                  <ShieldCheck size={24} />
                </div>
                <h5 className="font-bold text-sm text-textMain mb-2">5. Cryptographic Proof</h5>
                <p className="text-xs text-secondary leading-relaxed">The entire chain is verified and mathematically hashed via SHA-256.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact (Prototype Targets) */}
      <div id="impact-section" className="bg-textMain py-20 text-center relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-primary/5 opacity-50 pattern-grid-lg pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-bold text-xs mb-6">
            <Globe size={14} /> Prototype Demo Metrics
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Projected Environmental Impact
          </h2>
          <p className="text-gray-400 font-medium text-sm md:text-lg mb-12 max-w-2xl mx-auto">
            These figures represent our target scaling goals for the first year of deployment, assuming successful adoption by the informal sector.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
              <div className="text-4xl font-extrabold text-primary mb-2">50,000+</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kg E-Waste Diverted Target</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
              <div className="text-4xl font-extrabold text-blue-400 mb-2">2,500+</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Collectors Goal</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
              <div className="text-4xl font-extrabold text-warning mb-2">100%</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">SHA-256 Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Portals (Bento Grid) */}
      <div id="demo-portals" className="bg-[#FAFCFA] py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textMain tracking-tight">Hackathon Demo Portals</h2>
            <p className="text-secondary font-medium mt-3 text-sm md:text-base">Experience the platform from the perspective of our key stakeholders. <br className="hidden md:block"/> (Bypasses authentication for demo purposes).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Household Portal */}
            <div 
              onClick={() => handleNavigation('household', '/household/request')}
              className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <User size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3">Household Role</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                Upload a photo of your e-waste. Let AI categorize it, and instantly match with a nearby collector.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
                <span className="text-primary font-bold text-sm">Launch Portal</span>
                <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Collector Portal */}
            <div 
              onClick={() => handleNavigation('collector', '/collector/dashboard')}
              className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-blue-400/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3">Collector Role</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                Act as the informal kabadiwala. View AI-matched jobs nearby, accept pickups, and log verified handoffs.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
                <span className="text-blue-600 font-bold text-sm">Open Dashboard</span>
                <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Impact Dashboard */}
            <div 
              onClick={() => handleNavigation('public', '/household/impact')}
              className="group relative bg-white rounded-[2rem] p-8 md:p-10 border border-borderMain hover:border-warning/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-warning/10 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-14 h-14 bg-[#FFF8E6] rounded-2xl flex items-center justify-center text-warning mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3">Impact Overview</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed mb-8 flex-1">
                View the macro results. A live dashboard displaying total kg of e-waste successfully diverted and system health.
              </p>
              <div className="flex items-center justify-between w-full pt-5 border-t border-borderMain">
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
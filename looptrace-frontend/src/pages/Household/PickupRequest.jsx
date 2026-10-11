// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Sparkles, Camera, X, AlertTriangle, Calendar, 
//   MapPin, Weight, Monitor, ArrowRight, ShieldCheck,
//   Loader2, CheckCircle2, ChevronDown
// } from 'lucide-react';
// import api from '../../services/api';

// const PickupRequest = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // Form & UI State
//   const [selectedSlot, setSelectedSlot] = useState('morning');
//   const [formData, setFormData] = useState({
//     category: 'IT Equipment',
//     quantity: 2.0,
//     address: 'Sector 21, Gurugram, Haryana 122001',
//   });

//   // API Interaction State
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submittedRequest, setSubmittedRequest] = useState(null);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setIsAnalyzing(true);
//     setAiResult(null);

//     try {
//       const result = await api.household.analyzePhoto(file);
//       setAiResult({
//         device: result.device || 'Identified Device',
//         confidence: result.confidence || '94%',
//         category: result.category || 'IT Equipment',
//         materials: result.materials || 'Plastic, Metal, Circuit Boards',
//         estimatedWeight: result.estimatedWeight || '2.0',
//       });
      
//       setFormData(prev => ({
//         ...prev,
//         category: result.category || 'IT Equipment',
//         quantity: parseFloat(result.estimatedWeight) || 2.0
//       }));
//     } catch (error) {
//       console.error("AI Analysis failed:", error);
//       setTimeout(() => {
//         setAiResult({
//           device: 'MacBook Pro 15"',
//           confidence: '98%',
//           category: 'IT Equipment',
//           materials: 'Aluminum, Lithium, Glass',
//           estimatedWeight: '1.8'
//         });
//         setFormData(prev => ({ ...prev, category: 'IT Equipment', quantity: 1.8 }));
//       }, 1500);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     setImageFile(null);
//     setAiResult(null);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await api.household.createRequest({
//         householdName: 'Rahul Mehta',
//         materialCategory: formData.category,
//         estimatedWeightKg: formData.quantity,
//         pickupArea: formData.address,
//         latitude: 28.4595,
//         longitude: 77.0266,
//         photoKey: imageFile ? imageFile.name : null
//       });
//       setSubmittedRequest(response);
//     } catch (error) {
//       console.error("Failed to create request:", error);
//       alert("Failed to submit request. Ensure backend is running.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- Premium Success State ---
//   if (submittedRequest) {
//     return (
//       <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
//         <div className="relative mb-8">
//           <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
//           <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-xl relative z-10 border-4 border-white">
//             <CheckCircle2 size={48} strokeWidth={2.5} />
//           </div>
//         </div>
//         <h2 className="text-3xl font-extrabold text-textMain tracking-tight mb-3">Request Secured!</h2>
//         <p className="text-secondary text-base font-medium mb-10 max-w-sm leading-relaxed">
//           Your e-waste pickup <span className="font-bold text-textMain">(ID: {submittedRequest.id?.substring(0,6).toUpperCase() || 'LT-NEW'})</span> has been registered on the ledger and matched with a collector.
//         </p>
//         <button 
//           onClick={() => navigate('/shared/timeline')}
//           className="w-full sm:w-auto bg-textMain hover:bg-black text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform active:scale-95"
//         >
//           Track Custody Timeline <ArrowRight size={18} />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="pb-28 pt-2 px-4 sm:px-6">
      
//       {/* Page Header */}
//       <div className="mb-8 mt-4">
//         <h1 className="text-3xl font-extrabold text-textMain tracking-tight leading-tight mb-2">
//           Give your device a <br/>
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
//             better next life.
//           </span>
//         </h1>
//       </div>

//       <div className="space-y-6">
        
//         {/* Premium AI Scanner Card */}
//         <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60">
//           <div className="flex justify-between items-center mb-5 px-1">
//             <h2 className="text-lg font-bold text-textMain">Identify your e-waste</h2>
//             <span className="flex items-center gap-1.5 bg-surface text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wide">
//               <Sparkles size={12} /> AI Scanner
//             </span>
//           </div>
          
//           <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

//           {!imagePreview ? (
//             <div 
//               onClick={() => fileInputRef.current?.click()}
//               className="w-full h-48 rounded-2xl border-2 border-dashed border-borderMain bg-[#FAFCFA] flex flex-col items-center justify-center text-secondary hover:bg-surface hover:border-primary/30 transition-all cursor-pointer group"
//             >
//               <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
//                 <Camera size={24} strokeWidth={2.5} />
//               </div>
//               <span className="font-bold text-sm text-textMain mb-1">Tap to scan device</span>
//               <span className="text-xs font-medium">Amazon Bedrock will analyze it</span>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
              
//               {/* Image Preview with Viewfinder UI */}
//               <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-auto sm:h-64 border border-borderMain">
//                 <img 
//                   src={imagePreview} 
//                   alt="Upload preview" 
//                   className={`object-cover w-full h-full transition-all duration-700 ${isAnalyzing ? 'opacity-40 scale-105' : 'opacity-100 scale-100'}`}
//                 />
                
//                 {isAnalyzing && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
//                     <div className="w-16 h-16 relative">
//                       <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
//                       <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
//                     </div>
//                     <span className="text-xs font-bold text-white mt-4 tracking-widest uppercase shadow-black drop-shadow-md">Analyzing...</span>
//                   </div>
//                 )}

//                 {/* Viewfinder Corners */}
//                 {isAnalyzing && (
//                   <div className="absolute inset-4 z-10 pointer-events-none">
//                     <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
//                     <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
//                     <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
//                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
//                   </div>
//                 )}

//                 {!isAnalyzing && (
//                   <button onClick={removeImage} className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-colors z-20">
//                     <X size={16} strokeWidth={3} />
//                   </button>
//                 )}
//               </div>

//               {/* AI Results Bento Box */}
//               {aiResult && !isAnalyzing && (
//                 <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-borderMain animate-fade-in-up">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
//                         <Monitor size={20} strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-textMain leading-tight">{aiResult.device}</h3>
//                         <p className="text-[11px] text-accent font-bold mt-0.5">Match Confidence: {aiResult.confidence}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 text-sm mb-3">
//                     <div className="bg-white p-2.5 rounded-xl border border-borderMain/50">
//                       <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Category</div>
//                       <div className="font-semibold text-textMain truncate">{aiResult.category}</div>
//                     </div>
//                     <div className="bg-white p-2.5 rounded-xl border border-borderMain/50">
//                       <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Est. Weight</div>
//                       <div className="font-semibold text-textMain">{aiResult.estimatedWeight} kg</div>
//                     </div>
//                   </div>

//                   <div className="bg-[#FFF8E6] rounded-xl p-3 flex gap-3 items-start border border-warning/20">
//                     <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
//                     <p className="text-xs text-[#996500] font-medium leading-relaxed">
//                       Keep damaged batteries separate. Do not dismantle the device prior to pickup.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Premium Form Inputs */}
//         <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60">
//           <div className="flex items-center gap-2 mb-5 px-1">
//             <Calendar size={18} className="text-primary" />
//             <h2 className="text-lg font-bold text-textMain">Pickup Details</h2>
//           </div>

//           <div className="space-y-4">
//             {/* Custom Select */}
//             <div className="relative">
//               <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
//                 Material Category
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-4 text-secondary"><Monitor size={16} /></div>
//                 <select 
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value})}
//                   className="w-full bg-transparent border-2 border-borderMain rounded-xl pl-11 pr-10 py-3.5 text-sm font-semibold text-textMain appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
//                 >
//                   <option value="IT Equipment">IT Equipment</option>
//                   <option value="Mobile Phones">Mobile Phones</option>
//                   <option value="Cables & Accessories">Cables & Accessories</option>
//                   <option value="Mixed E-Waste">Mixed E-Waste</option>
//                 </select>
//                 <div className="absolute right-4 pointer-events-none text-secondary"><ChevronDown size={16} /></div>
//               </div>
//             </div>

//             {/* Quantity Input */}
//             <div className="relative">
//               <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
//                 Approximate Weight
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-4 text-secondary"><Weight size={16} /></div>
//                 <input 
//                   type="number" step="0.1"
//                   value={formData.quantity}
//                   onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
//                   className="w-full bg-transparent border-2 border-borderMain rounded-xl pl-11 pr-12 py-3.5 text-sm font-semibold text-textMain focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
//                 />
//                 <span className="absolute right-4 text-xs font-bold text-secondary">kg</span>
//               </div>
//             </div>

//             {/* Address Input */}
//             <div className="relative">
//               <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
//                 Pickup Address
//               </label>
//               <div className="relative flex items-center">
//                 <div className="absolute left-4 text-secondary"><MapPin size={16} /></div>
//                 <input 
//                   type="text" 
//                   value={formData.address}
//                   onChange={(e) => setFormData({...formData, address: e.target.value})}
//                   className="w-full bg-transparent border-2 border-borderMain rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-textMain focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="pt-2">
//           <button 
//             onClick={handleSubmit}
//             disabled={isSubmitting || isAnalyzing}
//             className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white font-bold text-base py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(22,101,52,0.25)] transition-all active:scale-[0.98]"
//           >
//             {isSubmitting ? (
//               <><Loader2 size={20} className="animate-spin" /> Securing on Ledger...</>
//             ) : (
//               <><Monitor size={20} /> Match with Collector <ArrowRight size={20} /></>
//             )}
//           </button>
//           <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] font-bold text-secondary uppercase tracking-wider">
//             <ShieldCheck size={14} className="text-primary" />
//             SHA-256 Verifiable Traceability
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PickupRequest;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Camera, X, AlertTriangle, Calendar, 
  MapPin, Weight, Monitor, ArrowRight, ShieldCheck,
  Loader2, CheckCircle2, ChevronDown, RefreshCw
} from 'lucide-react';
import api from '../../services/api';

const PickupRequest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ category: 'OTHER', quantity: 2.0, address: '', latitude: '', longitude: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [photoKey, setPhotoKey] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [locationState, setLocationState] = useState('idle');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const fetchRequests = async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      setRequests(await api.household.getRequests());
    } catch (error) {
      setRequests([]);
      setRequestsError(error.response?.data?.error || 'Unable to load your pickup requests.');
    } finally {
      setRequestsLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('unsupported');
      return;
    }
    setLocationState('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData(prev => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }));
        setLocationState('granted');
      },
      () => setLocationState('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
    fetchRequests();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);

    try {
      const result = await api.household.analyzePhoto(file);
      if (result.source === 'FALLBACK') {
        setAiError(result.itemDescription || 'Automatic analysis is unavailable. Select a category manually.');
        return;
      }
      setAiResult({
        device: result.itemDescription,
        confidence: `${Math.round((result.confidence || 0) * 100)}%`,
        category: result.category,
        safeHandling: result.safeHandling,
        materials: result.recoverableMaterials || [],
      });
      setPhotoKey(result.photoKey || null);
      setFormData(prev => ({ ...prev, category: result.category || prev.category }));
    } catch (error) {
      setAiError(error.response?.data?.error || 'Image analysis failed. Select a category manually or try another image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setAiResult(null);
    setPhotoKey(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    const weight = Number(formData.quantity);
    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);
    if (!formData.category || !formData.address.trim() || !Number.isFinite(weight) || weight <= 0
      || !Number.isFinite(latitude) || latitude < -90 || latitude > 90
      || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setSubmitError('Choose a category, enter an address, provide a positive weight, and set a valid pickup location.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await api.household.createRequest({
        householdName: JSON.parse(sessionStorage.getItem('looptrace_user') || 'null')?.email || '',
        materialCategory: formData.category,
        estimatedWeightKg: formData.quantity,
        pickupArea: formData.address,
        latitude,
        longitude,
        weightNote: `${weight} kg estimated`,
        aiResult: aiResult?.device || null,
        safetyGuidance: aiResult?.safeHandling || null,
        photoKey
      });
      setSubmittedRequest(response);
      setRequests(previous => [
        response,
        ...previous.filter(request => request.id !== response.id),
      ]);
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRequest) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-primary mb-6 ring-8 ring-green-50">
          <CheckCircle2 size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-extrabold text-textMain tracking-tight mb-2">Pickup Secured</h2>
        <p className="text-gray-500 font-medium mb-3 max-w-md">
          ID: {submittedRequest.id?.substring(0,6).toUpperCase() || 'LT-NEW'}. Registered on the SHA-256 ledger.
        </p>
        <p className="text-sm font-semibold text-gray-600 mb-8">
          {submittedRequest.status === 'MATCHED'
            ? `Collector assigned${submittedRequest.distanceKm != null ? ` · ${submittedRequest.distanceKm} km away` : ''}.`
            : 'No eligible collector is available yet. We will keep this request unmatched until it can be assigned.'}
        </p>
        <button onClick={() => navigate(`/shared/timeline/${submittedRequest.id}`)} className="bg-textMain hover:bg-black text-white font-bold py-3.5 px-8 rounded-lg flex items-center gap-2 transition-all shadow-sm">
          View Traceability Ledger <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-textMain">Your Pickup Requests</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Track every request through collection and recycler processing.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchRequests}
            disabled={requestsLoading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-textMain hover:border-primary/30 disabled:opacity-50"
          >
            <RefreshCw size={14} className={requestsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        {requestsError && (
          <p className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
            {requestsError}
          </p>
        )}
        {!requestsLoading && !requestsError && requests.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 p-5 text-center text-sm font-medium text-gray-500">
            No pickup requests yet.
          </p>
        )}
        <div className="space-y-3">
          {requests.map(request => (
            <button
              type="button"
              key={request.id}
              onClick={() => navigate(`/shared/timeline/${request.id}`)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-primary/40 hover:bg-[#FAFCFA]"
            >
              <div className="min-w-0">
                <div className="font-bold text-textMain">{request.materialCategory}</div>
                <div className="mt-1 truncate text-xs font-medium text-gray-500">
                  ID: {request.id} · {request.pickupArea}
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-primary/20 bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {request.status.replace(/_/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* SaaS Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain tracking-tight">Create Pickup Request</h1>
        <p className="text-gray-500 font-medium mt-1">Identify e-waste using AI and match with nearby collectors.</p>
      </div>

      {/* 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Details (7 cols wide on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={18} className="text-gray-400" />
            <h2 className="text-lg font-bold text-textMain">Pickup Details</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Material Category</label>
              <div className="relative">
                <Monitor size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-10 py-3 text-sm font-semibold text-textMain appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="MOBILE">Mobile phone</option>
                  <option value="LAPTOP">Laptop</option>
                  <option value="TABLET">Tablet</option>
                  <option value="BATTERY">Battery</option>
                  <option value="CABLES">Cables</option>
                  <option value="OTHER">Other electronic waste</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Approximate Weight</label>
              <div className="relative">
                <Weight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="number" step="0.1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-12 py-3 text-sm font-semibold text-textMain focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">kg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pickup Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-3 text-sm font-semibold text-textMain focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Pickup Location</label>
                <button type="button" onClick={requestLocation} className="text-xs font-bold text-primary">
                  {locationState === 'locating' ? 'Locating...' : 'Use current location'}
                </button>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                {locationState === 'granted'
                  ? 'Exact browser location captured.'
                  : locationState === 'denied'
                    ? 'Location permission was denied. Enter coordinates manually.'
                    : 'Allow location access or enter coordinates manually.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="any" min="-90" max="90" placeholder="Latitude" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
                <input type="number" step="any" min="-180" max="180" placeholder="Longitude" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {submitError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{submitError}</p>}
              <button 
                onClick={handleSubmit} disabled={isSubmitting || isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold text-sm py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Securing on Ledger...</> : <><Monitor size={18} /> Match with Collector</>}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-primary" /> SHA-256 Verifiable Traceability
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scanner (5 cols wide on desktop) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textMain">AI Scanner</h2>
            <span className="flex items-center gap-1 bg-surface text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              <Sparkles size={12} /> Auto-fill
            </span>
          </div>
          
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-surface hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <Camera size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm text-textMain mb-1">Click to upload photo</span>
              <span className="text-xs font-medium">Amazon Bedrock will detect details</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video sm:h-56 border border-gray-200">
                <img src={imagePreview} alt="Upload" className={`object-cover w-full h-full transition-opacity ${isAnalyzing ? 'opacity-40' : 'opacity-100'}`} />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <Loader2 size={32} className="text-white animate-spin mb-2" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase shadow-black drop-shadow-md">Analyzing...</span>
                  </div>
                )}
                {!isAnalyzing && (
                  <button onClick={removeImage} className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20">
                    <X size={16} />
                  </button>
                )}
              </div>

              {aiResult && !isAnalyzing && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm border border-gray-100">
                      <Monitor size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-textMain leading-tight">{aiResult.device}</h3>
                      <p className="text-[10px] text-green-600 font-bold mt-0.5 uppercase tracking-wide">Confidence: {aiResult.confidence}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                      {aiResult.safeHandling}
                    </p>
                  </div>
                  {aiResult.materials.length > 0 && (
                    <p className="text-[11px] text-gray-600 font-medium mt-3">
                      Recoverable materials: {aiResult.materials.join(', ')}
                    </p>
                  )}
                </div>
              )}
              {aiError && !isAnalyzing && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {aiError}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PickupRequest;
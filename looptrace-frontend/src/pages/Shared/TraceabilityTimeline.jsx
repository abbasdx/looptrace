// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { 
//   ArrowLeft, CheckCircle2, 
//   ShieldCheck, Leaf, FileText, 
//   Loader2, AlertTriangle, Fingerprint, Lock,
//   Camera, Info, RefreshCw
// } from 'lucide-react';
// import api from '../../services/api';

// const TraceabilityTimeline = () => {
//   const navigate = useNavigate();
//   const { requestId } = useParams();
  
//   const [request, setRequest] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [isChainVerified, setIsChainVerified] = useState(null);
//   const [photoUrl, setPhotoUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);

//   const fetchTraceabilityData = async () => {
//     setIsLoading(true);
//     setLoadError(null);
//     try {
//       if (!requestId) {
//         const requests = await api.household.getRequests();
//         if (requests.length > 0) {
//           navigate(`/shared/timeline/${requests[0].id}`, { replace: true });
//           return;
//         }
//         setLoadError('Create a pickup request from your dashboard to view its traceability ledger.');
//         return;
//       }
      
//       const currentReq = await api.household.getRequest(requestId);
//       setRequest(currentReq);
//       setPhotoUrl(null);
      
//       if (currentReq.photoKey) {
//         try {
//           setPhotoUrl(await api.household.getPhotoUrl(currentReq.photoKey));
//         } catch (photoError) {
//           console.error("Photo fetch failed:", photoError);
//         }
//       }

//       const custodyTrail = await api.household.getCustodyTrail(currentReq.id);
//       setEvents(custodyTrail);

//       const verified = await api.household.verifyCustody(currentReq.id);
//       setIsChainVerified(verified.valid);

//     } catch (error) {
//       console.error("Traceability fetch failed:", error);
//       setRequest(null);
//       setEvents([]);
//       setLoadError(error.response?.data?.error || "Unable to load the traceability ledger.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTraceabilityData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [requestId]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Pending';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', { 
//       day: '2-digit', month: 'short', year: 'numeric', 
//       hour: '2-digit', minute: '2-digit' 
//     });
//   };

//   const getStepProgress = (status) => {
//     if (status === 'RECYCLER_RECEIVED' || status === 'RECYCLING_PROCESSING' || status === 'RECYCLING_COMPLETED') return 3;
//     if (status === 'HANDED_OFF') return 3;
//     if (status === 'PICKED_UP') return 2;
//     if (status === 'ACCEPTED' || status === 'MATCHED') return 1;
//     return 0; 
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center text-textMain animate-pulse px-4">
//         <div className="relative mb-5">
//           <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
//           <ShieldCheck size={32} className="text-primary m-4" />
//         </div>
//         <p className="font-extrabold tracking-widest uppercase text-xs text-secondary mt-2 text-center">Verifying Cryptographic Ledger...</p>
//       </div>
//     );
//   }

//   if (!request) {
//     return (
//       <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center p-6 text-center">
//         <div className="w-20 h-20 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
//           <FileText size={32} strokeWidth={2} />
//         </div>
//         <h2 className="text-2xl sm:text-3xl font-extrabold text-textMain mb-2 tracking-tight">
//           {loadError ? 'Ledger Unavailable' : 'No Active Records'}
//         </h2>
//         <p className="text-sm font-medium text-secondary max-w-xs mb-8">
//           {loadError || 'Create a pickup request from your dashboard to view the verifiable traceability timeline.'}
//         </p>
//         <button onClick={() => navigate(-1)} className="bg-textMain hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-md shadow-gray-200 w-full sm:w-auto">
//           Return to Dashboard
//         </button>
//       </div>
//     );
//   }

//   const progress = getStepProgress(request.status);
//   const isPickedUp = progress >= 2;
//   const isHandedOff = progress === 3;

//   return (
//     <div className="min-h-screen bg-[#FAFCFA] pb-24 sm:pb-32 font-sans selection:bg-primary selection:text-white">
      
//       {/* Mobile-Optimized Sticky Header */}
//       <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
//         <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-3xl mx-auto">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-textMain border border-gray-200 active:scale-95"
//             aria-label="Go back"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div className="flex items-center gap-2">
//             <Leaf size={18} className="text-primary" strokeWidth={2.5} />
//             <span className="font-extrabold text-base tracking-tight text-textMain">Traceability</span>
//           </div>
//           <button
//             onClick={fetchTraceabilityData}
//             disabled={isLoading}
//             className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-textMain transition-colors hover:bg-gray-100 disabled:opacity-50"
//             aria-label="Refresh traceability"
//           >
//             <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />
//           </button>
//         </div>
//       </header>

//       <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in-up">
        
//         {/* Top Information Card */}
//         <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60 mb-6 sm:mb-8">
          
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <div>
//               <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Request ID</div>
//               <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain leading-none tracking-tight">
//                 LT-{request.id.substring(0, 4).toUpperCase()}
//               </h1>
//             </div>
//             <div className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
//               isHandedOff ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-surface text-primary border-primary/20'
//             }`}>
//               <CheckCircle2 size={14} strokeWidth={2.5} />
//               {request.status.replace(/_/g, ' ')}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
//             <div className="border-r border-gray-200">
//               <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Material</div>
//               <div className="text-sm sm:text-base font-extrabold text-textMain truncate pr-2">{request.materialCategory}</div>
//             </div>
//             <div className="pl-2">
//               <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Recorded Weight</div>
//               <div className="text-sm sm:text-base font-extrabold text-textMain">{request.actualWeightKg || request.estimatedWeightKg} kg</div>
//             </div>
//           </div>

//           {(photoUrl || request.aiResult || request.safetyGuidance) && (
//             <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
//               {photoUrl && (
//                 <div className="relative rounded-xl overflow-hidden bg-black border border-gray-200">
//                   <img src={photoUrl} alt="Uploaded e-waste" className="max-h-48 sm:max-h-64 w-full object-cover sm:object-contain opacity-90" />
//                   <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">
//                     <Camera size={12} /> User Upload
//                   </div>
//                 </div>
//               )}
              
//               <div className="space-y-2.5">
//                 {request.aiResult && (
//                   <div className="flex gap-2.5 items-start">
//                     <Leaf size={16} className="text-primary shrink-0 mt-0.5" />
//                     <p className="text-xs sm:text-sm text-gray-700 leading-relaxed"><strong className="text-textMain">AI Analysis:</strong> {request.aiResult}</p>
//                   </div>
//                 )}
//                 {request.safetyGuidance && (
//                   <div className="flex gap-2.5 items-start bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
//                     <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
//                     <p className="text-xs sm:text-sm text-gray-700 leading-relaxed"><strong className="text-textMain">Handling:</strong> {request.safetyGuidance}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* SHA-256 Ledger Section */}
//         <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60 relative overflow-hidden">
          
//           <div className="flex items-center gap-3 mb-8 relative z-10">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-textMain rounded-xl flex items-center justify-center text-white shadow-md">
//               <Lock size={18} sm:size={20} />
//             </div>
//             <div>
//               <h2 className="text-lg sm:text-xl font-extrabold text-textMain tracking-tight leading-tight">Custody Ledger</h2>
//               <p className="text-[10px] sm:text-[11px] font-bold text-secondary uppercase tracking-wider">Cryptographic Event Trail</p>
//             </div>
//           </div>

//           {/* Bulletproof Vertical Timeline */}
//           <div className="relative relative z-10 pl-2 sm:pl-4">
            
//             {/* The continuous line (Locked to the center of the 20px dot) */}
//             <div className="absolute left-[18px] sm:left-[26px] top-6 bottom-10 w-0.5 bg-gray-200 rounded-full"></div>

//             <div className="space-y-8">
//               {events.map((event, index) => {
//                 return (
//                   <div key={event.id} className="relative flex gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    
//                     {/* Node Dot Container */}
//                     <div className="relative z-10 mt-1 shrink-0 flex justify-center w-5">
//                       <div className="w-5 h-5 bg-white border-4 border-primary rounded-full shadow-[0_0_0_4px_white]"></div>
//                       <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full"></div>
//                     </div>
                    
//                     {/* Event Content */}
//                     <div className="flex-1 pb-2 min-w-0">
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
//                         <div>
//                           <h3 className="text-sm font-extrabold text-textMain">{event.step.replace(/_/g, ' ')}</h3>
//                           <p className="text-[10px] sm:text-[11px] text-secondary font-semibold mt-0.5">{formatDate(event.timestamp)}</p>
//                         </div>
//                         <div className="self-start inline-flex items-center gap-1 bg-surface text-primary px-2 py-1 rounded-md border border-primary/20">
//                           <ShieldCheck size={12} strokeWidth={2.5} />
//                           <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
//                         </div>
//                       </div>
                      
//                       {/* The Hash Block */}
//                       <div className="mt-3 bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-200">
//                         <div className="flex items-center gap-1.5 mb-1.5">
//                           <Fingerprint size={12} className="text-gray-400" />
//                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">Actor: {event.actor}</span>
//                         </div>
//                         <div className="font-mono text-[9px] sm:text-[10px] text-gray-500 break-all bg-white p-2 rounded-lg border border-gray-200 shadow-sm leading-relaxed">
//                           {event.hash}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Pending Next Action */}
//               {!isHandedOff && (
//                 <div className="relative flex gap-4 sm:gap-6 opacity-60">
//                   <div className="relative z-10 mt-1 shrink-0 flex justify-center w-5">
//                     <div className="w-5 h-5 bg-white border-4 border-gray-300 rounded-full shadow-[0_0_0_4px_white]"></div>
//                   </div>
//                   <div className="flex-1 pb-1">
//                     <h3 className="text-sm font-extrabold text-gray-400">
//                       {isPickedUp ? 'Deliver to Recycler' : 'Pending Pickup'}
//                     </h3>
//                     <p className="text-[11px] text-gray-400 font-medium mt-1">
//                       Awaiting cryptographic signature.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Premium Integrity Badge */}
//         <div className={`mt-6 border rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all ${
//           isChainVerified ? 'bg-textMain border-gray-800' : 'bg-[#FFF8E6] border-warning/30'
//         }`}>
//           {isChainVerified ? (
//             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-2xl flex items-center justify-center shrink-0 border border-gray-700 shadow-inner">
//               <ShieldCheck size={24} className="text-primary" />
//             </div>
//           ) : (
//             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-warning/10 rounded-2xl flex items-center justify-center shrink-0 border border-warning/20">
//               <AlertTriangle size={24} className="text-warning" />
//             </div>
//           )}
          
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
//               <h4 className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${isChainVerified ? 'text-white' : 'text-[#996500]'}`}>
//                 System Integrity Valid
//               </h4>
//               <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
//                 isChainVerified ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-warning text-white'
//               }`}>
//                 {isChainVerified ? <CheckCircle2 size={10} strokeWidth={3} /> : <AlertTriangle size={10} strokeWidth={3} />}
//                 {isChainVerified ? 'Secure' : 'Tampered'}
//               </div>
//             </div>
//             <p className={`text-[11px] sm:text-xs font-medium leading-relaxed ${isChainVerified ? 'text-gray-400' : 'text-[#996500]/80'}`}>
//               {isChainVerified 
//                 ? 'SHA-256 hashes successfully validated. This ledger is mathematically proven to be unaltered.' 
//                 : 'Warning: Hash chain mismatch detected. Record may be compromised.'}
//             </p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default TraceabilityTimeline;

import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {

  ArrowLeft, CheckCircle2,

  ShieldCheck, Leaf, FileText,

  AlertTriangle, Fingerprint, Lock,

  Camera, Info, RefreshCw

} from 'lucide-react';

import api from '../../services/api';



const TraceabilityTimeline = () => {

  const navigate = useNavigate();

  const { requestId } = useParams();



  const [request, setRequest] = useState(null);

  const [events, setEvents] = useState([]);

  const [isChainVerified, setIsChainVerified] = useState(null);

  const [photoUrl, setPhotoUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState(null);



  const fetchTraceabilityData = async () => {

    setIsLoading(true);

    setLoadError(null);

    try {

      if (!requestId) {

        const requests = await api.household.getRequests();

        if (requests.length > 0) {

          navigate(`/shared/timeline/${requests[0].id}`, { replace: true });

          return;

        }

        setLoadError('Create a pickup request from your dashboard to view its traceability ledger.');

        return;

      }



      const currentReq = await api.household.getRequest(requestId);

      setRequest(currentReq);

      setPhotoUrl(null);



      if (currentReq.photoKey) {

        try {

          setPhotoUrl(await api.household.getPhotoUrl(currentReq.photoKey));

        } catch (photoError) {

          console.error("Photo fetch failed:", photoError);

        }

      }



      const custodyTrail = await api.household.getCustodyTrail(currentReq.id);

      setEvents(custodyTrail);



      const verified = await api.household.verifyCustody(currentReq.id);

      setIsChainVerified(verified.valid);



    } catch (error) {

      console.error("Traceability fetch failed:", error);

      setRequest(null);

      setEvents([]);

      setLoadError(error.response?.data?.error || "Unable to load the traceability ledger.");

    } finally {

      setIsLoading(false);

    }

  };



  useEffect(() => {

    fetchTraceabilityData();


  }, [requestId]);



  const formatDate = (dateString) => {

    if (!dateString) return 'Pending';

    const date = new Date(dateString);

    return date.toLocaleString('en-IN', {

      day: '2-digit', month: 'short', year: 'numeric',

      hour: '2-digit', minute: '2-digit'

    });

  };



  const getStepProgress = (status) => {

    if (status === 'RECYCLER_RECEIVED' || status === 'RECYCLING_PROCESSING' || status === 'RECYCLING_COMPLETED') return 3;

    if (status === 'HANDED_OFF') return 3;

    if (status === 'PICKED_UP') return 2;

    if (status === 'ACCEPTED' || status === 'MATCHED') return 1;

    return 0;

  };



  if (isLoading) {

    return (

      <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center text-textMain animate-pulse px-4">

        <div className="relative mb-5">

          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>

          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>

          <ShieldCheck size={32} className="text-primary m-4" />

        </div>

        <p className="font-extrabold tracking-widest uppercase text-xs text-secondary mt-2 text-center">Verifying Cryptographic Ledger...</p>

      </div>

    );

  }



  if (!request) {

    return (

      <div className="min-h-screen bg-[#FAFCFA] flex flex-col items-center justify-center p-6 text-center">

        <div className="w-20 h-20 bg-white border border-borderMain rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">

          <FileText size={32} strokeWidth={2} />

        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-textMain mb-2 tracking-tight">

          {loadError ? 'Ledger Unavailable' : 'No Active Records'}

        </h2>

        <p className="text-sm font-medium text-secondary max-w-xs mb-8">

          {loadError || 'Create a pickup request from your dashboard to view the verifiable traceability timeline.'}

        </p>

        <button onClick={() => navigate(-1)} className="bg-textMain hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-md shadow-gray-200 w-full sm:w-auto">

          Return to Dashboard

        </button>

      </div>

    );

  }



  const progress = getStepProgress(request.status);

  const isPickedUp = progress >= 2;

  const isHandedOff = progress === 3;



  return (

    <div className="min-h-screen bg-[#FAFCFA] pb-24 sm:pb-32 font-sans selection:bg-primary selection:text-white">




      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">

        <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-3xl mx-auto">

          <button

            onClick={() => navigate(-1)}

            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-textMain border border-gray-200 active:scale-95"

            aria-label="Go back"

          >

            <ArrowLeft size={20} />

          </button>

          <div className="flex items-center gap-2">

            <Leaf size={18} className="text-primary" strokeWidth={2.5} />

            <span className="font-extrabold text-base tracking-tight text-textMain">Traceability</span>

          </div>

          <button

            onClick={fetchTraceabilityData}

            disabled={isLoading}

            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-textMain transition-colors hover:bg-gray-100 disabled:opacity-50"

            aria-label="Refresh traceability"

          >

            <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />

          </button>

        </div>

      </header>



      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 animate-fade-in-up">




        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60 mb-6 sm:mb-8">



          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div>

              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Request ID</div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-textMain leading-none tracking-tight">

                LT-{request.id.substring(0, 4).toUpperCase()}

              </h1>

            </div>

            <div className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${

              isHandedOff ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-surface text-primary border-primary/20'

            }`}>

              <CheckCircle2 size={14} strokeWidth={2.5} />

              {request.status.replace(/_/g, ' ')}

            </div>

          </div>



          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">

            <div className="border-r border-gray-200">

              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Material</div>

              <div className="text-sm sm:text-base font-extrabold text-textMain truncate pr-2">{request.materialCategory}</div>

            </div>

            <div className="pl-2">

              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{request.actualWeightKg != null ? 'Actual Weight' : 'Estimated Weight'}</div>

              <div className="text-sm sm:text-base font-extrabold text-textMain">{request.actualWeightKg ?? request.estimatedWeightKg ?? 'Not recorded'}{request.actualWeightKg != null || request.estimatedWeightKg != null ? ' kg' : ''}</div>

            </div>

          </div>



          {(photoUrl || request.aiResult || request.safetyGuidance) && (

            <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

              {photoUrl && (

                <div className="relative rounded-xl overflow-hidden bg-black border border-gray-200">

                  <img src={photoUrl} alt="Uploaded e-waste" className="max-h-48 sm:max-h-64 w-full object-cover sm:object-contain opacity-90" />

                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 uppercase tracking-wider">

                    <Camera size={12} /> User Upload

                  </div>

                </div>

              )}



              <div className="space-y-2.5">

                {request.aiResult && (

                  <div className="flex gap-2.5 items-start">

                    <Leaf size={16} className="text-primary shrink-0 mt-0.5" />

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed"><strong className="text-textMain">AI Analysis:</strong> {request.aiResult}</p>

                  </div>

                )}

                {request.safetyGuidance && (

                  <div className="flex gap-2.5 items-start bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">

                    <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed"><strong className="text-textMain">Handling:</strong> {request.safetyGuidance}</p>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>




        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-borderMain/60 relative overflow-hidden">



          <div className="flex items-center gap-3 mb-8 relative z-10">

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-textMain rounded-xl flex items-center justify-center text-white shadow-md">

              <Lock size={20} />

            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-extrabold text-textMain tracking-tight leading-tight">Custody Ledger</h2>

              <p className="text-[10px] sm:text-[11px] font-bold text-secondary uppercase tracking-wider">Cryptographic Event Trail</p>

            </div>

          </div>




          <div className="relative relative z-10 pl-2 sm:pl-4">




            <div className="absolute left-[18px] sm:left-[26px] top-6 bottom-10 w-0.5 bg-gray-200 rounded-full"></div>



            <div className="space-y-8">

              {events.map((event, index) => {

                return (

                  <div key={event.id} className="relative flex gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>




                    <div className="relative z-10 mt-1 shrink-0 flex justify-center w-5">

                      <div className="w-5 h-5 bg-white border-4 border-primary rounded-full shadow-[0_0_0_4px_white]"></div>

                      <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full"></div>

                    </div>




                    <div className="flex-1 pb-2 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">

                        <div>

                          <h3 className="text-sm font-extrabold text-textMain">{event.step.replace(/_/g, ' ')}</h3>

                          <p className="text-[10px] sm:text-[11px] text-secondary font-semibold mt-0.5">{formatDate(event.timestamp)}</p>

                        </div>

                        <div className="self-start inline-flex items-center gap-1 bg-surface text-primary px-2 py-1 rounded-md border border-primary/20">

                          <ShieldCheck size={12} strokeWidth={2.5} />

                          <span className="text-[9px] font-bold uppercase tracking-wider">Recorded</span>

                        </div>

                      </div>




                      <div className="mt-3 bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-200">

                        <div className="flex items-center gap-1.5 mb-1.5">

                          <Fingerprint size={12} className="text-gray-400" />

                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">Actor: {event.actor}</span>

                        </div>

                        <div className="font-mono text-[9px] sm:text-[10px] text-gray-500 break-all bg-white p-2 rounded-lg border border-gray-200 shadow-sm leading-relaxed">

                          {event.hash}

                        </div>

                      </div>

                    </div>

                  </div>

                );

              })}




              {!isHandedOff && (

                <div className="relative flex gap-4 sm:gap-6 opacity-60">

                  <div className="relative z-10 mt-1 shrink-0 flex justify-center w-5">

                    <div className="w-5 h-5 bg-white border-4 border-gray-300 rounded-full shadow-[0_0_0_4px_white]"></div>

                  </div>

                  <div className="flex-1 pb-1">

                    <h3 className="text-sm font-extrabold text-gray-400">

                      {isPickedUp ? 'Deliver to Recycler' : 'Pending Pickup'}

                    </h3>

                    <p className="text-[11px] text-gray-400 font-medium mt-1">

                      Awaiting cryptographic signature.

                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>




        <div className={`mt-6 border rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all ${

          isChainVerified === true ? 'bg-textMain border-gray-800' : isChainVerified === false ? 'bg-[#FFF8E6] border-warning/30' : 'bg-white border-gray-200'

        }`}>

          {isChainVerified === true ? (

            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-2xl flex items-center justify-center shrink-0 border border-gray-700 shadow-inner">

              <ShieldCheck size={24} className="text-primary" />

            </div>

          ) : isChainVerified === false ? (

            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-warning/10 rounded-2xl flex items-center justify-center shrink-0 border border-warning/20">

              <AlertTriangle size={24} className="text-warning" />

            </div>

          ) : (

            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200">

              <Info size={24} className="text-gray-500" />

            </div>

          )}



          <div className="flex-1 min-w-0">

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">

              <h4 className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${isChainVerified === true ? 'text-white' : isChainVerified === false ? 'text-[#996500]' : 'text-textMain'}`}>

                {isChainVerified === true ? 'Recorded Chain Integrity' : isChainVerified === false ? 'Chain Integrity Warning' : 'Chain Integrity Status'}

              </h4>

              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${

                isChainVerified === true ? 'bg-primary/20 text-primary border border-primary/30' : isChainVerified === false ? 'bg-warning text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'

              }`}>

                {isChainVerified === true ? <CheckCircle2 size={10} strokeWidth={3} /> : isChainVerified === false ? <AlertTriangle size={10} strokeWidth={3} /> : <Info size={10} />}

                {isChainVerified === true ? 'Valid chain' : isChainVerified === false ? 'Mismatch detected' : 'Unverified'}

              </div>

            </div>

            <p className={`text-[11px] sm:text-xs font-medium leading-relaxed ${isChainVerified === true ? 'text-gray-400' : isChainVerified === false ? 'text-[#996500]/80' : 'text-gray-600'}`}>

              {isChainVerified === true

                ? 'The recorded hash chain passed verification. This checks the digital event history; it does not independently prove physical recycling.'

                : isChainVerified === false

                  ? 'The recorded hash chain did not pass verification. One or more records may be inconsistent; review the event history.'

                  : 'Verification status is unavailable. The event history is displayed, but its integrity has not been confirmed.'}

            </p>

          </div>

        </div>

      </div>



    </div>

  );

};



export default TraceabilityTimeline;

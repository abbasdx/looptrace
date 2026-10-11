// import React, { useState, useRef, useEffect } from 'react';
// import { User, Truck, Shield, Recycle, LayoutDashboard, FileText, BarChart3, ChevronDown, LogOut, Cloud } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import logo from '../../assets/looptrace.png';

// const TopHeader = ({ variant, activeTab, onTabChange }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Securely check authentication state
//   const sessionUser = JSON.parse(sessionStorage.getItem('looptrace_user') || 'null');
//   const isAuthenticated = !!sessionStorage.getItem('looptrace_access_token') && !!sessionUser;
//   const displayName = sessionUser?.name || sessionUser?.email || 'Account';

//   // Determine if we are on a public page
//   const isLandingPage = location.pathname === '/';
//   const isAuthPage = location.pathname === '/auth';

//   // Only the Household role has multiple tabs in the top nav
//   const tabs = [
//     { id: 'home', label: variant === 'household' ? 'Request' : 'Dashboard', icon: LayoutDashboard },
//     ...(variant === 'household' ? [
//       { id: 'requests', label: 'Traceability', icon: FileText },
//       { id: 'impact', label: 'Impact Metrics', icon: BarChart3 },
//     ] : []),
//   ];
  
//   const roleLabels = {
//     household: 'Household',
//     collector: 'Collector',
//     recycler: 'Recycler',
//     admin: 'Super Admin',
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto">
        
//         <div className="flex items-center gap-8">
//           {/* Custom Logo Integration */}
//           <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
//             <img 
//               src={logo} 
//               alt="LoopTrace Logo" 
//               className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-sm transition-transform group-hover:scale-105" 
//             />
//             <span className="text-xl font-extrabold tracking-tight text-textMain hidden sm:block">
//               Loop<span className="text-primary">Trace</span>
//             </span>
//           </div>

//           {/* Conditional Navigation: Only show tabs if logged in AND not on auth/landing pages */}
//           {isAuthenticated && !isAuthPage && !isLandingPage && (
//             <nav className="hidden md:flex items-center gap-1">
//               {tabs.map((tab) => {
//                 const isActive = activeTab === tab.id;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => onTabChange(tab.id)}
//                     className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
//                       isActive 
//                         ? 'bg-gray-100 text-textMain shadow-sm' 
//                         : 'text-gray-500 hover:text-textMain hover:bg-gray-50'
//                     }`}
//                   >
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </nav>
//           )}
//         </div>

//         {/* Right Side Actions */}
//         <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          
//           {isAuthenticated ? (
//             <>
//               {/* --- AUTHENTICATED USER MENU --- */}
//               <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
//                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live System
//               </div>

//               <button 
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all bg-white shadow-sm active:scale-95"
//               >
//                 <div className="w-7 h-7 rounded-full bg-surface text-primary flex items-center justify-center">
//                   {variant === 'collector' ? <Truck size={14} strokeWidth={2.5} /> : 
//                    variant === 'recycler' ? <Recycle size={14} strokeWidth={2.5} /> : 
//                    variant === 'admin' ? <Shield size={14} strokeWidth={2.5} /> : 
//                    <User size={14} strokeWidth={2.5} />}
//                 </div>
//                 <span className="text-sm font-semibold hidden sm:inline capitalize">
//                   {roleLabels[variant] || 'Account'}
//                 </span>
//                 <ChevronDown size={14} className="text-gray-400" />
//               </button>

//               {/* Account Dropdown */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in-up origin-top-right">
//                   <div className="px-4 py-3 border-b border-gray-100 mb-1">
//                     <p className="text-sm font-extrabold text-textMain truncate">{displayName}</p>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
//                       {roleLabels[variant]} Account
//                     </p>
//                   </div>

//                   <div className="px-2 mt-2">
//                     {/* If they are on the landing/auth page but logged in, give them a shortcut to their dashboard */}
//                     {(isLandingPage || isAuthPage) && (
//                       <button 
//                         onClick={() => {
//                           setIsDropdownOpen(false);
//                           navigate(variant === 'admin' ? '/admin/dashboard' : variant === 'recycler' ? '/recycler/dashboard' : variant === 'collector' ? '/collector/dashboard' : '/household/request');
//                         }}
//                         className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-textMain hover:bg-gray-50 flex items-center gap-3 transition-colors mb-1"
//                       >
//                         <LayoutDashboard size={16} strokeWidth={2.5} className="text-gray-400" /> Go to Dashboard
//                       </button>
//                     )}
                    
//                     <button 
//                       onClick={() => {
//                         sessionStorage.removeItem('looptrace_access_token');
//                         sessionStorage.removeItem('looptrace_user');
//                         setIsDropdownOpen(false);
//                         navigate('/auth', { replace: true });
//                       }}
//                       className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors"
//                     >
//                       <LogOut size={16} strokeWidth={2.5} /> Sign out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
              
              
//               {!isAuthPage && (
//                 <button 
//                   onClick={() => navigate('/auth')} 
//                   className="text-textMain hover:text-primary text-sm font-bold transition-colors mr-2 ml-2"
//                 >
//                   Sign In
//                 </button>
//               )}
              
//               {!isAuthPage && (
//                 <button 
//                   onClick={() => navigate('/auth')} 
//                   className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-md shadow-primary/20"
//                 >
//                   Get Started
//                 </button>
//               )}
//             </>
//           )}

//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopHeader;

import React, { useState, useRef, useEffect } from 'react';
import { User, Truck, Shield, Recycle, LayoutDashboard, FileText, BarChart3, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/looptrace.png';

const TopHeader = ({ variant, activeTab, onTabChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Securely check authentication state
  const sessionUser = JSON.parse(sessionStorage.getItem('looptrace_user') || 'null');
  const isAuthenticated = !!sessionStorage.getItem('looptrace_access_token') && !!sessionUser;
  const displayName = sessionUser?.name || sessionUser?.email || 'Account';

  // Determine if we are on a public page
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  // Only the Household role has multiple tabs in the top nav
  const tabs = [
    { id: 'home', label: variant === 'household' ? 'Request' : 'Dashboard', icon: LayoutDashboard },
    ...(variant === 'household' ? [
      { id: 'requests', label: 'Traceability', icon: FileText },
      { id: 'impact', label: 'Impact Metrics', icon: BarChart3 },
    ] : []),
  ];
  
  const roleLabels = {
    household: 'Household',
    collector: 'Collector',
    recycler: 'Recycler',
    admin: 'Super Admin',
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shadow-sm transition-all">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-7xl mx-auto">
        
        <div className="flex items-center gap-8">
          {/* Custom Logo Integration */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <img 
              src={logo} 
              alt="LoopTrace Logo" 
              className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
            />
            <span className="text-xl font-extrabold tracking-tight text-textMain hidden sm:block">
              Loop<span className="text-primary">Trace</span>
            </span>
          </div>

          {/* Conditional Navigation: Only show tabs if logged in AND not on auth/landing pages */}
          {isAuthenticated && !isAuthPage && !isLandingPage && (
            <nav className="hidden md:flex items-center gap-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-gray-100 text-textMain shadow-sm ring-1 ring-gray-200/50' 
                        : 'text-gray-500 hover:text-textMain hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          
          {isAuthenticated ? (
            <>
              {/* --- AUTHENTICATED USER MENU --- */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50/80 text-green-700 border border-green-200/80 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live System
              </div>

              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm active:scale-95"
              >
                <div className="w-7 h-7 rounded-full bg-surface text-primary flex items-center justify-center">
                  {variant === 'collector' ? <Truck size={14} strokeWidth={2.5} /> : 
                   variant === 'recycler' ? <Recycle size={14} strokeWidth={2.5} /> : 
                   variant === 'admin' ? <Shield size={14} strokeWidth={2.5} /> : 
                   <User size={14} strokeWidth={2.5} />}
                </div>
                <span className="text-sm font-bold hidden sm:inline capitalize text-textMain">
                  {roleLabels[variant] || 'Account'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Account Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-14 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50 animate-fade-in-up origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-sm font-extrabold text-textMain truncate">{displayName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      {roleLabels[variant]} Account
                    </p>
                  </div>

                  <div className="px-2 mt-2">
                    {/* If they are on the landing/auth page but logged in, give them a shortcut to their dashboard */}
                    {(isLandingPage || isAuthPage) && (
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate(variant === 'admin' ? '/admin/dashboard' : variant === 'recycler' ? '/recycler/dashboard' : variant === 'collector' ? '/collector/dashboard' : '/household/request');
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-textMain hover:bg-gray-50 flex items-center gap-3 transition-colors mb-1"
                      >
                        <LayoutDashboard size={16} strokeWidth={2.5} className="text-gray-400" /> Go to Dashboard
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        sessionStorage.removeItem('looptrace_access_token');
                        sessionStorage.removeItem('looptrace_user');
                        setIsDropdownOpen(false);
                        navigate('/auth', { replace: true });
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} strokeWidth={2.5} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* --- PUBLIC / UNAUTHENTICATED MENU --- */}
              {!isAuthPage && (
                <button 
                  onClick={() => navigate('/auth')} 
                  className="text-textMain hover:text-primary text-sm font-bold transition-colors mr-2 ml-2"
                >
                  Sign In
                </button>
              )}
              
              {!isAuthPage && (
                <button 
                  onClick={() => navigate('/auth')} 
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-md shadow-primary/20"
                >
                  Get Started
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default TopHeader;
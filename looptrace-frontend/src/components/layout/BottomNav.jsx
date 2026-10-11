import React from 'react';
import { Home, FileText, BarChart3 } from 'lucide-react';

const BottomNav = ({ role, activeTab = 'home', onTabChange }) => {
  const tabsByRole = {
    household: [
      { id: 'home', label: 'Request', icon: Home },
      { id: 'requests', label: 'Traceability', icon: FileText },
      { id: 'impact', label: 'Impact', icon: BarChart3 },
    ],
    collector: [{ id: 'home', label: 'Jobs', icon: Home }],
    recycler: [{ id: 'home', label: 'Facilities', icon: Home }],
    admin: [{ id: 'home', label: 'Dashboard', icon: Home }],
  };
  
  const tabs = tabsByRole[role] || tabsByRole.household;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-colors ${
                isActive ? 'bg-primary/10' : 'bg-transparent'
              }`}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? 'text-primary' : 'text-current'}
                />
              </div>
              <span className={`text-[10px] tracking-wide ${
                isActive ? 'text-primary font-bold' : 'text-current font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
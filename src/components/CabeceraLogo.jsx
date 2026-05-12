import React from 'react';

const CabeceraLogo = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 w-full bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-50">
      <img 
        src="/logo.png" 
        alt="StudPlay Logo" 
        className="h-16 w-auto drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
      />
      <div className="h-[1px] w-4/5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-2 opacity-30"></div>
    </div>
  );
};

export default CabeceraLogo;
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* desktop nav */}
        <div className="hidden md:block w-64 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 h-full">
            <div className="mb-8">
              <div className="flex flex-col items-center mb-4">
                <img 
                  src="/gerald-athletic-club-logo.png" 
                  alt="Gerald Athletic Club" 
                  className="w-16 h-16 mb-3 rounded-full border-2 border-slate-200"
                />
                <div className="text-center">
                  <h1 className="text-lg font-semibold text-slate-800">
                    Gerald Athletic Club
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Fitness Tracker
                  </p>
                </div>
              </div>
            </div>
            <Navigation />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-2 sm:p-4 pb-20 md:pb-4">
            <div className="max-w-6xl mx-auto">{children}</div>
          </div>

          {/* mobile nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <Navigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

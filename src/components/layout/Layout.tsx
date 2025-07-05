import React, { useState } from 'react';
import Navigation from './Navigation';
import FloatingTimer from '../shared/FloatingTimer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E6D6] via-[#FAF7F2] to-[#E8D7C3]">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* desktop nav */}
        <div className="hidden md:block w-64 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-4 h-[calc(100vh-2rem)]">
            <div className="mb-8">
              <div className="flex flex-col items-center mb-4">
                <img
                  src="/gerald-athletic-club-logo.png"
                  alt="Gerald Athletic Club"
                  className="w-16 h-16 mb-3 rounded-full border-2 border-[#E8D7C3]"
                />
                <div className="text-center">
                  <h1 className="text-lg font-semibold text-[#2C2C2C]">
                    Gerald Athletic Club
                  </h1>
                  <p className="text-xs text-[#2C2C2C]/60 mt-1">
                    Fitness Tracker
                  </p>
                </div>
              </div>
            </div>
            <Navigation />

            {/* Timer Toggle Button at bottom of nav */}
            {/* <div className="mt-auto pt-4 border-t border-[#E8D7C3]">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  showTimer
                    ? 'bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] text-white shadow-lg'
                    : 'text-[#2C2C2C] hover:bg-[#F0E6D6] hover:text-[#2C2C2C]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span className="font-medium">Timer</span>
              </button>
              </div>*/}
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

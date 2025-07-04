import React from 'react';
import { Dumbbell } from 'lucide-react';
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
              <div className="flex items-center mb-2">
                <Dumbbell className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-semibold text-slate-800">
                  Fitness Tracker
                </h1>
              </div>
              <p className="text-sm text-slate-500">
                Your complete fitness companion
              </p>
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

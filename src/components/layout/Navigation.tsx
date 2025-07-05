import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, Dumbbell, Activity, TrendingUp, Timer } from 'lucide-react';
import FloatingTimer from '../shared/FloatingTimer';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const [isTimerVisible, setIsTimerVisible] = useState(false);

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      description: 'Dashboard',
    },
    {
      path: '/workout',
      label: 'Workout',
      icon: Dumbbell,
      description: 'Track Session',
    },
    {
      path: '/strength',
      label: 'Strength',
      icon: Activity,
      description: 'Assessment',
    },
    {
      path: '/history',
      label: 'History',
      icon: TrendingUp,
      description: 'Past Workouts',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`${className}`}>
      <div className="hidden md:flex md:flex-col md:space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] text-white shadow-lg'
                  : 'text-[#2C2C2C] hover:bg-[#F0E6D6] hover:text-[#2C2C2C]'
              }`}
            >
              <IconComponent size={24} />
              <div>
                <div className="font-medium">{item.label}</div>
                <div
                  className={`text-xs ${
                    isActivePath(item.path)
                      ? 'text-white/80'
                      : 'text-[#2C2C2C]/60'
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
        {/* Timer button at bottom of desktop nav */}
        {/* <button
          onClick={() => setIsTimerVisible(true)}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-[#2C2C2C] hover:bg-[#F0E6D6] hover:text-[#2C2C2C] mt-4 border-t border-[#E8D7C3] pt-4"
        >
          <Timer size={24} />
          <div>
            <div className="font-medium">Timer</div>
            <div className="text-xs text-[#2C2C2C]/60">Quick Access</div>
          </div>
        </button> */}
      </div>

      <div className="md:hidden flex justify-around items-center bg-white/95 backdrop-blur-sm border-t border-[#E8D7C3] px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] text-white shadow-lg'
                  : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C]'
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        {/* Timer button at bottom of mobile nav */}
        {/* <button
          onClick={() => setIsTimerVisible(true)}
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-[#2C2C2C]/70 hover:text-[#2C2C2C]"
        >
          <Timer size={20} />
          <span className="text-xs font-medium">Timer</span>
        </button> */}
      </div>

      {/* Floating Timer */}
      {/* <FloatingTimer
        isVisible={isTimerVisible}
        onClose={() => setIsTimerVisible(false)}
      /> */}
    </nav>
  );
};

export default Navigation;

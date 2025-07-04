import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, Dumbbell, Activity, TrendingUp } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const location = useLocation();

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
                  ? 'bg-gradient-to-r from-blue-500 to-slate-600 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <IconComponent size={24} />
              <div>
                <div className="font-medium">{item.label}</div>
                <div
                  className={`text-xs ${
                    isActivePath(item.path) ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="md:hidden flex justify-around items-center bg-white/95 backdrop-blur-sm border-t border-slate-200 px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-slate-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

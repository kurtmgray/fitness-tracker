import { useState } from 'react';
import { LogOut, ChevronUp } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function UserProfile() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const avatarSrc = user.avatar_url || undefined;
  const initials = user.name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      {/* Desktop Profile */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col items-center space-y-2 px-4 py-3 rounded-xl transition-all duration-200 text-[#2C2C2C] hover:bg-[#F0E6D6] w-full"
        >
          <ChevronUp
            size={16}
            className={`transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
          <div className="relative">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
            )}
          </div>
          <div className="text-center w-full">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-xs text-[#2C2C2C]/60 truncate">
              {user.email}
            </div>
          </div>
        </button>

        {/* Desktop Dropdown */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-[#E8D7C3] py-3 z-50">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-[#F0E6D6] transition-colors duration-200 text-[#2C2C2C]"
            >
              <LogOut size={16} />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Profile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-[#2C2C2C]/70 hover:text-[#2C2C2C] relative"
        >
          <div className="relative">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] flex items-center justify-center text-white text-xs font-medium">
                {initials}
              </div>
            )}
          </div>
          <span className="text-xs font-medium">Profile</span>
        </button>

        {/* Mobile Dropdown */}
        {isDropdownOpen && (
          <div className="absolute bottom-full right-2 mb-2 bg-white rounded-lg shadow-lg border border-[#E8D7C3] py-3 z-50 min-w-48">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-[#F0E6D6] transition-colors duration-200 text-[#2C2C2C]"
            >
              <LogOut size={16} />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

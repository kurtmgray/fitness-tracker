import React from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

interface UnifiedHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  onBack?: () => void;
  backText?: string;
  rightContent?: React.ReactNode;
  compact?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  showBackButton = false,
  onBack,
  backText = 'Back',
  rightContent,
  compact = true,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 mb-6">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">{backText}</span>
            </button>
          )}
          {Icon && <Icon className="w-8 h-8 text-[#8B9A5B]" />}
          <div>
            <h1 className="text-2xl font-semibold text-[#2C2C2C]">{title}</h1>
            {subtitle && (
              <p className="text-sm text-[#2C2C2C]/70">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">{rightContent}</div>
      </div>
    );
  }

  // Non-compact version for special cases
  return (
    <div className="text-center py-4 mb-6">
      {showBackButton && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{backText}</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-center mb-2">
        {Icon && <Icon className="w-10 h-10 text-[#8B9A5B] mr-3" />}
        <h1 className="text-3xl font-semibold text-[#2C2C2C]">{title}</h1>
      </div>
      {subtitle && <p className="text-base text-[#2C2C2C]/80">{subtitle}</p>}

      {rightContent && (
        <div className="flex justify-end mt-4">{rightContent}</div>
      )}
    </div>
  );
};

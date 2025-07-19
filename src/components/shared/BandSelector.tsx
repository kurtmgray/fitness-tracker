import React, { useState } from 'react';
import { 
  BandColor, 
  BandConfiguration, 
  DEFAULT_BAND_CONFIGURATIONS,
  createBandConfiguration,
  getBandColorHex 
} from '@/utils/bandUtils';

interface BandSelectorProps {
  selectedConfiguration?: BandConfiguration;
  onConfigurationChange: (config: BandConfiguration) => void;
  userConfigurations?: BandConfiguration[];
  disabled?: boolean;
  className?: string;
}

const BandSelector: React.FC<BandSelectorProps> = ({
  selectedConfiguration,
  onConfigurationChange,
  userConfigurations = [],
  disabled = false,
  className = '',
}) => {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customColors, setCustomColors] = useState<BandColor[]>([]);
  const [customName, setCustomName] = useState('');

  const allConfigurations = [...DEFAULT_BAND_CONFIGURATIONS, ...userConfigurations];
  const availableColors: BandColor[] = ['red', 'blue', 'yellow', 'black'];

  const handleConfigurationSelect = (config: BandConfiguration) => {
    onConfigurationChange(config);
  };

  const handleCustomColorToggle = (color: BandColor) => {
    if (customColors.includes(color)) {
      setCustomColors(customColors.filter(c => c !== color));
    } else {
      setCustomColors([...customColors, color]);
    }
  };

  const handleCreateCustom = () => {
    if (customColors.length > 0) {
      const config = createBandConfiguration(customColors, customName || undefined);
      onConfigurationChange(config);
      setIsCreatingCustom(false);
      setCustomColors([]);
      setCustomName('');
    }
  };

  const ColorDot: React.FC<{ color: BandColor; size?: 'sm' | 'md' }> = ({ 
    color, 
    size = 'sm' 
  }) => (
    <div
      className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full border border-gray-300`}
      style={{ backgroundColor: getBandColorHex(color) }}
    />
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-[#2C2C2C]">
        Band Configuration
      </label>

      {!isCreatingCustom ? (
        <>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {allConfigurations.map((config, index) => (
              <button
                key={`${config.name}-${index}`}
                onClick={() => handleConfigurationSelect(config)}
                disabled={disabled}
                className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all ${
                  selectedConfiguration?.name === config.name
                    ? 'bg-[#8B9A5B] text-white border-2 border-[#6B7A4B]'
                    : 'bg-[#F0E6D6] text-[#2C2C2C] border border-[#E8D7C3] hover:bg-[#E8D7C3]'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-medium">{config.name}</span>
                <div className="flex space-x-1">
                  {config.colors.map((color, colorIndex) => (
                    <ColorDot key={colorIndex} color={color} />
                  ))}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreatingCustom(true)}
            disabled={disabled}
            className="w-full p-2 text-sm text-[#8B9A5B] border border-[#8B9A5B] rounded-lg hover:bg-[#8B9A5B]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Create Custom Configuration
          </button>
        </>
      ) : (
        <div className="space-y-3 p-3 bg-[#F0E6D6]/50 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-[#2C2C2C] mb-2">
              Select Colors:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleCustomColorToggle(color)}
                  className={`flex items-center p-2 rounded text-sm transition-all ${
                    customColors.includes(color)
                      ? 'bg-[#8B9A5B] text-white'
                      : 'bg-white text-[#2C2C2C] border border-[#E8D7C3]'
                  }`}
                >
                  <ColorDot color={color} size="md" />
                  <span className="ml-2 capitalize">{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2C2C2C] mb-1">
              Custom Name (optional):
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., My Heavy Setup"
              className="w-full px-2 py-1 text-sm border border-[#E8D7C3] rounded focus:ring-1 focus:ring-[#8B9A5B] focus:border-transparent"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCreateCustom}
              disabled={customColors.length === 0}
              className="flex-1 px-3 py-2 bg-[#8B9A5B] text-white text-sm rounded hover:bg-[#6B7A4B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create ({customColors.length} colors)
            </button>
            <button
              onClick={() => {
                setIsCreatingCustom(false);
                setCustomColors([]);
                setCustomName('');
              }}
              className="px-3 py-2 bg-[#2C2C2C]/10 text-[#2C2C2C] text-sm rounded hover:bg-[#2C2C2C]/20"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BandSelector;
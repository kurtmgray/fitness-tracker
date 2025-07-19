// Band configuration utilities for fitness tracker

export type BandColor = 'red' | 'blue' | 'yellow' | 'black';

export interface BandConfiguration {
  id?: string;
  name: string;
  colors: BandColor[];
  isDefault?: boolean;
  userId?: string;
}

// Default band configurations that come pre-loaded
export const DEFAULT_BAND_CONFIGURATIONS: BandConfiguration[] = [
  { name: 'Red', colors: ['red'], isDefault: true },
  { name: 'Blue', colors: ['blue'], isDefault: true },
  { name: 'Yellow', colors: ['yellow'], isDefault: true },
  { name: 'Black', colors: ['black'], isDefault: true },
  { name: 'Red + Blue', colors: ['red', 'blue'], isDefault: true },
  { name: 'Red + Yellow', colors: ['red', 'yellow'], isDefault: true },
  { name: 'Blue + Yellow', colors: ['blue', 'yellow'], isDefault: true },
  { name: 'Red + Blue + Yellow', colors: ['red', 'blue', 'yellow'], isDefault: true },
  { name: 'All Bands', colors: ['red', 'blue', 'yellow', 'black'], isDefault: true },
];

// Generate display name from colors
export const generateBandDisplayName = (colors: BandColor[]): string => {
  if (colors.length === 0) return 'No Bands';
  if (colors.length === 1) return colors[0].charAt(0).toUpperCase() + colors[0].slice(1);
  
  const colorNames = colors.map(color => color.charAt(0).toUpperCase() + color.slice(1));
  
  if (colors.length === 2) {
    return `${colorNames[0]} + ${colorNames[1]}`;
  }
  
  if (colors.length === 3) {
    return `${colorNames[0]} + ${colorNames[1]} + ${colorNames[2]}`;
  }
  
  if (colors.length === 4) {
    return 'All Bands';
  }
  
  return colorNames.join(' + ');
};

// Validate band configuration
export const isValidBandConfiguration = (config: Partial<BandConfiguration>): boolean => {
  if (!config.name || config.name.trim().length === 0) return false;
  if (!config.colors || config.colors.length === 0) return false;
  if (config.colors.length > 4) return false;
  
  const validColors: BandColor[] = ['red', 'blue', 'yellow', 'black'];
  return config.colors.every(color => validColors.includes(color));
};

// Check for duplicate colors in configuration
export const hasDuplicateColors = (colors: BandColor[]): boolean => {
  return new Set(colors).size !== colors.length;
};

// Sort colors in standard order (red, blue, yellow, black)
export const sortBandColors = (colors: BandColor[]): BandColor[] => {
  const order: BandColor[] = ['red', 'blue', 'yellow', 'black'];
  return colors.sort((a, b) => order.indexOf(a) - order.indexOf(b));
};

// Create a new band configuration
export const createBandConfiguration = (
  colors: BandColor[],
  customName?: string
): BandConfiguration => {
  const sortedColors = sortBandColors([...new Set(colors)]); // Remove duplicates and sort
  const name = customName || generateBandDisplayName(sortedColors);
  
  return {
    name,
    colors: sortedColors,
    isDefault: false,
  };
};

// Check if two band configurations are equivalent
export const areBandConfigurationsEqual = (
  config1: BandConfiguration,
  config2: BandConfiguration
): boolean => {
  if (config1.colors.length !== config2.colors.length) return false;
  
  const sorted1 = sortBandColors([...config1.colors]);
  const sorted2 = sortBandColors([...config2.colors]);
  
  return sorted1.every((color, index) => color === sorted2[index]);
};

// Find matching band configuration
export const findMatchingBandConfiguration = (
  colors: BandColor[],
  configurations: BandConfiguration[]
): BandConfiguration | null => {
  const targetConfig = createBandConfiguration(colors);
  
  return configurations.find(config => 
    areBandConfigurationsEqual(config, targetConfig)
  ) || null;
};

// Get band color hex codes for UI
export const getBandColorHex = (color: BandColor): string => {
  const colorMap: Record<BandColor, string> = {
    red: '#DC2626',
    blue: '#2563EB',
    yellow: '#FACC15',
    black: '#1F2937',
  };
  
  return colorMap[color];
};

// Format band configuration for display
export const formatBandConfiguration = (config: BandConfiguration): string => {
  if (config.colors.length === 0) return 'No bands';
  
  return config.name;
};

// Get resistance level estimate (placeholder - would be calibrated based on actual bands)
export const estimateBandResistance = (colors: BandColor[]): number => {
  const resistanceMap: Record<BandColor, number> = {
    yellow: 10, // lightest
    red: 15,
    blue: 20,
    black: 25, // heaviest
  };
  
  return colors.reduce((total, color) => total + resistanceMap[color], 0);
};
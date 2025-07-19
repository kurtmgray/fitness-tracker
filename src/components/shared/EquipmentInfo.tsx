import { Info } from 'lucide-react';
import { useState } from 'react';

export function EquipmentInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowInfo(!showInfo)}
        className="inline-flex items-center text-sm text-[#8B9A5B] hover:text-[#6B7A4B] transition-colors"
      >
        <Info className="w-4 h-4 mr-1" />
        Equipment Guide
      </button>

      {showInfo && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#E8D7C3] rounded-lg shadow-lg p-4 z-50">
          <h4 className="font-medium text-[#2C2C2C] mb-3">How Weight is Calculated</h4>
          
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium text-[#2C2C2C]">Barbell (BB)</div>
              <div className="text-[#2C2C2C]/70">Weight entered = Total weight</div>
              <div className="text-xs text-[#8B9A5B]">Example: 185 lbs</div>
            </div>

            <div>
              <div className="font-medium text-[#2C2C2C]">Dumbbell (DB)</div>
              <div className="text-[#2C2C2C]/70">Weight per hand, automatically doubled</div>
              <div className="text-xs text-[#8B9A5B]">Example: 45 lbs × 2 = 90 lbs total</div>
            </div>

            <div>
              <div className="font-medium text-[#2C2C2C]">Kettlebell (KB)</div>
              <div className="text-[#2C2C2C]/70">Weight entered = Total weight</div>
              <div className="text-xs text-[#8B9A5B]">Example: 44 lbs</div>
            </div>

            <div>
              <div className="font-medium text-[#2C2C2C]">Bodyweight (BW)</div>
              <div className="text-[#2C2C2C]/70">Uses estimated bodyweight for calculations</div>
              <div className="text-xs text-[#8B9A5B]">Example: Pull-ups, Push-ups</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E8D7C3]">
            <div className="text-xs text-[#2C2C2C]/60">
              Volume calculations automatically account for equipment type and multipliers.
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showInfo && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}
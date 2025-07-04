import React from 'react';
import { User, Users } from 'lucide-react';
import {
  type Gender,
  type Weights,
  type LiftType,
} from '../types/strengthTypes';

interface StrengthInputFormProps {
  gender: Gender;
  setGender: (gender: Gender) => void;
  bodyWeight: number;
  setBodyWeight: (weight: number) => void;
  weights: Weights;
  onWeightChange: (lift: LiftType, value: number) => void;
}

const StrengthInputForm: React.FC<StrengthInputFormProps> = ({
  gender,
  setGender,
  bodyWeight,
  setBodyWeight,
  weights,
  onWeightChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
        Your Stats
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Gender
          </label>
          <div className="flex bg-slate-200 rounded-lg p-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                gender === 'male'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300'
              }`}
            >
              <User className="w-4 h-4 mr-1" />
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                gender === 'female'
                  ? 'bg-slate-500 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Users className="w-4 h-4 mr-1" />
              Female
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Weight (lbs)
          </label>
          <input
            type="number"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            min="100"
            max="400"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Back Squat (lbs)
            </label>
            <input
              type="number"
              value={weights.squat}
              onChange={(e) => onWeightChange('squat', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="0"
              max="1000"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadlift (lbs)
            </label>
            <input
              type="number"
              value={weights.deadlift}
              onChange={(e) =>
                onWeightChange('deadlift', Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="0"
              max="1000"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bench Press (lbs)
            </label>
            <input
              type="number"
              value={weights.bench}
              onChange={(e) => onWeightChange('bench', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="0"
              max="1000"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overhead Press (lbs)
            </label>
            <input
              type="number"
              value={weights.overheadPress}
              onChange={(e) =>
                onWeightChange('overheadPress', Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="0"
              max="1000"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Romanian Deadlift (lbs)
            </label>
            <input
              type="number"
              value={weights.romanianDeadlift}
              onChange={(e) =>
                onWeightChange('romanianDeadlift', Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="0"
              max="1000"
            />
          </div>
          <div className="flex-1 sm:opacity-0 sm:pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default StrengthInputForm;

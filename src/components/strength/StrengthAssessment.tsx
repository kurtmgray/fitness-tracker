import React, { useState, useEffect } from 'react';
import { Activity, Bot, Database } from 'lucide-react';
import {
  type Gender,
  type Weights,
  type LiftType,
} from './types/strengthTypes';
import { useStrengthCalculations } from './hooks/useStrengthCalculations';
import { useStrengthAnalysis } from './hooks/useStrengthAnalysis';
import { trpc } from '@/lib/trpc';
import StrengthInputForm from './components/StrengthInputForm';
import StrengthStatsGrid from './components/StrengthStatsGrid';
import StrengthLevelCard from './components/StrengthLevelCard';
import StrengthAnalysisPanel from './components/StrengthAnalysisPanel';
import { UnifiedHeader } from '@/components/shared/UnifiedHeader';

const StrengthAssessment: React.FC = () => {
  const [bodyWeight, setBodyWeight] = useState<number>(175);
  const [gender, setGender] = useState<Gender>('male');
  const [weights, setWeights] = useState<Weights>({
    squat: 195,
    deadlift: 230,
    bench: 175,
    overheadPress: 90,
    romanianDeadlift: 200,
  });
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'manual' | 'workout_data'>('workout_data');

  // Fetch actual max weights from workout data
  const { data: actualMaxes, isLoading } = trpc.strength.getActualMaxes.useQuery();

  // Update weights when actual data loads
  useEffect(() => {
    if (actualMaxes?.maxWeights && dataSource === 'workout_data') {
      const newWeights: Weights = {
        squat: actualMaxes.maxWeights.squat || weights.squat,
        deadlift: actualMaxes.maxWeights.deadlift || weights.deadlift,
        bench: actualMaxes.maxWeights.bench || weights.bench,
        overheadPress: actualMaxes.maxWeights.overheadPress || weights.overheadPress,
        romanianDeadlift: actualMaxes.maxWeights.romanianDeadlift || weights.romanianDeadlift,
      };
      setWeights(newWeights);
      
      // Update body weight if available
      if (actualMaxes.bodyWeight) {
        setBodyWeight(actualMaxes.bodyWeight);
      }
    }
  }, [actualMaxes, dataSource]);

  const { results, analysis } = useStrengthCalculations(
    bodyWeight,
    gender,
    weights
  );
  const { aiAnalysis } = useStrengthAnalysis(
    bodyWeight,
    weights,
    results,
    analysis
  );

  const handleWeightChange = (lift: LiftType, value: number): void => {
    setWeights((prev) => ({
      ...prev,
      [lift]: value,
    }));
    setShowAnalysis(false);
  };

  const handleGetAnalysis = (): void => {
    setShowAnalysis(true);
  };

  const handleDataSourceToggle = (): void => {
    const newSource = dataSource === 'manual' ? 'workout_data' : 'manual';
    setDataSource(newSource);
    setShowAnalysis(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-6">
      <UnifiedHeader
        title="Strength Assessment"
        icon={Activity}
        compact={true}
        rightContent={
          <div className="text-right text-sm">
            <div className="text-[#2C2C2C]/70">{gender === 'male' ? 'Men' : 'Women'} standards</div>
            <div className="text-[#8B9A5B] font-medium">{bodyWeight} lbs</div>
          </div>
        }
      />

      {/* Data Source Toggle */}
      <div className="mb-6">
        <div className="bg-[#F5F7F0] rounded-xl p-4 border border-[#8B9A5B]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#2C2C2C]">Data Source:</span>
            <button
              onClick={handleDataSourceToggle}
              disabled={isLoading || !actualMaxes?.maxWeights}
              className="text-xs bg-[#8B9A5B] text-white px-3 py-1 rounded-lg hover:bg-[#6B7A4B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dataSource === 'manual' ? 'Switch to Workout Data' : 'Switch to Manual Input'}
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/80">
            {dataSource === 'workout_data' ? (
              <>
                <Database className="w-4 h-4 text-[#8B9A5B]" />
                <span>Using max weights from your workout sessions</span>
                {actualMaxes?.lastUpdated && (
                  <span className="text-xs text-[#2C2C2C]/60">
                    (Updated: {new Date(actualMaxes.lastUpdated).toLocaleDateString()})
                  </span>
                )}
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-[#8B9A5B]" />
                <span>Manual input mode - enter your own weights</span>
              </>
            )}
          </div>
          
          {actualMaxes?.maxWeights && dataSource === 'workout_data' && (
            <div className="mt-3 text-xs text-[#2C2C2C]/60">
              Found data for: {Object.keys(actualMaxes.maxWeights).join(', ')}
            </div>
          )}
        </div>
      </div>

      <StrengthInputForm
        gender={gender}
        setGender={setGender}
        bodyWeight={bodyWeight}
        setBodyWeight={setBodyWeight}
        weights={weights}
        onWeightChange={handleWeightChange}
        readOnly={dataSource === 'workout_data'}
        dataSource={dataSource}
      />

      <StrengthStatsGrid analysis={analysis} bodyWeight={bodyWeight} />

      <div className="space-y-4 sm:space-y-6">
        {(Object.keys(weights) as LiftType[]).map((lift) => {
          const result = results[lift];
          if (!result) return null;

          return (
            <StrengthLevelCard
              key={lift}
              lift={lift}
              result={result}
              weights={weights}
              bodyWeight={bodyWeight}
              gender={gender}
            />
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleGetAnalysis}
          className="bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
        >
          <Bot className="w-5 h-5 mr-2" />
          Get AI Analysis & Recommendations
        </button>
      </div>

      <StrengthAnalysisPanel
        aiAnalysis={aiAnalysis}
        analysis={analysis}
        results={results}
        weights={weights}
        showAnalysis={showAnalysis}
      />
    </div>
  );
};

export default StrengthAssessment;

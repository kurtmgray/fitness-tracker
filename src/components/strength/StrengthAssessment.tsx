import React, { useState } from 'react';
import { Activity, Bot } from 'lucide-react';
import {
  type Gender,
  type Weights,
  type LiftType,
} from './types/strengthTypes';
import { useStrengthCalculations } from './hooks/useStrengthCalculations';
import { useStrengthAnalysis } from './hooks/useStrengthAnalysis';
import StrengthInputForm from './components/StrengthInputForm';
import StrengthStatsGrid from './components/StrengthStatsGrid';
import StrengthLevelCard from './components/StrengthLevelCard';
import StrengthAnalysisPanel from './components/StrengthAnalysisPanel';

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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-[#2C2C2C] mb-2 sm:mb-4">
          <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-[#8B9A5B] mr-3 inline" />
          Strength Assessment
        </h1>
        <p className="text-base sm:text-lg text-[#2C2C2C]/80">
          Enter your working weights to see where you stand
        </p>
        <p className="text-sm text-[#2C2C2C]/60 mt-2">
          Standards adjusted for {gender === 'male' ? 'men' : 'women'}
        </p>
      </div>

      <StrengthInputForm
        gender={gender}
        setGender={setGender}
        bodyWeight={bodyWeight}
        setBodyWeight={setBodyWeight}
        weights={weights}
        onWeightChange={handleWeightChange}
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

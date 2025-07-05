import React from 'react';
import { Bot, BarChart3, Target } from 'lucide-react';
import {
  type AIAnalysis,
  type Analysis,
  type LiftResult,
  type LiftType,
  type Weights,
} from '../types/strengthTypes';
import { useStrengthStandards } from '../hooks/useStrengthStandards';

interface StrengthAnalysisPanelProps {
  aiAnalysis: AIAnalysis;
  analysis: Analysis;
  results: Record<LiftType, LiftResult>;
  weights: Weights;
  showAnalysis: boolean;
}

const StrengthAnalysisPanel: React.FC<StrengthAnalysisPanelProps> = ({
  aiAnalysis,
  analysis,
  results,
  weights,
  showAnalysis,
}) => {
  const { liftNames } = useStrengthStandards();

  if (!showAnalysis) return null;

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white rounded-xl p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">
          <Bot className="w-6 h-6 mr-2 inline" />
          AI Analysis & Insights
        </h3>

        <div className="mb-6">
          <h4 className="font-semibold text-base sm:text-lg mb-3">
            <BarChart3 className="w-5 h-5 mr-2 inline" />
            What Your Numbers Tell Me
          </h4>
          <div className="space-y-2">
            {aiAnalysis.insights && aiAnalysis.insights.length > 0 ? (
              aiAnalysis.insights.map((insight, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm sm:text-base">{insight}</p>
                </div>
              ))
            ) : (
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm sm:text-base">
                  Let me analyze your strength profile...
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-base sm:text-lg mb-3">
            <Target className="w-5 h-5 mr-2 inline" />
            My Recommendations
          </h4>
          <div className="space-y-2">
            {aiAnalysis.recommendations &&
            aiAnalysis.recommendations.length > 0 ? (
              aiAnalysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-300"
                >
                  <p className="text-sm sm:text-base">{rec}</p>
                </div>
              ))
            ) : (
              <div className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-300">
                <p className="text-sm sm:text-base">
                  Working on personalized recommendations for you...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white rounded-xl p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">
          <BarChart3 className="w-6 h-6 mr-2 inline" />
          Quick Stats
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-2">
              Current Standing
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                Overall level:{' '}
                <strong className="capitalize">{analysis.overallLevel}</strong>
              </li>
              <li>
                Strongest lift: <strong>{analysis.strongestLift}</strong>
              </li>
              <li>
                Lifts at{' '}
                {analysis.overallLevel === 'elite'
                  ? 'elite'
                  : analysis.nextLevel}
                +:
                <strong>
                  {' '}
                  {analysis.intermediateLifts}/{analysis.totalLifts}
                </strong>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-2">
              Next Steps
            </h4>
            <ul className="space-y-1 text-sm">
              {(Object.keys(weights) as LiftType[]).map((lift) => {
                const result = results[lift];
                if (!result || result.progress.nextLevel === 'elite')
                  return null;

                return (
                  <li key={lift}>
                    <strong>{liftNames[lift]}:</strong>{' '}
                    {result.progress.nextWeight - weights[lift]} lbs to{' '}
                    {result.progress.nextLevel}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 sm:p-4 bg-white/10 rounded-lg">
          <p className="text-xs sm:text-sm">
            <strong>Note:</strong> These standards are based on working set
            weights (5-8 rep range), not 1RM estimates. This gives you a
            realistic view of your current training strength.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrengthAnalysisPanel;

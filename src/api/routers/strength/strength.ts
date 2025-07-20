import { router } from '@/api/trpc';
import { createStrengthAssessment } from './procedures/createAssessment';
import { getUserStrengthAssessments } from './procedures/getUserAssessments';
import { getActualMaxes } from './procedures/getActualMaxes';

export const strengthRouter = router({
  createAssessment: createStrengthAssessment,
  getUserAssessments: getUserStrengthAssessments,
  getActualMaxes: getActualMaxes,
});
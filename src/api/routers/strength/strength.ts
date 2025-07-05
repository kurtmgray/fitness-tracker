import { router } from '@/api/trpc';
import { createStrengthAssessment } from './procedures/createAssessment';
import { getUserStrengthAssessments } from './procedures/getUserAssessments';

export const strengthRouter = router({
  createAssessment: createStrengthAssessment,
  getUserAssessments: getUserStrengthAssessments,
});
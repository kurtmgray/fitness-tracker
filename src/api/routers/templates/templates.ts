import { router } from '@/api/trpc';
import { createWorkoutTemplate } from './procedures/createTemplate';
import { getUserWorkoutTemplates } from './procedures/getUserTemplates';

export const templatesRouter = router({
  create: createWorkoutTemplate,
  getUserTemplates: getUserWorkoutTemplates,
});
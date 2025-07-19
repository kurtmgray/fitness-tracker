import { router } from './trpc';
import { exercisesRouter } from './routers/exercises/exercises';
import { workoutsRouter } from './routers/workouts/workouts';
import { authRouter } from './routers/auth/auth';
import { templatesRouter } from './routers/templates/templates';
import { strengthRouter } from './routers/strength/strength';
import { equipmentRouter } from './routers/equipment/equipment';

export const appRouter = router({
  auth: authRouter,
  workouts: workoutsRouter,
  exercises: exercisesRouter,
  templates: templatesRouter,
  strength: strengthRouter,
  equipment: equipmentRouter,
});

export type AppRouter = typeof appRouter;
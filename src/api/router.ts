import { router } from './trpc';
import { exercisesRouter } from './routers/exercises/exercises';
import { workoutsRouter } from './routers/workouts/workouts';
import { authRouter } from './routers/auth/auth';

export const appRouter = router({
  auth: authRouter,
  workouts: workoutsRouter,
  exercises: exercisesRouter,
});

export type AppRouter = typeof appRouter;
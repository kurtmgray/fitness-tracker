import { router } from '../../trpc';
import { listExercises } from './procedures/list';
import { getExerciseById } from './procedures/getById';

export const exercisesRouter = router({
  list: listExercises,
  getById: getExerciseById,
});
import { router } from "@/api/trpc";
import { listWorkouts } from "./procedures/list";
import { getWorkoutById } from "./procedures/getById";
import { getWorkoutWithExercises } from "./procedures/getWithExercises";


export const workoutsRouter = router({
  list: listWorkouts,
  getById: getWorkoutById,
  getWithExercises: getWorkoutWithExercises,
});
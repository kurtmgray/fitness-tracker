import { router } from "@/api/trpc";
import { listWorkouts } from "./procedures/list";
import { getWorkoutById } from "./procedures/getById";
import { getWorkoutWithExercises } from "./procedures/getWithExercises";
import { createWorkoutSession } from "./procedures/createSession";
import { updateWorkoutSession } from "./procedures/updateSession";
import { deleteWorkoutSession } from "./procedures/deleteSession";
import { addExerciseToSession } from "./procedures/addExercise";
import { updateSessionExercise } from "./procedures/updateExercise";
import { removeExerciseFromSession } from "./procedures/removeExercise";
import { addSetToExercise } from "./procedures/addSet";
import { updateSet } from "./procedures/updateSet";
import { deleteSet } from "./procedures/deleteSet";
import { getUserWorkoutSessions } from "./procedures/getUserSessions";
import { getUserSessionsWithDetails } from "./procedures/getUserSessionsWithDetails";
import { getWorkoutSessionStats } from "./procedures/getSessionStats";
import { setEquipmentPreference } from "./procedures/setEquipmentPreference";
import { getEquipmentPreferences } from "./procedures/getEquipmentPreferences";
import { getBandConfigurations } from "./procedures/getBandConfigurations";
import { createBandConfiguration } from "./procedures/createBandConfiguration";
import { getWorkoutTemplate } from "./procedures/getWorkoutTemplate";
import { createWorkoutSession as createFullWorkoutSession } from "./procedures/createWorkoutSession";
import { saveSet } from "./procedures/saveSet";
import { completeWorkoutSession } from "./procedures/completeWorkoutSession";
import { getActiveSession } from "./procedures/getActiveSession";

export const workoutsRouter = router({
  // Legacy procedures (keep for compatibility)
  list: listWorkouts,
  getById: getWorkoutById,
  getWithExercises: getWorkoutWithExercises,
  
  // Session management
  createSession: createWorkoutSession,
  updateSession: updateWorkoutSession,
  deleteSession: deleteWorkoutSession,
  getUserSessions: getUserWorkoutSessions,
  getUserSessionsWithDetails: getUserSessionsWithDetails,
  getSessionStats: getWorkoutSessionStats,
  
  // Exercise management within sessions
  addExercise: addExerciseToSession,
  updateExercise: updateSessionExercise,
  removeExercise: removeExerciseFromSession,
  
  // Set management
  addSet: addSetToExercise,
  updateSet: updateSet,
  deleteSet: deleteSet,
  
  // Equipment preferences
  setEquipmentPreference: setEquipmentPreference,
  getEquipmentPreferences: getEquipmentPreferences,
  
  // Band configurations
  getBandConfigurations: getBandConfigurations,
  createBandConfiguration: createBandConfiguration,
  
  // Workout templates
  getWorkoutTemplate: getWorkoutTemplate,
  
  // Real-time workout tracking
  createFullWorkoutSession: createFullWorkoutSession,
  saveSet: saveSet,
  completeWorkoutSession: completeWorkoutSession,
  getActiveSession: getActiveSession,
});
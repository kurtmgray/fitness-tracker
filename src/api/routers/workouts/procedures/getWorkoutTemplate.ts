import { z } from 'zod';
import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';

export const getWorkoutTemplate = publicProcedure
  .input(z.object({
    dayType: z.enum(['day1', 'day2', 'day3'])
  }))
  .query(async ({ input }) => {
    // Fetch workout template and exercises from database
    const template = await db
      .selectFrom('workout_templates as wt')
      .select(['wt.id', 'wt.name', 'wt.description'])
      .where('wt.day_type', '=', input.dayType)
      .where('wt.is_default', '=', true)
      .where('wt.is_active', '=', true)
      .executeTakeFirst();

    if (!template) {
      throw new Error(`No default template found for day type: ${input.dayType}`);
    }

    // Fetch template exercises with exercise and equipment details
    const exercises = await db
      .selectFrom('template_exercises as te')
      .innerJoin('exercises as e', 'te.exercise_id', 'e.id')
      .leftJoin('equipment_types as et', 'e.primary_equipment_type_id', 'et.id')
      .select([
        'e.id',
        'e.name',
        'e.abbreviation',
        'e.supports_dual_weights',
        'e.tracking_type',
        'e.has_bosu_option',
        'e.primary_equipment_type_id',
        'et.name as equipment_type_name',
        'et.category as equipment_category',
        'te.order_index',
        'te.target_sets',
        'te.target_reps',
        'te.is_time_based',
        'te.is_failure',
        'te.has_bosu_ball_option'
      ])
      .where('te.template_id', '=', template.id)
      .orderBy('te.order_index')
      .execute();

    return {
      templateId: template.id,
      templateName: template.name,
      templateDescription: template.description,
      dayType: input.dayType,
      exercises: exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        abbreviation: exercise.abbreviation,
        sets: exercise.target_sets,
        reps: exercise.target_reps,
        trackingType: exercise.tracking_type,
        supportsDualWeights: exercise.supports_dual_weights,
        isFailure: exercise.is_failure || false,
        isTimeBased: exercise.is_time_based || false,
        hasBosoBallOption: exercise.has_bosu_ball_option || exercise.has_bosu_option || false,
        primaryEquipmentTypeId: exercise.primary_equipment_type_id,
        equipmentTypeName: exercise.equipment_type_name,
        equipmentCategory: exercise.equipment_category,
        orderIndex: exercise.order_index
      }))
    };
  });
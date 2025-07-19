import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

const createEquipmentTypeInput = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'plate', 'band', 'cable', 'machine']),
  description: z.string().optional(),
  supportsDualWeights: z.boolean().default(false),
  supportsVariableResistance: z.boolean().default(false),
  specifications: z.record(z.any()).optional(),
});

export const createEquipmentType = publicProcedure
  .input(createEquipmentTypeInput)
  .mutation(async ({ input }) => {
    const newEquipmentType = await db
      .insertInto('equipment_types')
      .values({
        name: input.name,
        category: input.category,
        description: input.description || null,
        supports_dual_weights: input.supportsDualWeights,
        supports_variable_resistance: input.supportsVariableResistance,
        specifications: input.specifications || null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    
    return newEquipmentType;
  });
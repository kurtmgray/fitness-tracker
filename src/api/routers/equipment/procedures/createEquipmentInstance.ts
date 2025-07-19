import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

const createEquipmentInstanceInput = z.object({
  equipmentTypeId: z.string().uuid(),
  name: z.string().min(1).max(100),
  specifications: z.record(z.any()).optional(),
  userId: z.string().uuid().optional(),
  isAvailable: z.boolean().default(true),
});

export const createEquipmentInstance = publicProcedure
  .input(createEquipmentInstanceInput)
  .mutation(async ({ input }) => {
    const newInstance = await db
      .insertInto('equipment_instances')
      .values({
        equipment_type_id: input.equipmentTypeId,
        name: input.name,
        specifications: input.specifications || null,
        user_id: input.userId || null,
        is_available: input.isAvailable,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    
    return newInstance;
  });
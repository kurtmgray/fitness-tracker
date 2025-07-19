import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

const updateEquipmentInstanceInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  specifications: z.record(z.any()).optional(),
  isAvailable: z.boolean().optional(),
});

export const updateEquipmentInstance = publicProcedure
  .input(updateEquipmentInstanceInput)
  .mutation(async ({ input }) => {
    const { id, ...updateData } = input;
    
    const updates: any = {};
    if (updateData.name !== undefined) updates.name = updateData.name;
    if (updateData.specifications !== undefined) updates.specifications = updateData.specifications;
    if (updateData.isAvailable !== undefined) updates.is_available = updateData.isAvailable;
    
    const updatedInstance = await db
      .updateTable('equipment_instances')
      .set(updates)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    
    return updatedInstance;
  });
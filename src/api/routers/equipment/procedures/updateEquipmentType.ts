import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

const updateEquipmentTypeInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
});

export const updateEquipmentType = publicProcedure
  .input(updateEquipmentTypeInput)
  .mutation(async ({ input }) => {
    const { id, ...updateData } = input;
    
    const updates: any = {};
    if (updateData.name !== undefined) updates.name = updateData.name;
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.specifications !== undefined) updates.specifications = updateData.specifications;
    
    const updatedEquipmentType = await db
      .updateTable('equipment_types')
      .set(updates)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    
    return updatedEquipmentType;
  });
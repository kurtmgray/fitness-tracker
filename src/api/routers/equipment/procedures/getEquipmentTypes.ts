import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

export const getEquipmentTypes = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    supportsDualWeights: z.boolean().optional(),
  }).optional())
  .query(async ({ input }) => {
    let query = db.selectFrom('equipment_types').selectAll();
    
    if (input?.category) {
      query = query.where('category', '=', input.category);
    }
    
    if (input?.supportsDualWeights !== undefined) {
      query = query.where('supports_dual_weights', '=', input.supportsDualWeights);
    }
    
    const equipmentTypes = await query
      .orderBy('category')
      .orderBy('name')
      .execute();
    
    return equipmentTypes;
  });
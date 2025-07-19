import { publicProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { z } from 'zod';

export const getEquipmentInstances = publicProcedure
  .input(z.object({
    equipmentTypeId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    isAvailable: z.boolean().optional(),
  }).optional())
  .query(async ({ input }) => {
    let query = db
      .selectFrom('equipment_with_types')
      .selectAll();
    
    if (input?.equipmentTypeId) {
      query = query.where('type_id', '=', input.equipmentTypeId);
    }
    
    if (input?.userId) {
      query = query.where('user_id', '=', input.userId);
    }
    
    if (input?.isAvailable !== undefined) {
      query = query.where('is_available', '=', input.isAvailable);
    }
    
    const instances = await query
      .orderBy('type_name')
      .orderBy('instance_name')
      .execute();
    
    return instances;
  });
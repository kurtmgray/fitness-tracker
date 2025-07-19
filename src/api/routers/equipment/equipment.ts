import { router } from '@/api/trpc';
import { getEquipmentTypes } from './procedures/getEquipmentTypes';
import { createEquipmentType } from './procedures/createEquipmentType';
import { updateEquipmentType } from './procedures/updateEquipmentType';
import { getEquipmentInstances } from './procedures/getEquipmentInstances';
import { createEquipmentInstance } from './procedures/createEquipmentInstance';
import { updateEquipmentInstance } from './procedures/updateEquipmentInstance';

export const equipmentRouter = router({
  // Equipment Types
  getEquipmentTypes,
  createEquipmentType,
  updateEquipmentType,
  
  // Equipment Instances
  getEquipmentInstances,
  createEquipmentInstance,
  updateEquipmentInstance,
});
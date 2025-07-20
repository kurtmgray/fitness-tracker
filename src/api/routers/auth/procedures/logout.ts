import { protectedProcedure } from '../../../trpc';

export const logout = protectedProcedure
  .mutation(async () => {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from localStorage
    // This endpoint can be used for server-side cleanup if needed
    return { success: true };
  });
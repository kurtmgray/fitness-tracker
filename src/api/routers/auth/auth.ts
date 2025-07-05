import { router } from '../../trpc';
import { googleLogin } from './procedures/googleLogin';
import { me } from './procedures/me';
import { logout } from './procedures/logout';

export const authRouter = router({
  googleLogin,
  me,
  logout,
});
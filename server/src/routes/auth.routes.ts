import { Router } from 'express';
import { loginSchema, signupSchema } from '@goldly/shared';
import { validate } from '../middleware/validate';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();

router.post('/signup', validate(signupSchema), async (req, res) => {
  try { res.json(await authService.signup(req.body.name, req.body.email, req.body.password)); }
  catch (e: any) { res.status(400).json({ message: e.message }); }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try { res.json(await authService.login(req.body.email, req.body.password)); }
  catch (e: any) { res.status(401).json({ message: e.message }); }
});

router.post('/refresh', async (req, res) => {
  try { res.json(await authService.refresh(req.body.refreshToken)); }
  catch { res.status(401).json({ message: 'Invalid refresh token' }); }
});

router.post('/logout', (_req, res) => res.json({ ok: true }));

export default router;

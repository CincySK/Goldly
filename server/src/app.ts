import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import kycRoutes from './routes/kyc.routes';
import listingsRoutes from './routes/listings.routes';
import messagingRoutes from './routes/messaging.routes';
import reviewsRoutes from './routes/reviews.routes';
import notificationsRoutes from './routes/notifications.routes';
import adminRoutes from './routes/admin.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

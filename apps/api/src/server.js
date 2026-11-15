import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';

const app = express();

if (config.isProduction) {
  // The API is expected to sit behind one trusted reverse proxy in production.
  app.set('trust proxy', 1);
}

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include same-origin and non-browser clients.
    callback(null, !origin || config.allowedOrigins.includes(origin));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use('/auth', authRouter);
app.use('/projects', projectsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected error' });
});

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});

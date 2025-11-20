import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { config } from './config.js';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';

// Register authentication strategies and shared serialize/deserialize logic
import './auth/local.js';
import './auth/github.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
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

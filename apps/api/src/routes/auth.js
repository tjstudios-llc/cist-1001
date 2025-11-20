import express from 'express';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passportLocal from '../auth/local.js';
import passportGithub from '../auth/github.js';
import { getDb } from '../db/client.js';
import { config } from '../config.js';

const router = express.Router();

router.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);
router.use(passportLocal.initialize());
router.use(passportLocal.session());
router.use(passportGithub.initialize());
router.use(passportGithub.session());

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const db = await getDb();
    const hash = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)', username, hash, email);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ message: 'User already exists' });
    }
    next(error);
  }
});

router.post('/login', passportLocal.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in', user: req.user });
});

router.get('/github', passportGithub.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/auth/failure' }),
  (_req, res) => {
    res.redirect('/');
  }
);

router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthenticated' });
  }
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

router.get('/failure', (_req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
});

export default router;

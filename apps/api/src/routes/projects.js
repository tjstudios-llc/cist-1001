import express from 'express';
import { getDb } from '../db/client.js';

const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const db = await getDb();
    const projects = await db.all('SELECT * FROM projects WHERE owner_id = ?', req.user.id);
    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuth, async (req, res, next) => {
  try {
    const { name, repoUrl, publishUrl, customDomain } = req.body;
    const db = await getDb();
    await db.run(
      'INSERT INTO projects (owner_id, name, repo_url, publish_url, custom_domain) VALUES (?, ?, ?, ?, ?)',
      req.user.id,
      name,
      repoUrl,
      publishUrl,
      customDomain
    );
    res.status(201).json({ message: 'Project created' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/domain', ensureAuth, async (req, res, next) => {
  try {
    const { customDomain } = req.body;
    const db = await getDb();
    await db.run('UPDATE projects SET custom_domain = ? WHERE id = ? AND owner_id = ?', customDomain, req.params.id, req.user.id);
    res.json({ message: 'Domain updated' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/publish', ensureAuth, async (req, res, next) => {
  try {
    const { publishUrl } = req.body;
    const db = await getDb();
    await db.run('UPDATE projects SET publish_url = ? WHERE id = ? AND owner_id = ?', publishUrl, req.params.id, req.user.id);
    res.json({ message: 'Publish target updated' });
  } catch (error) {
    next(error);
  }
});

export default router;

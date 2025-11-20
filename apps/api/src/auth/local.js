import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/client.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = await getDb();
      const user = await db.get('SELECT * FROM users WHERE username = ?', username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValid = await bcrypt.compare(password, user.password_hash || '');
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

export default passport;

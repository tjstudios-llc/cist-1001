import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from '../config.js';
import { getDb } from '../db/client.js';

passport.use(
  new GitHubStrategy(
    {
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackUrl
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const db = await getDb();
        let user = await db.get('SELECT * FROM users WHERE github_id = ?', profile.id);
        if (!user) {
          await db.run(
            'INSERT INTO users (username, github_id, email) VALUES (?, ?, ?)',
            profile.username,
            profile.id,
            profile.emails?.[0]?.value || null
          );
          user = await db.get('SELECT * FROM users WHERE github_id = ?', profile.id);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
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

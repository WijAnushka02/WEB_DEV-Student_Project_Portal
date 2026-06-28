const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        const profilePic = profile.photos?.[0]?.value || null;

        // Check if this is an admin auth flow (via session flag set before OAuth)
        const isAdminFlow = req.session?.adminAuthFlow === true;
        const pendingRole = req.session?.pendingRole || null;

        let result = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [googleId]
        );

        if (result.rows.length > 0) {
          // Existing user
          const user = result.rows[0];

          // If admin flow but user is not admin, reject
          if (isAdminFlow && user.role !== 'admin') {
            return done(null, false, { message: 'Not an admin account.' });
          }

          // Update profile pic in case it changed
          await pool.query(
            'UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE id = $2',
            [profilePic, user.id]
          );

          return done(null, { ...user, profile_pic: profilePic });
        }

        // New user — determine role
        let role = 'recruiter'; // default for new OAuth signups (companies/recruiters)

        if (isAdminFlow) {
          role = 'admin';
        } else if (pendingRole === 'student') {
          role = 'student';
        }

        // For students, student_id will be set after OAuth via a separate endpoint
        const insertResult = await pool.query(
          `INSERT INTO users (google_id, name, email, profile_pic, role, admin_verified)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [googleId, name, email, profilePic, role, isAdminFlow]
        );

        // Clear admin flow session flags
        if (req.session) {
          delete req.session.adminAuthFlow;
          delete req.session.pendingRole;
        }

        return done(null, insertResult.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || false);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

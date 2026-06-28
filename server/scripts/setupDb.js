require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    console.log('🔗 Connected to PostgreSQL...');
    await client.query('BEGIN');

    // USERS
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        google_id   VARCHAR(255) UNIQUE NOT NULL,
        name        VARCHAR(255) NOT NULL,
        email       VARCHAR(255) UNIQUE NOT NULL,
        profile_pic VARCHAR(500),
        role        VARCHAR(20)  NOT NULL DEFAULT 'student'
                      CHECK (role IN ('student', 'recruiter', 'admin')),
        student_id  VARCHAR(50)  UNIQUE,
        admin_verified BOOLEAN  NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
      );
    `);

    // PROJECTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title         VARCHAR(255) NOT NULL,
        description   TEXT        NOT NULL,
        thumbnail_url VARCHAR(500),
        github_url    VARCHAR(500),
        demo_url      VARCHAR(500),
        tech_stack    JSONB        NOT NULL DEFAULT '[]',
        status        VARCHAR(20)  NOT NULL DEFAULT 'published'
                        CHECK (status IN ('draft', 'published')),
        view_count    INTEGER      NOT NULL DEFAULT 0,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      );
    `);

    // PROJECT TAGS
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_tags (
        id         SERIAL PRIMARY KEY,
        project_id INTEGER     NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        tag        VARCHAR(100) NOT NULL
      );
    `);

    // LIKES
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_id INTEGER   NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, project_id)
      );
    `);

    // FOLLOWERS
    await client.query(`
      CREATE TABLE IF NOT EXISTS followers (
        id           SERIAL PRIMARY KEY,
        follower_id  INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(follower_id, following_id),
        CHECK(follower_id <> following_id)
      );
    `);

    // NOTIFICATIONS
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id           SERIAL PRIMARY KEY,
        recipient_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        actor_id     INTEGER   REFERENCES users(id) ON DELETE SET NULL,
        project_id   INTEGER   REFERENCES projects(id) ON DELETE SET NULL,
        type         VARCHAR(50) NOT NULL
                       CHECK (type IN ('like', 'follow', 'project_created', 'comment')),
        message      TEXT      NOT NULL,
        is_read      BOOLEAN   NOT NULL DEFAULT FALSE,
        read_at      TIMESTAMP,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // SESSIONS (for connect-pg-simple)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid"    VARCHAR     NOT NULL COLLATE "default",
        "sess"   JSON        NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

    // Auto-update updated_at trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    const triggerTables = ['users', 'projects'];
    for (const table of triggerTables) {
      await client.query(`
        DROP TRIGGER IF EXISTS trigger_${table}_updated_at ON ${table};
        CREATE TRIGGER trigger_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    await client.query('COMMIT');
    console.log('✅ All tables created successfully!');
    console.log('📋 Tables: users, projects, project_tags, likes, followers, notifications, session');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();

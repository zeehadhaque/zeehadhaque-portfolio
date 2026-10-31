import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const initDb = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS course_entitlements (
      student_id TEXT,
      course_id TEXT,
      access_type TEXT,
      PRIMARY KEY (student_id, course_id)
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      course_id TEXT,
      admin_id TEXT,
      action TEXT,
      reason TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS manual_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT,
      course_id TEXT,
      amount REAL,
      status TEXT,
      receipt_url TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database initialized successfully.');
};

export const grantAccess = async (studentId: string, courseId: string, accessType: 'FREE' | 'PAID' | 'LIFETIME' | 'FREE_GIVEAWAY', adminKey: string | undefined) => {
  if (adminKey !== process.env.ZEEHAD_ADMIN_SECRET) {
    return { success: false, error: 'Unauthorized' };
  }

  await client.execute({
    sql: 'INSERT OR REPLACE INTO course_entitlements (student_id, course_id, access_type) VALUES (?, ?, ?)',
    args: [studentId, courseId, accessType],
  });

  await client.execute({
    sql: 'INSERT INTO audit_logs (student_id, course_id, admin_id, action, reason) VALUES (?, ?, ?, ?, ?)',
    args: [studentId, courseId, 'ZEEHAD_ADMIN', 'GRANT_ACCESS', 'Admin Grant'],
  });

  return { success: true };
};

export const revokeAccess = async (studentId: string, courseId: string, adminKey: string | undefined) => {
  if (adminKey !== process.env.ZEEHAD_ADMIN_SECRET) {
    return { success: false, error: 'Unauthorized' };
  }

  await client.execute({
    sql: 'DELETE FROM course_entitlements WHERE student_id = ? AND course_id = ?',
    args: [studentId, courseId],
  });
  return { success: true };
};

export const getEntitlements = async (studentId: string) => {
    const result = await client.execute({
        sql: 'SELECT course_id, access_type FROM course_entitlements WHERE student_id = ?',
        args: [studentId],
    });
    return result.rows;
};

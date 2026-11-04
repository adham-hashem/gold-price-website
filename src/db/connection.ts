export function databaseTls(certificate = process.env.DATABASE_CA_CERT) {
  return { rejectUnauthorized: true, ...(certificate ? { ca: certificate.replace(/\\n/g, '\n') } : {}) };
}

export function runtimeConnectionConfig(env: { DATABASE_URL?: string; DATABASE_CA_CERT?: string } = { DATABASE_URL: process.env.DATABASE_URL, DATABASE_CA_CERT: process.env.DATABASE_CA_CERT }) {
  const url = env.DATABASE_URL;
  if (!url) throw new Error('Configure the server-only DATABASE_URL with your Supabase transaction-pooler connection string');
  // Report configuration errors without exposing the connection string or password.
  try {
    const parsed = new URL(url);
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol) || !parsed.hostname || !parsed.username || !parsed.pathname.slice(1)) throw new Error();
  } catch { throw new Error('DATABASE_URL must be a valid PostgreSQL connection string'); }
  return {
    url,
    options: {
      max: 1,
      prepare: false,
      max_pipeline: 1,
      idle_timeout: 20,
      connect_timeout: 8,
      ssl: databaseTls(env.DATABASE_CA_CERT),
    },
  };
}

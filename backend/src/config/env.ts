const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const appConfig = {
  port: Number(process.env.PORT ?? 4000),
};

export const firebaseAdminConfig = {
  projectId: requireEnv("FIREBASE_PROJECT_ID"),
  clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
  privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
};


import dotenv from 'dotenv';

// The application's .env (the current folder), read before any module that reads the environment;
// variables already set win.
dotenv.config({ quiet: true } as any);

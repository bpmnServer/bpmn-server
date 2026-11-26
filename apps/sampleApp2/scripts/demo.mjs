// npm run demo: this server with no sign-in, for a demonstration on your own machine (index.ts: DEMO_NO_LOGIN).
process.env.DEMO_NO_LOGIN = 'true';
await import('../index.ts');

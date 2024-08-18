export default () => ({
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: process.env.SESSION_MAX_AGE || 300000,
    rolling: process.env.SESSION_ROLLING || true,
    resave: process.env.SESSION_RESAVE || false,
    saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED || false,
  },
});

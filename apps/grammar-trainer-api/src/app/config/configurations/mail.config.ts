export default () => ({
  mail: {
    service: process.env.MAIL_SERVICE || 'gmail',
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE || true,
    auth: {
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
    },
  },
});

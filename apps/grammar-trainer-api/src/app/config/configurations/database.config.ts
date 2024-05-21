export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME,
    user: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    url: process.env.DATABASE_URL,
  },
});

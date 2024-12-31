export default () => ({
  http: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    baseUrl:
      `http://${process.env.HOST}:${process.env.PORT}` ||
      'http://localhost:3000',
  },
});

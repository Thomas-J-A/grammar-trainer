export default () => ({
  http: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
});

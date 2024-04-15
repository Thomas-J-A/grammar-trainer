export default () => ({
  cache: {
    host: process.env.CACHE_HOST || 'localhost',
    port: process.env.CACHE_PORT || 6379,
  },
});

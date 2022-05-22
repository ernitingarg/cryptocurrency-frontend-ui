module.exports = {
  target: 'experimental-serverless-trace',
  env: {
    CF_HOST: process.env.CF_HOST,
    FIREBASE_ENV: process.env.FIREBASE_ENV,
  },
};

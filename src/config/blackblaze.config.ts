// src/config/backblaze.config.ts
export default () => ({
    backblaze: {
      accountId: process.env.BACKBLAZE_ACCOUNT_ID,
      applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
      bucketId: process.env.BACKBLAZE_BUCKET_ID,
    },
  });
  
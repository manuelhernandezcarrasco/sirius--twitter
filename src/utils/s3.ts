import * as aws from 'aws-sdk';

const s3 = new aws.S3({
  region: process.env.S3_BUCKET_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

export const generateUploadURL = async (id: string, folder: string) => {
  return await s3.getSignedUrlPromise('putObject', {
    Bucket: `${process.env.S3_BUCKET_NAME}/${folder}`,
    Key: id,
    Expires: 60,
  });
};

export enum BucketFolders {
    PROFILE = 'profile',
    POST = 'post'
}
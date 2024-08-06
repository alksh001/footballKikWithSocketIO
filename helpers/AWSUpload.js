const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../secret/appSecret');

// Create S3 client
const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: secret.aws.accessKeyId,
        secretAccessKey: secret.aws.secretAccessKey,
    },
});

// Set up multer-s3 storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'myfootballapp',
        // acl: 'public-read',
        metadata: (req, file, cb) =>
        {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) =>
        {
            cb(null, file.originalname);
        },
    }),
});

exports.Upload = upload;


// exports.Upload = upload



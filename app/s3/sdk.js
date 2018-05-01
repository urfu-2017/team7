import { Client } from 'minio';
import config from '../config';


const client = new Client({
    endPoint: config.S3_ENDPOINT,
    port: config.S3_PORT,
    secure: config.S3_SECURE,
    accessKey: config.S3_ACCESS_KEY,
    secretKey: config.S3_SECRET_KEY
});

export default {
    getSignedUrl: function getSignedUrl(operation, params, callback) {
        if (operation === 'putObject') {
            client.presignedPutObject(params.Bucket, params.Key, callback);
        } else if (operation === 'getObject') {
            client.presignedGetObject(params.Bucket, params.Key, callback);
        } else {
            callback(new Error(`Invalid method name '${operation}'`));
        }
    }
};


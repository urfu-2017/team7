import S3Router from 'react-s3-uploader/s3router';
import { ensureLoggedIn } from 'connect-ensure-login/lib/index';
import config from '../config';
import s3 from './sdk';


export default S3Router({
    bucket: config.S3_BUCKET,
    getS3: () => s3
}, ensureLoggedIn('/login'));


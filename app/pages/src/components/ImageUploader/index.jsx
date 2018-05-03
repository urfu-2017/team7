import ReactS3Uploader from 'react-s3-uploader';
import React from 'react';


export default class ImageUploader extends React.Component {
    render() {
        const {
            onProgress, onError, onFinish, inputId, avatar
        } = this.props;

        return (
            <ReactS3Uploader
                signingUrl="/s3/sign"
                accept="image/*"
                s3path={avatar ? 'avatars/' : 'images/'}
                contentDisposition="auto"
                preprocess={(file, next) => {
                    onProgress(0);
                    next(file);
                }}
                onProgress={onProgress}
                onError={onError}
                onFinish={onFinish}
                style={{ display: 'none' }}
                id={inputId}
            />);
    }
}

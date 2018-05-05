import ReactS3Uploader from 'react-s3-uploader';
import React from 'react';


export default class ImageUploader extends React.Component {
    render() {
        const {
            onProgress, onError, onFinish, inputId, avatar
        } = this.props;

        return (
            <ReactS3Uploader
                ref={(uploader) => {
                    this.uploader = uploader;
                }}
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
                onFinish={(e) => {
                    this.uploader.clear();
                    if (typeof onFinish === 'function') {
                        onFinish(e);
                    }
                }
                }
                style={{ display: 'none' }}
                id={inputId}
            />);
    }
}

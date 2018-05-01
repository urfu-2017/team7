import React from 'react';
import uuidv4 from 'uuid/v4';
import { inject, observer } from 'mobx-react/index';
import ReactS3Uploader from 'react-s3-uploader';
import { Button } from 'semantic-ui-react';

@inject('currentUserStore')
@observer
class AvatarChanger extends React.Component {
    render() {
        const { changeAvatarUrl } = this.props.currentUserStore;
        const inputId = uuidv4();

        return (
            <React.Fragment>
                <ReactS3Uploader
                    signingUrl="/s3/sign"
                    accept="image/*"
                    s3path="avatars/"
                    contentDisposition="auto"
                    onFinish={({ publicUrl }) => {
                        changeAvatarUrl(publicUrl);
                    }}
                    style={{ display: 'none' }}
                    id={inputId}
                />
                <Button
                    as="label"
                    icon="upload"
                    for={inputId}
                    content="Изменить аватар"
                    className={this.props.className}
                />
            </React.Fragment>);
    }
}

export default AvatarChanger;

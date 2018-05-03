import React from 'react';
import uuidv4 from 'uuid/v4';
import { Icon } from 'semantic-ui-react';
import ImageUploader from '../ImageUploader';


export default class MessageImageUploader extends React.Component {
    state = { isLoading: false, gotError: false }

    onError() {
        this.setState({ gotError: true, isLoading: false });
    }

    onProgress(percent) {
        this.setState({ gotError: false, isLoading: percent !== 100 });
    }

    render() {
        const { onFinish, className } = this.props;
        const { gotError, isLoading } = this.state;
        const inputId = uuidv4();
        const clickInput = () => {
            // eslint-disable-next-line no-undef
            document.getElementById(inputId).click();
        };

        return (
            <React.Fragment>
                <ImageUploader
                    onProgress={percent => this.onProgress(percent)}
                    onError={() => this.onError()}
                    onFinish={({ publicUrl }) => onFinish(publicUrl)}
                    inputId={inputId}
                />
                <Icon
                    name={isLoading ? 'ellipsis horizontal' : 'image'}
                    size="large"
                    color={gotError ? 'red' : 'grey'}
                    className={className}
                    onClick={isLoading ? () => {} : clickInput}
                    title={gotError ? 'Произошла ошибка, попробуйте позже' : ''}
                />
            </React.Fragment>);
    }
}

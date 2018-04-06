import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import mainStore from '../../stores/main';
import { sendMessage } from '../../../../sockets/client';


@observer
class MessageInput extends React.Component {
    state = { text: '' };

    onSend = () => {
        sendMessage({ text: this.state.text, chatId: mainStore.activeChat.chatId });
        this.setState({ text: '' });
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Input
                        name="text"
                        value={this.state.text}
                        onChange={this.handleChange}
                    />
                    <Form.Button
                        disabled={mainStore.activeChat === null || this.state.text === ''}
                        content="Отправить"
                        onClick={this.onSend}
                    />
                </Form.Group>
            </Form>
        );
    }
}

export default MessageInput;

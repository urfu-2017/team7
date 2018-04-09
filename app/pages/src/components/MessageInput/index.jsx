import React from 'react';
import { observer, inject } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import { sendMessage } from '../../../../sockets/client';


@inject('chatsStore')
@observer
class MessageInput extends React.Component {
    state = { text: '' };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const { activeChat } = this.props.chatsStore;
        return (
            <Form>
                <Form.Group>
                    <Form.Input
                        name="text"
                        value={this.state.text}
                        onChange={this.handleChange}
                    />
                    <Form.Button
                        disabled={!activeChat || this.state.text === ''}
                        content="Отправить"
                        onClick={() => {
                            sendMessage({ text: this.state.text, chatId: activeChat.chatId });
                            this.setState({ text: '' });
                        }}
                    />
                </Form.Group>
            </Form>
        );
    }
}

export default MessageInput;

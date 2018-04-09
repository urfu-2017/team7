import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'semantic-ui-react';
import { sendMessage } from '../../../../sockets/client';
import css from './layout.css';

@inject('chatsStore')
@observer
class MessageInput extends React.Component {
    state = { text: '' };

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const { activeChat } = this.props.chatsStore;
        return (
            <div className={css.layout}>
                <Input
                    name="text"
                    value={this.state.text}
                    onChange={this.handleChange}
                    className={css.layout__input}
                />
                <Button
                    disabled={!activeChat || this.state.text === ''}
                    className={css.layout__button}
                    content="Отправить"
                    onClick={() => {
                        sendMessage({ text: this.state.text, chatId: activeChat.chatId });
                        this.setState({ text: '' });
                    }}
                />
            </div>

        );
    }
}

export default MessageInput;

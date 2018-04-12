import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'semantic-ui-react';
import { sendMessage } from '../../../../sockets/client';
import css from './layout.css';
import { MAX_MESSAGE_LENGTH } from '../../../../utils/constants';

@inject('chatsStore')
@observer
class MessageInput extends React.Component {
    state = { text: '' };

    get isValid() {
        return this.props.chatsStore.activeChat && this.state.text;
    }


    handleChange = (e, { name, value }) => this.setState({ [name]: value });
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.trySend();
        }
    };
    trySend = () => {
        if (this.isValid) {
            const { chatId } = this.props.chatsStore.activeChat;
            const { text } = this.state;
            sendMessage({ text, chatId });
            this.setState({ text: '' });
        }
    };

    render() {
        return (
            <div className={css.layout}>
                <Input
                    name="text"
                    value={this.state.text}
                    onChange={this.handleChange}
                    className={css.layout__input}
                    onKeyPress={this.handleKeyPress}
                    maxLength={MAX_MESSAGE_LENGTH}
                />
                <Button
                    disabled={!this.isValid}
                    className={css.layout__button}
                    color="red"
                    content="Отправить"
                    onClick={this.trySend}
                />
            </div>

        );
    }
}

export default MessageInput;

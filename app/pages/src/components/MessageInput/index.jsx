import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Icon } from 'semantic-ui-react';
import { sendMessage } from '../../../../sockets/client';
import css from './layout.css';
import { MAX_MESSAGE_LENGTH } from '../../../../utils/constants';
import EmojiSelector from '../EmojiSelector';

@inject('chatsStore')
@observer
class MessageInput extends React.Component {
    state = { text: '' };

    get isValid() {
        return this.props.chatsStore.activeChat && this.state.text;
    }


    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
        this.handleCursor(e);
    };

    handleCursor = (e) => {
        this.setState({ cursorPosition: e.target.selectionStart });
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.trySend();
        }
    };

    handleEmojiSelect = (value) => {
        const { text, cursorPosition } = this.state;
        const before = text.substr(0, cursorPosition);
        const after = text.substr(cursorPosition);
        this.setState({ text: before + value + after });
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
                    icon
                    value={this.state.text}
                    onChange={this.handleChange}
                    onClick={this.handleCursor}
                    onFocus={this.handleCursor}
                    className={css.layout__input}
                    onKeyPress={this.handleKeyPress}
                    maxLength={MAX_MESSAGE_LENGTH}
                >
                    <input />
                    <EmojiSelector onSelected={this.handleEmojiSelect}>
                        <Icon
                            name="smile"
                            size="large"
                            color="grey"
                            style={{ width: '2.2em', pointerEvents: 'auto', cursor: 'pointer' }}
                        />
                    </EmojiSelector>
                </Input>
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

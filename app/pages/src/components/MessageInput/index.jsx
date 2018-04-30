import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Icon } from 'semantic-ui-react';
import { sendMessage } from '../../../../sockets/client';
import css from './layout.css';
import { MAX_MESSAGE_LENGTH } from '../../../../utils/constants';
import EmojiSelector from '../EmojiSelector';
import MessageImageUploader from './MessageImageUploader';


@inject('chatsStore')
@observer
export default class MessageInput extends React.Component {
    state = { text: '', cursorPosition: 0, isPopupOpened: false };

    get isValid() {
        return this.props.chatsStore.activeChat && this.state.text;
    }

    setPopupOpened = (isPopupOpened) => {
        this.setState({ isPopupOpened });
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
        this.setState({
            text: before + value + after,
            cursorPosition: cursorPosition + value.length
        });
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
                    <input className={`${css.s1} ${css.s2} ${css.s3} ${css.s4} ${css.layout__inputbox}`} />
                    <MessageImageUploader
                        className={`${css.layout__imageicon} ${css.layout__icon}`}
                        onFinish={(url) => {
                            const { chatId } = this.props.chatsStore.activeChat;
                            sendMessage({ text: url, chatId });
                        }}
                    />
                    <EmojiSelector
                        onSelected={this.handleEmojiSelect}
                        onOpenedChanged={this.setPopupOpened}
                    >
                        <Icon
                            name="smile"
                            size="large"
                            color="grey"
                            className={this.state.isPopupOpened ?
                                css.layout__icon_active :
                                css.layout__icon}
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

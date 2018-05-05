import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Comment, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactHoverObserver from 'react-hover-observer';
import { getUser, onMessageSent, onUrlMeta, onWeather } from '../../../../sockets/client';
import Markdown from '../Markdown';
import UrlMeta from '../UrlMeta';
import Weather from '../Weather';
import Loader from '../Loader';
import Reactions from '../Reactions';
import ReactionButton from '../ReactionButton';
import css from './messages.css';

@inject('usersStore', 'currentUserStore', 'chatsStore')
@observer
class Messages extends React.Component {
    componentDidMount() {
        const { usersStore } = this.props;

        const users = [];
        this.props.messages.forEach(({ authorUserId }) => {
            if (!usersStore.getUsername(authorUserId) && !users.includes(authorUserId)) {
                users.push(authorUserId);
                getUser({ userId: authorUserId });
            }
        });

        const messages = ReactDOM.findDOMNode(this).parentElement;
        messages.onwheel = e => this.onwheel(e);
        messages.onscroll = e => this.onscroll(e);

        onMessageSent(() => this.scroll());
        onUrlMeta(() => this.scroll());
        onWeather(() => this.scroll());

        this.scroll();
    }

    componentDidUpdate(props) {
        const { chatId } = this.props;
        if (chatId !== props.chatId) {
            this.scroll();
        }
    }

    onwheel(e) {
        const messages = ReactDOM.findDOMNode(this).parentElement;
        e.preventDefault();
        const height = messages.scrollHeight - messages.offsetHeight;
        if ((e.deltaY < 0 && messages.scrollTop > 0) ||
            (e.deltaY > 0 && messages.scrollTop < height)) {
            messages.scrollTop += 75 * Math.sign(e.deltaY);
        }
    }

    onscroll() {
        const { chatsStore, chatId } = this.props;
        const messages = ReactDOM.findDOMNode(this).parentElement;
        const scrollDown = messages.scrollHeight - messages.scrollTop - messages.offsetHeight;
        chatsStore.setScrollHeight(scrollDown, chatId);
    }

    scroll() {
        const { chatsStore, chatId } = this.props;
        const value = chatsStore.getScrollHeight(chatId);
        const messages = ReactDOM.findDOMNode(this).parentElement;
        messages.scrollTop = messages.scrollHeight - messages.offsetHeight;
        if (value) {
            messages.scrollTop -= value;
        }
    }

    render() {
        const { usersStore } = this.props;

        return (
            <Comment.Group className={css.messages}>
                <div style={{ height: '.1px' }} />
                {this.props.messages.reverse().map(message => (
                    <Comment key={message.messageId} className={css.comment}>
                        <Comment.Avatar src={usersStore.getAvatar(message.authorUserId)} />
                        <Comment.Content>
                            <ReactHoverObserver>
                                <ReactionButton message={message} inReactionBar={false} />
                                <Comment.Author as={Link} to={`/user/${message.authorUserId}`}>
                                    {usersStore.getUsername(message.authorUserId)}
                                </Comment.Author>
                                <Comment.Metadata style={{ minHeight: '1.5em' }}>
                                    <div>
                                        {moment(message.timestamp).format('HH:mm')}
                                        <Loader status={message.status} />
                                    </div>
                                </Comment.Metadata>
                                <Comment.Text style={{ minHeight: '1em' }}>
                                    {message.content.startsWith('/s3/uploads') ?
                                        <Image style={{ maxHeight: '30vh', width: 'auto' }} src={message.content} onLoad={() => this.scroll()} /> :
                                        <Markdown source={message.content} needFormat />
                                    }
                                </Comment.Text>
                                <UrlMeta text={message.content} />
                                <Weather text={message.content} />
                            </ReactHoverObserver>
                            <Reactions message={message} />
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
        );
    }
}

export default Messages;

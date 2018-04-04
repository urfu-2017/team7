import React from 'react';
import { List, Image } from 'semantic-ui-react';

import { getChats, onChatsList } from '../../../../sockets/client';

class ChatList extends React.Component {
    componentDidMount() {
        onChatsList(chats => this.setState({ chats }));
        getChats();
    }

    render() {
        return (
            <List>
                {this.state.chats.map(chat => (
                    <List.Item key={chat.chatId}>
                        <Image avatar src={chat.AvatarUrl} />
                        <List.Content>
                            <List.Header as="a">{chat.name}</List.Header>
                            <List.Description>Текст последнего сообщения</List.Description>
                        </List.Content>
                    </List.Item>))}

            </List>);
    }
}

export default ChatList;

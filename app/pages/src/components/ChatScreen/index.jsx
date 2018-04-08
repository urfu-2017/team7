import React from 'react';
import { Grid } from 'semantic-ui-react';

import Messages from '../Messages';
import Chats from '../Chats';
import MessageInput from '../MessageInput';


const ChatScreen = () => (
    <Grid columns={2} divided>
        <Grid.Row stretched>
            <Grid.Column width={6}>
                <Chats />
            </Grid.Column>
            <Grid.Column width={10}>
                <Messages />
                <MessageInput />
            </Grid.Column>
        </Grid.Row>
    </Grid>
);

export default ChatScreen;

import React from 'react';
import { Item } from 'semantic-ui-react';

const ChatCreation = () => (
    <Item.Group>
        <Item>
            <Item.Image
                avatar
                size="tiny"
                src="https://react.semantic-ui.com/assets/images/avatar/large/jenny.jpg"
            />
            <Item.Content verticalAlign="middle">
                <Item.Header content="Veronika Ossi" />
            </Item.Content>
        </Item>
    </Item.Group>);

export default ChatCreation;

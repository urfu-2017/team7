import React from 'react';
import { Item, Segment } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import css from './layout.css';

@inject('chatsStore')
@observer
class ChatCreationActivity extends React.Component {
    render() {
        return (
            <Segment className={css.layout}>
                <Link to="/">&lt;&nbsp;Назад</Link>
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
                </Item.Group>
            </Segment>
        );
    }
}

export default ChatCreationActivity;

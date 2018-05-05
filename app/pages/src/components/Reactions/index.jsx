/* eslint-disable class-methods-use-this */

import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Button, Popup } from 'semantic-ui-react';
import ReactHoverObserver from 'react-hover-observer';
import _ from 'lodash';
import { addReaction, removeReaction } from '../../../../sockets/client';
import ReactionButton from '../ReactionButton';
import css from './styles.css';

@inject('currentUserStore', 'usersStore')
@observer
class Reactions extends React.Component {
    changeCount(reactions, messageId, reaction, currentId) {
        const ownReaction = reactions
            .find(element => element.userId === currentId && element.reaction === reaction);
        if (!ownReaction) {
            return () => addReaction(messageId, reaction);
        }

        return () => removeReaction(messageId, reaction);
    }

    reformingReactions(reactions, usersStore) {
        let reactionUsers = [];

        if (reactions) {
            reactionUsers = _(reactions)
                .groupBy('reaction')
                .map((values, reaction) => {
                    const users = [];
                    values.forEach((value) => {
                        const user = usersStore.getUser(value.userId);
                        if (user) {
                            users.push(user.username);
                        }
                    });

                    return { reaction, users };
                })
                .value();
        }

        reactionUsers.sort((first, second) => second.users.length - first.users.length);

        return reactionUsers;
    }

    render() {
        const { message, currentUserStore, usersStore } = this.props;
        const reactions = this.reformingReactions(message.reactions, usersStore);

        return (
            <ReactHoverObserver className={css.reactionBar}>
                {reactions.map(item => (
                    <Popup
                        key={message.messageId + item.reaction + item.users.length}
                        trigger={
                            <Button
                                basic
                                className={css.reactionBar__reaction}
                                onClick={this.changeCount(
                                    message.reactions,
                                    message.messageId,
                                    item.reaction,
                                    currentUserStore.user.userId
                                )}
                            >
                                {item.reaction} {item.users.length}
                            </Button>
                        }
                        content={item.users.join(', ')}
                    />
                ))}
                <ReactionButton inReactionBar message={message} />
            </ReactHoverObserver>
        );
    }
}

export default Reactions;

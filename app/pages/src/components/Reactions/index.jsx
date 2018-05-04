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
    // eslint-disable-next-line class-methods-use-this
    changeCount(reactions, messageId, reaction, currentId) {
        const ownReaction = reactions
            .find(element => element.userId === currentId && element.reaction === reaction);
        if (!ownReaction) {
            return () => addReaction(messageId, reaction);
        }

        return () => removeReaction(messageId, reaction);
    }
    // eslint-disable-next-line class-methods-use-this
    addFromPlus(messageId) {
        return value => addReaction(messageId, value);
    }

    // eslint-disable-next-line class-methods-use-this
    reformingReactions(reactions) {
        let reactionUsers = [];

        if (reactions) {
            reactionUsers = _(reactions)
                .groupBy('reaction')
                .map((values, reaction) => {
                    const users = [];
                    values.forEach(value => users
                        .push(this.props.usersStore.getUser(value.userId).username));

                    return { reaction, users };
                })
                .value();
        }

        reactionUsers.sort((first, second) => second.users.length - first.users.length);

        return reactionUsers;
    }

    render() {
        const { message, currentUserStore } = this.props;
        const reactions = this.reformingReactions(message.reactions);

        return (
            <ReactHoverObserver className={css.reactionsBar}>
                {reactions.map(item => (
                    <Popup
                        key={message.messageId + item.reaction + item.users.length}
                        trigger={
                            <Button
                                basic
                                className={css.reaction}
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

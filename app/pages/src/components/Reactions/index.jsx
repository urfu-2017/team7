import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Button, Popup } from 'semantic-ui-react';
import { isUndefined } from 'util';
import ReactHoverObserver from 'react-hover-observer';
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
        if (isUndefined(ownReaction)) {
            return () => addReaction(messageId, reaction);
        }

        return () => removeReaction(messageId, reaction);
    }
    // eslint-disable-next-line class-methods-use-this
    addFromPlus(messageId) {
        return value => addReaction(messageId, value);
    }

    reformingReactions(reactions) {
        const reactionCountAndUsers = {};
        const result = [];

        if (!isUndefined(reactions)) {
            reactions.forEach((element) => {
                const currentName = this.props.usersStore.getUser(element.userId).username;

                if (reactionCountAndUsers
                    .hasOwnProperty(element.reaction) &&// eslint-disable-line no-prototype-builtins
                    reactionCountAndUsers[element.reaction].users.indexOf(currentName) === -1) {
                    reactionCountAndUsers[element.reaction].count += 1;
                    reactionCountAndUsers[element.reaction].users.push(currentName);
                } else {
                    reactionCountAndUsers[element.reaction] = {
                        count: 1,
                        users: [currentName]
                    };
                }
            });
        }

        Object.keys(reactionCountAndUsers).forEach((key) => {
            result.push([key, reactionCountAndUsers[key].count, reactionCountAndUsers[key].users]);
        });

        result.sort((first, second) => second[1] - first[1]);

        return result;
    }

    render() {
        const { message, currentUserStore } = this.props;
        const reactions = this.reformingReactions(message.reactions);

        return (
            <ReactHoverObserver className={css.reactionsBar}>
                {reactions.map(item => (
                    <Popup
                        trigger={
                            <Button
                                basic
                                className={css.reaction}
                                onClick={this.changeCount(
                                    message.reactions,
                                    message.messageId,
                                    item[0],
                                    currentUserStore.user.userId
                                )}
                            >
                                {item[0]} {item[1]}
                            </Button>
                        }
                        content={item[2].join(', ')}
                    />
                ))}
                <ReactionButton inReactionBar message={message} />
            </ReactHoverObserver>
        );
    }
}

export default Reactions;

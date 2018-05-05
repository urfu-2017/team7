import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import EmojiSelector from '../EmojiSelector';
import { addReaction, removeReaction } from '../../../../sockets/client';
import css from './styles.css';
import cssFromReactionBar from '../Reactions/styles.css';

@inject('currentUserStore')
@observer
class ReactionButton extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    changeCount(reactions, messageId, currentId) {
        return (reaction) => {
            const ownReaction = reactions && reactions
                .find(element => element.userId === currentId && element.reaction === reaction);
            if (!ownReaction) {
                addReaction(messageId, reaction);
            } else {
                removeReaction(messageId, reaction);
            }
        };
    }

    render() {
        const {
            message,
            isHovering,
            inReactionBar,
            currentUserStore
        } = this.props;
        const visibility = isHovering && (!inReactionBar || message.reactions.length);
        const positionOfPopup = !inReactionBar ||
            (message.reactions && message.reactions.length) >= 4 ?
            'bottom right' : 'bottom left';

        return (
            <EmojiSelector
                onSelected={this.changeCount(
                    message.reactions,
                    message.messageId,
                    currentUserStore.user.userId
                )}
                onOpenedChanged={() => null}
                positionOfPopup={positionOfPopup}
            >
                {visibility &&
                <Button
                    basic
                    className={inReactionBar ?
                        cssFromReactionBar.reactionBar__reaction : css.button}
                    icon
                >
                    <Icon
                        name={inReactionBar ? 'plus' : 'smile'}
                    />
                </Button>}
            </EmojiSelector>
        );
    }
}

export default ReactionButton;

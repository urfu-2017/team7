import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import EmojiSelector from '../EmojiSelector';
import { addReaction } from '../../../../sockets/client';
import css from './styles.css';
import cssFromReactionBar from '../Reactions/styles.css';

class ReactionButton extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    addFromPlus(messageId) {
        return value => addReaction(messageId, value);
    }

    render() {
        const { message, isHovering, inReactionBar } = this.props;
        const condition = isHovering && (!inReactionBar || message.reactions.length);

        return (
            <EmojiSelector
                onSelected={this.addFromPlus(message.messageId)}
                onOpenedChanged={() => null}
            >
                {condition &&
                <Button
                    basic
                    className={inReactionBar ? cssFromReactionBar.reaction : css.reactionButton}
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

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

        const cssStyles = inReactionBar ? cssFromReactionBar.reaction : css.reactionButton;
        const iconName = inReactionBar ? 'plus' : 'smile';

        return (
            <EmojiSelector
                onSelected={this.addFromPlus(message.messageId)}
                onOpenedChanged={() => null}
            >
                <Button
                    basic
                    style={{
                        display: isHovering &&
                            (!inReactionBar || message.reactions.length > 0) ? 'inline-block' : 'none'
                    }}
                    className={cssStyles}
                    icon
                >
                    <Icon
                        name={iconName}
                    />
                </Button>
            </EmojiSelector>
        );
    }
}

export default ReactionButton;

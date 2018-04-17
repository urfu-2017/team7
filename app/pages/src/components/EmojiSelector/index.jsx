import _ from 'lodash';
import React from 'react';
import { Popup } from 'semantic-ui-react';
import * as css from './emoji.css';

const emojies = [
    '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😌',
    '😍', '😏', '😒', '😓', '😔', '😖', '😘', '😚', '😜', '😝',
    '😞', '😠', '😡', '😢', '😣', '😤', '😥', '😨', '😩', '😪',
    '😫', '😭', '😰', '😱', '😲', '😳', '😵', '😷', '😸', '😹'];

const ROW_LENGTH = 10;
class EmojiSelector extends React.Component {
    state = { isOpen: false };
    handleOpen = () => {
        this.setState({ isOpen: true });
    };

    handleClose = () => {
        this.setState({ isOpen: false });
    };
    render() {
        const { className, children, onSelected } = this.props;
        return (
            <Popup
                className={className}
                trigger={children}
                open={this.state.isOpen}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                on="click"
                position="top center"
                as="table"
            >
                <tbody>
                    {_.chunk(emojies, ROW_LENGTH)
                        .map((row, index) => ( // eslint-disable-next-line react/no-array-index-key
                            <tr key={index} >
                                {row.map(value => (
                                    <td
                                        key={value}
                                        className={css.emoji}
                                        onClick={() => {
                                            this.handleClose();
                                            onSelected(value);
                                        }}
                                    >{value}
                                    </td>))}
                            </tr>))}
                </tbody>

            </Popup>
        );
    }
}

export default EmojiSelector;

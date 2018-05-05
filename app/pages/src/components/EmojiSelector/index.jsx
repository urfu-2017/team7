import _ from 'lodash';
import React from 'react';
import { Popup } from 'semantic-ui-react';
import * as css from './popup.css';

const emojies = [
    '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😌',
    '😍', '😏', '😒', '😓', '😔', '😖', '😘', '😚', '😜', '😝',
    '😞', '😠', '😡', '😢', '😣', '😤', '😥', '😨', '😩', '😪',
    '😫', '😭', '😰', '😱', '😲', '😳', '😵', '😷', '😸', '😹'];

const ROW_LENGTH = 10;
export default class EmojiSelector extends React.Component {
    state = { isOpen: false };

    handleOpen = () => {
        const { onOpenedChanged } = this.props;
        this.setState({ isOpen: true });
        onOpenedChanged(true);
    };

    handleClose = () => {
        const { onOpenedChanged } = this.props;
        this.setState({ isOpen: false });
        onOpenedChanged(false);
    };

    render() {
        const {
            className,
            children,
            onSelected,
            positionOfPopup
        } = this.props;

        return (
            <Popup
                className={`${className} ${css.popup}`}
                trigger={children}
                open={this.state.isOpen}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                on="click"
                position={positionOfPopup || 'top center'}
                as="table"
                role="grid"
            >
                <tbody>
                    {_.chunk(emojies, ROW_LENGTH)
                        .map((row, index) => ( // eslint-disable-next-line react/no-array-index-key
                            <tr key={index} >
                                {row.map(value => (
                                    <td
                                        role="gridcell"
                                        key={value}
                                        className={css.popup__emoji}
                                        onClick={() => {
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

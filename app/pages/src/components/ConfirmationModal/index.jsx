import React from 'react';
import { Header, Modal, Button, Icon } from 'semantic-ui-react';

export default class ConfirmationModal extends React.Component {
    state = { isOpen: false }

    handleOpen = () => this.setState({ isOpen: true });
    handleClose = () => this.setState({ isOpen: false });

    render() {
        const {
            size,
            header,
            question,
            trigger,
            onAgree,
            onAgreeText,
            onDenyText
        } = this.props;
        const extendedTrigger = React.cloneElement(trigger, { onClick: this.handleOpen });

        return (
            <Modal
                trigger={extendedTrigger}
                size={size}
                open={this.state.isOpen}
                onClose={this.handleClose}
            >
                <Header content={header} />
                <Modal.Content>
                    <p>{question}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.handleClose}>
                        <Icon name="remove" /> {onDenyText}
                    </Button>
                    <Button color="red" inverted onClick={onAgree}>
                        <Icon name="checkmark" /> {onAgreeText}
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

import React from 'react';
import { Header, Modal, Button, Icon } from 'semantic-ui-react';

export default class ConfirmationModal extends React.Component {
    render() {
        const {
            size,
            header,
            question,
            trigger,
            onAgree,
            onDeny
        } = this.props;

        return (
            <Modal trigger={trigger} size={size}>
                <Header content={header} />
                <Modal.Content>
                    <p>{question}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red" inverted onClick={onDeny}>
                        <Icon name="remove" /> Нет
                    </Button>
                    <Button color="green" inverted onClick={onAgree}>
                        <Icon name="checkmark" /> Да
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
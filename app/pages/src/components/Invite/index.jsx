import React from 'react';
import QRCode from 'qrcode.react';
import { Modal, Input, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import css from './layout.css';


export default class Invite extends React.Component {
    state = { wasSaved: false };

    onCopy() {
        this.setState({ wasSaved: true });
    }

    onClose() {
        this.setState({ wasSaved: false });
    }

    createLink() {
        const { inviteWord, isForUser } = this.props;
        const { hostname, port, protocol } = window.location;
        const root = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

        return `${root}/${isForUser ? '#' : '#join/'}${inviteWord}`;
    }

    render() {
        const { title, children } = this.props;
        const { state: { wasSaved } } = this;
        const link = this.createLink();

        return (
            <Modal trigger={children} size="tiny" onClose={() => this.onClose()} closeIcon>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Content>
                    <QRCode className={css.layout__qrcode} renderAs="svg" value={link} />
                    <Input className={`${css.layout} ${css.layout__inputbox}`} defaultValue={link} action>
                        <input readOnly className={css.layout__input} />
                        <CopyToClipboard text={link} onCopy={() => this.onCopy()}>
                            {wasSaved ?
                                <Button key="clipboard-btn-saved" icon="checkmark" color="green" /> :
                                <Button key="clipboard-btn" icon="copy" />
                            }
                        </CopyToClipboard>
                    </Input>
                </Modal.Content>
            </Modal>
        );
    }
}

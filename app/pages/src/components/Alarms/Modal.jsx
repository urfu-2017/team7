import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import { alarmsInfo, playSoundSrc, stopSound } from '../Alarms/alarms';
import css from './styles.css';

const SnoozeButton = props => <Button color="black" onClick={() => props.snooze()} content={props.text} />;

@inject('alarmsStore')
@observer    
class ModalExampleDimmer extends Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.snooze = this.snooze.bind(this);
    }
    componentDidUpdate() {
        const { alarmsStore } = this.props;
        if (alarmsStore.activeAlarm) {
            this.play(0);
        }
    }

    play(i) {
        const { activeAlarm } = this.props.alarmsStore;
        const { sounds, interval } = alarmsInfo.find(j => j.voice === activeAlarm.voice);
        playSoundSrc(sounds[i % sounds.length]);
        setTimeout(() => {
            const alarm = this.props.alarmsStore.activeAlarm;
            if (alarm && alarm.voice === activeAlarm.voice) {
                this.play(i + 1);
            }
        }, interval);
    }

    close() {
        stopSound();
        this.props.alarmsStore.removeActiveAlarm();
    }

    snooze(minutes) {
        stopSound();
        this.props.alarmsStore.snooze(minutes);
    }

    render() {
        const { activeAlarm } = this.props.alarmsStore;
        const alarm = activeAlarm ? alarmsInfo.find(i => i.voice === activeAlarm.voice) : null;

        return (
            <div>
                <Modal
                    dimmer
                    open={!!activeAlarm}
                    closeOnEscape={false}
                    closeOnRootNodeClick={false}
                >
                    <Modal.Header>{alarm ? alarm.name : null}</Modal.Header>
                    <Modal.Content image>
                        <Image wrapped size="medium" src={alarm ? alarm.img : null} />
                        <Modal.Description>
                            <Header>{`${alarm ? alarm.name : null} пытается разбудить вас!`}</Header>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions className={css.modal_actions}>
                        <SnoozeButton snooze={() => this.snooze(1)} text="Одну минуту!" />
                        <SnoozeButton snooze={() => this.snooze(5)} text="Еще 5 минуточек..." />
                        <SnoozeButton snooze={() => this.snooze(30)} text="Не тревожьте меня полчаса!" />
                        <Button positive content="Просыпаюсь!" onClick={this.close} />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default ModalExampleDimmer;

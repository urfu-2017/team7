import React from 'react';
import { inject } from 'mobx-react/index';
import { Input, Button, Icon, Dropdown } from 'semantic-ui-react';

import css from './styles.css';
import { alarmsInfo, playSound } from './alarms';

const options = alarmsInfo.map(i => ({
    key: i.voice,
    value: i.voice,
    text: i.name
}));

@inject('alarmsStore')
class NewAlarm extends React.Component {
    timeOnChange = (event, data) => {
        const splittedTime = data.value.split(':');
        this.time = {
            hours: Number(splittedTime[0]),
            minutes: Number(splittedTime[1])
        };
    }
    voiceOnChange = (event, data) => {
        this.voice = data.value;
    }
    buttonOnClick = () => {
        const { props: { alarmsStore }, time, voice } = this;
        if (alarmsStore.alarms.length >= 5 ||
            !voice || !time || !Number.isInteger(time.minutes) || !Number.isInteger(time.hours)) {
            playSound('common', 'cant');
            return;
        }
        if (Number.isInteger(time.minutes) && Number.isInteger(time.hours) && voice) {
            alarmsStore.createAlarm(time, voice);
            playSound(voice, 'add');
        }
    }
    render() {
        return (
            <div className={css.new_alarm} >
                <Input type="time" placeholder="Время" onChange={this.timeOnChange} />
                <Dropdown placeholder="Озвучка" selection options={options} onChange={this.voiceOnChange} />
                <Button onClick={this.buttonOnClick}>
                    <Icon name="clock" size="big" /> Добавить
                </Button>
            </div>
        );
    }
}

export default NewAlarm;

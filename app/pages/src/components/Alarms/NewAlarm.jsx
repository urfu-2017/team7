import React from 'react';
import { inject } from 'mobx-react/index';
import { Input, Button, Icon, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

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
        this.time = data.value
            ? moment().hours(Number(splittedTime[0])).minutes(Number(splittedTime[1]))
            : null;
    }
    voiceOnChange = (event, data) => {
        this.voice = data.value;
    }
    buttonOnClick = () => {
        const { props: { alarmsStore }, time, voice } = this;
        if (voice && time && time.isValid() && alarmsStore.canCreateAlarm(time)) {
            alarmsStore.createAlarm(time, voice);
            playSound(voice, 'add');
        } else {
            playSound('common', 'cant');
        }
    }
    render() {
        return (
            <div className={css.new_alarm} >
                <Input
                    type="time"
                    placeholder="Время"
                    onChange={this.timeOnChange}
                    className={css.new_alarm__time_input}
                />
                <Dropdown
                    placeholder="Озвучка"
                    selection
                    options={options}
                    onChange={this.voiceOnChange}
                    className={css.new_alarm__voice_input}
                />
                <Button onClick={this.buttonOnClick}>
                    <Icon style={{ height: '28px' }} name="clock" size="big" /> Добавить
                </Button>
            </div>
        );
    }
}

export default NewAlarm;

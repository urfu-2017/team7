import React from 'react';
import { Image, Button, Checkbox, Icon } from 'semantic-ui-react';
import moment from 'moment';

import { alarmsInfo, playSound } from './alarms';
import css from './styles.css';

class Alarm extends React.PureComponent {
    constructor(props) {
        super(props);

        this.buttonOnClick = this.buttonOnClick.bind(this);
        this.checkboxOnChange = this.checkboxOnChange.bind(this);
    }
    buttonOnClick() {
        const { id, voice, removeAlarm } = this.props;
        removeAlarm(id);
        playSound(voice, 'remove');
    }
    checkboxOnChange() {
        const { id, changeAlarmActiveness } = this.props;
        changeAlarmActiveness(id);
    }
    render() {
        const { time, voice, active } = this.props;
        const { img } = alarmsInfo.find(i => i.voice === voice);

        return (
            <div className={css.alarm}>
                <Image src={img} size="tiny" />
                <span>{moment().minutes(time.minutes).hours(time.hours).format('HH:mm')}</span>
                <Checkbox toggle defaultChecked={active} onChange={this.checkboxOnChange} />
                <Button color="red" onClick={this.buttonOnClick}><Icon name="trash" size="big" />Удалить</Button>
            </div>
        );
    }
}

export default Alarm;

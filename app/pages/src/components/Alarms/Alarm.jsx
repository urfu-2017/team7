import React from 'react';
import { Image, Button, Checkbox, Icon } from 'semantic-ui-react';
import { inject } from 'mobx-react/index';

import { alarmsInfo, playSound } from './alarms';
import css from './styles.css';

@inject('alarmsStore')
class Alarm extends React.PureComponent {
    buttonOnClick() {
        const { id, voice, alarmsStore } = this.props;
        alarmsStore.remove(id);
        playSound(voice, 'remove');
    }
    checkboxOnChange() {
        const { id, alarmsStore } = this.props;
        alarmsStore.changeActiveness(id);
    }
    render() {
        const { time, voice, active } = this.props;
        const { img } = alarmsInfo.find(i => i.voice === voice);

        return (
            <div className={css.alarm}>
                <Image src={img} size="tiny" style={{ height: '80px' }} />
                <span>{time.format('HH:mm')}</span>
                <Checkbox toggle defaultChecked={active} onChange={() => this.checkboxOnChange()} />
                <Button color="red" onClick={() => this.buttonOnClick()}>
                    <Icon style={{ height: '28px' }} name="trash" size="big" /> Удалить
                </Button>
            </div>
        );
    }
}

export default Alarm;

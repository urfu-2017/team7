import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { List, Message, Segment } from 'semantic-ui-react';
import AlarmItem from './AlarmItem';
import NewAlarm from './NewAlarm';

const compareTimeObjs = (i, j) => {
    if (i.time.hours !== j.time.hours) {
        return i.time.hours - j.time.hours;
    }
    if (i.time.minutes !== j.time.minutes) {
        return i.time.minutes - j.time.minutes;
    }

    return 0;
};

const AlarmsItems = props => props.alarmsStore.alarms
    .sort(compareTimeObjs)
    .map(i => (
        <AlarmItem
            key={i.id}
            removeAlarm={id => props.alarmsStore.remove(id)}
            changeAlarmActiveness={id => props.alarmsStore.changeActiveness(id)}
            {...i}
        />
    ));

const NoAlarmsMessage = () => (
    <Message
        header="Будильники не найдены"
        content="Вы можете добавить новые, через форму внизу"
    />
);

@inject('alarmsStore')
@observer
class Alarms extends React.Component {
    render() {
        const { alarmsStore } = this.props;

        return (
            <List>
                {
                    alarmsStore.alarms.length
                        ? <AlarmsItems alarmsStore={alarmsStore} key={alarmsStore.alarms.length} />
                        : <NoAlarmsMessage />
                }
                <NewAlarm />
            </List>
        );
    }
}

export default Alarms;

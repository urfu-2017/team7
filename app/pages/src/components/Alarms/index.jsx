import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Message } from 'semantic-ui-react';
import Alarm from './Alarm';
import NewAlarm from './NewAlarm';
import css from './styles.css';

const compareTimes = (i, j) => {
    if (i.isAfter(j)) {
        return 1;
    }
    if (i.isBefore(j)) {
        return -1;
    }

    return 0;
};

const AlarmsList = ({ alarms }) => alarms
    .sort((i, j) => compareTimes(i.time, j.time))
    .map(i => <Alarm key={i.id} {...i} />);

const NoAlarmsMessage = () => (
    <Message
        header="Будильники не найдены"
        content="Вы можете добавить новые, через форму внизу"
        className={css.empty_message}
    />
);

@inject('alarmsStore')
@observer
class Alarms extends React.Component {
    render() {
        const { alarms } = this.props.alarmsStore;

        return (
            <React.Fragment>
                { alarms.length
                    ? <AlarmsList alarms={alarms} key={alarms.length} />
                    : <NoAlarmsMessage />}
                <NewAlarm />
            </React.Fragment>
        );
    }
}

export default Alarms;

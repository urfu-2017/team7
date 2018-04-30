import { observable, action } from 'mobx';
import uuid from 'uuid/v4';
import { CronJob } from 'cron';
import moment from 'moment';

class AlarmsStore {
    @observable alarms = observable.array();
    @observable activeAlarm = null;

    startCronJob(alarm) {
        const job = new CronJob({
            cronTime: `0 ${moment().minutes(alarm.time.minutes).hours(alarm.time.hours).format('mm HH')} * * *`,
            onTick: () => {
                this.setActiveAlarm(alarm);
                if (alarm.snoozed) {
                    job.stop();
                }
            },
            timeZone: moment.tz.guess()
        });
        job.start();
    }

    @action createAlarm(time, voice) {
        const id = uuid();
        const alarm = {
            time, voice, id, active: true
        };
        this.addAlarm(alarm);
        // eslint-disable-next-line
        localStorage.setItem(id, JSON.stringify(alarm));
    }

    @action addAlarm(alarm) {
        this.alarms.push(alarm);
        this.startCronJob(alarm);
    }

    @action setActiveAlarm(alarm) {
        const originalAlarm = this.alarms.find(i => i.id === alarm.id);
        if (originalAlarm.active) {
            this.activeAlarm = alarm;
        }
    }

    @action removeActiveAlarm() {
        this.activeAlarm = null;
    }

    @action remove(id) {
        this.alarms = this.alarms.filter(i => i.id !== id);
        // eslint-disable-next-line
        localStorage.removeItem(id);
    }

    changeActiveness(id) {
        const alarm = this.alarms.find(i => i.id === id);
        alarm.active = !alarm.active;
        // eslint-disable-next-line
        localStorage.setItem(id, JSON.stringify(alarm));
    }

    @action snooze(minutes) {
        const alarm = this.activeAlarm;
        const newAlarm = JSON.parse(JSON.stringify(alarm));
        const alarmTime = moment().minutes(alarm.time.minutes).hours(alarm.time.hours).add(minutes, 'minutes');
        newAlarm.time = { minutes: alarmTime.minutes(), hours: alarmTime.hours() };
        newAlarm.snoozed = true;
        this.startCronJob(newAlarm);
        this.removeActiveAlarm();
    }
}

const alarmsStore = new AlarmsStore();
export default alarmsStore;
export { AlarmsStore };

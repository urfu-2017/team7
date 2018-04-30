import { observable, action } from 'mobx';
import uuid from 'uuid/v4';
import { CronJob } from 'cron';
import moment from 'moment';

class AlarmsStore {
    @observable alarms = observable.array();
    @observable activeAlarm = null;

    startCronJob(alarm) {
        const job = new CronJob({
            cronTime: `0 ${alarm.time.format('mm HH')} * * *`,
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
        this.saveToLocalStore(alarm);
    }

    @action addAlarm(alarm) {
        const newAlarm = { ...alarm, time: moment(alarm.time) };
        this.alarms.push(newAlarm);
        this.startCronJob(newAlarm);
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
        localStorage.removeItem(id);
    }

    changeActiveness(id) {
        const alarm = this.alarms.find(i => i.id === id);
        alarm.active = !alarm.active;
        this.saveToLocalStore(alarm);
    }

    @action snooze(minutes) {
        const alarm = this.activeAlarm;
        this.startCronJob({ ...alarm, time: alarm.time.add(minutes, 'minutes'), snoozed: true });
        this.removeActiveAlarm();
    }

    saveToLocalStore(alarm) {
        localStorage[alarm.id] = JSON.stringify(alarm);
    }
}

const alarmsStore = new AlarmsStore();
export default alarmsStore;
export { AlarmsStore };

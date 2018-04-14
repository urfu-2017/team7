import { observable } from 'mobx';
import { getWeather, onWeather } from '../../../sockets/client';

class WeatherStore {
    constructor() {
        onWeather((weather) => {
            this.weatherByCity.set(weather.city, weather);
        });
    }
    @observable weatherByCity = observable.map();

    fetchWeather(city) {
        getWeather(city);
    }
}

const weatherStore = new WeatherStore();
export default weatherStore;
export { WeatherStore };

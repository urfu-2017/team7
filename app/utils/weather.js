import requestPromise from 'request-promise';
import urlEncode from 'urlencode';
import config from '../config';

function increaseTime(date, days, hours) {
    const newDate = new Date(
        date.split('-')[0],
        date.split('-')[1] - 1,
        parseInt(date.split('-')[2].split(' '), 10) + 1 + days,
        parseInt(date.split(' ')[1].split(':')[0], 10) + hours
    );
    const newMonth = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
    const newDays = newDate.getDate() - 1 < 10 ? `0${newDate.getDate() - 1}` : newDate.getDate() - 1;
    const newHours = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();

    return `${newDate.getFullYear()}-${newMonth}-${newDays} ${newHours}:00:00`;
}

export default async (city) => {
    let requestedCity = city;
    let tomorrow = false;
    if (city.indexOf('завтра_') === 0) {
        requestedCity = city.split('_')[1]; // eslint-disable-line
        tomorrow = true;
    }
    try {
        const options = {
            method: 'GET',
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${urlEncode(requestedCity)}&units=metric&cnt=17&lang=ru&APPID=${config.WEATHER_TOKEN}`,
            json: true
        };
        const response = await requestPromise(options);

        response.list.forEach((item) => {
            item.dt_txt = increaseTime(item.dt_txt, 0, 5); // eslint-disable-line
        });

        response.currentDate = tomorrow ? increaseTime(response.list[0].dt_txt, 1, 0).split(' ')[0] :
            response.list[0].dt_txt.split(' ')[0];

        return response;
    } catch (error) {
        console.warn(error.message);
    }

    return null;
};

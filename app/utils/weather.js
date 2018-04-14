import got from 'got';
import moment from 'moment';
import config from '../config';
import getLogger from './logger';

export default async (city) => {
    const logger = getLogger('weather');
    let requestedCity = city;
    let tomorrow = false;
    if (city.indexOf('завтра_') === 0) {
        requestedCity = city.split('_')[1]; // eslint-disable-line
        tomorrow = true;
    }
    try {
        const data = await got(
            'http://api.openweathermap.org/data/2.5/forecast',
            {
                json: true,
                query: {
                    q: requestedCity,
                    units: 'metric',
                    cnt: '17',
                    lang: 'ru',
                    APPID: config.WEATHER_TOKEN
                }
            }
        );

        const response = data.body;

        response.list.forEach((item) => {
            item.dt_txt = moment(item.dt_txt, "YYYY-MM-DD HH:mm:ss").add({hours: 5}).format("YYYY-MM-DD HH:mm:ss"); // eslint-disable-line
        });

        const currentDate = tomorrow ? moment(response.list[0].dt_txt, 'YYYY-MM-DD HH:mm:ss').add({ days: 1 }).format('YYYY-MM-DD') :
            response.list[0].dt_txt.split(' ')[0];
        response.list = response.list.filter(item => item.dt_txt.split(' ')[0] === currentDate);
        response.list = response.list.length <= 4 ? response.list :
            response.list.filter((item, index) => index % 2 === 0);

        return response;
    } catch (error) {
        logger.debug(error.message);
    }

    return null;
};

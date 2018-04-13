import React from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Image, Table } from 'semantic-ui-react';

@inject('weatherStore')
@observer
class WeatherWidget extends React.Component {
    componentWillMount() {
        const { text, weatherStore } = this.props;
        const matchToday = text.match(new RegExp(/#погода_([A-zА-я-]+)/));
        const matchTomorrow = text.match(new RegExp(/#погода_(завтра_[A-zА-я-]+)/));
        if (matchTomorrow) {
            this.city = matchTomorrow[1]; // eslint-disable-line
            weatherStore.fetchWeather(this.city);
        } else if (matchToday) {
            this.city = matchToday[1]; // eslint-disable-line
            weatherStore.fetchWeather(this.city);
        }
    }

    render() {
        const { weatherStore } = this.props;
        if (!weatherStore.weatherByCity.has(this.city)) {
            return '';
        }

        const data = weatherStore.weatherByCity.get(this.city);
        let forecast = data.list;
        forecast = forecast
            .filter(item => item.dt_txt.split(' ')[0] === data.currentDate)
            .length <= 4 ? forecast :
            forecast.filter((item, index) => index % 2 === 0);

        return (
            <Table basic="very" celled collapsing>
                <Table.Body>
                    {forecast
                        .filter(item => item.dt_txt.split(' ')[0] === data.currentDate)
                        .map(item =>
                            /* eslint-disable react/jsx-wrap-multilines */
                            <Table.Row>
                                <Table.Cell>
                                    <Header as="h4" image>
                                        <Image src={`/static/weather/${item.weather[0].icon.slice(0, 2)}.svg`} rounded size="mini" />
                                        <Header.Content>
                                            {item.dt_txt.split(' ')[1].slice(0, 5)}
                                            <Header.Subheader>
                                                {item.weather[0].description}
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {Math.round(parseFloat(item.main.temp))} &#8451;
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {Math.round(parseFloat(item.wind.speed))} м/c
                                </Table.Cell>
                            </Table.Row>)
                    }
                </Table.Body>
            </Table>
        );
    }
}

export default WeatherWidget;

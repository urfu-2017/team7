import React from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Image, Table } from 'semantic-ui-react';
import { isUndefined } from 'util';
import uuidv4 from 'uuid/v4';

@inject('weatherStore')
@observer
class WeatherWidget extends React.Component {
    componentWillMount() {
        const { text, weatherStore } = this.props;
        const matchToday = text.match(/#погода_([A-zА-я-]+)/);
        const matchTomorrow = text.match(/#погода_(завтра_[A-zА-я-]+)/);
        if (matchTomorrow) {
            [, this.city] = matchTomorrow;
            weatherStore.fetchWeather(this.city);
        } else if (matchToday) {
            [, this.city] = matchToday;
            weatherStore.fetchWeather(this.city);
        }
    }

    render() {
        const { weatherStore } = this.props;
        if (!weatherStore.weatherByCity.has(this.city)) {
            return '';
        }

        const data = weatherStore.weatherByCity.get(this.city);
        if (isUndefined(data.list)) {
            return '';
        }
        const forecast = data.list;

        return (
            <Table style={{ margin: 0 }} basic="very" celled collapsing>
                <Table.Body>
                    {forecast
                        .map(item => (
                            <Table.Row key={uuidv4()}>
                                <Table.Cell>
                                    <Header as="h4" image>
                                        <Image
                                            src={`/static/weather/${item.weather[0].icon.slice(0, 2)}.svg`}
                                            rounded
                                            size="mini"
                                        />
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
                            </Table.Row>))
                    }
                </Table.Body>
            </Table>
        );
    }
}

export default WeatherWidget;

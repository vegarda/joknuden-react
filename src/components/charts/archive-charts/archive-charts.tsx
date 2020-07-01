import * as React from 'react';

import './archive-charts.scss';

import Panel from './../../main/panel/panel';
import BarometerChart from './barometer-chart/barometer-chart';
import { ArchiveData } from 'src/models/archive-data.model';
import RainChart from './rain-chart/rain-chart';
import TemperatureChart from './temperature-chart/temperature-chart';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ArchiveChartsState } from './archive-charts.state';
import Container from './../../container/container';
import WindChart from './wind-chart/wind-chart';


export default class ArchiveCharts extends React.Component<{}, ArchiveChartsState> {


    constructor(props: any) {
        console.log('ArchiveCharts constructor');
        super(props);
        this.state = {
            chartProps: {
                chartOptions: null
            }
        }
        this.getHistoryData();
    }


    public render() {
        console.log('ArchiveCharts render');
        return (
            <Container>
                <Panel>
                    <TemperatureChart chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                <Panel>
                    <WindChart chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                <Panel>
                    <BarometerChart chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                <Panel>
                    <RainChart chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
            </Container>
        );
    }

    private async getHistoryData() {
        console.log('ArchiveCharts getHistoryData');
        try {
            const response = await fetch('http://localhost:8080/api/archive/month/5');
            console.log(response);
            const data: ArchiveData[] = await response.json();
            const chartData: ArchiveChartData[] = data.map((d: ArchiveData) => {
                return {
                    barometer: d.barometer,
                    dateTime: new Date(d.dateTime * 1000),
                    minOutTemp: d.minOutTemp,
                    maxOutTemp: d.maxOutTemp,
                    outHumidity: d.outHumidity,
                    outTemp: d.outTemp,
                    rain: d.rain,
                    rainRate: d.rainRate,
                    windDir: d.windDir,
                    windGust: d.windGust,
                    windGustDir: d.windGustDir,
                    windSpeed: d.windSpeed,
                }
            });
            console.log(chartData);
            this.setState({
                chartProps: {
                    chartOptions: {
                        chartData: chartData,
                        xAxis: false,
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }


}


import * as React from 'react';

import './archive-charts.scss';

import Panel from './../../main/panel/panel';
import BarometerChart from './barometer-chart/barometer-chart';
import { ArchiveData } from 'src/models/archive-data.model';
import RainChart from './rain-chart/rain-chart';
import TemperatureChart from './temperature-chart/temperature-chart';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import Container from './../../container/container';
import WindChart from './wind-chart/wind-chart';
import { ChartProps } from 'src/models/chart-props.model';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface ArchiveChartsState {
    chartProps: ChartProps;
    isFetching: boolean;
    fetchFailed: boolean;
    abortController?: AbortController;
}

export class ArchiveCharts extends React.Component<RouteComponentProps, ArchiveChartsState> {

    constructor(props: RouteComponentProps) {
        console.log('ArchiveCharts constructor');
        super(props);
        // this.props.history.listen((l) => {
        //     console.log(l);
        // })
        this.state = {
            isFetching: false,
            fetchFailed: false,
            chartProps: {
                chartOptions: null
            }
        }
    }

    public shouldComponentUpdate(nextProps: Readonly<RouteComponentProps>, nextState: Readonly<ArchiveChartsState>, nextContext: any): boolean {
        console.log('ArchiveCharts.shouldComponentUpdate()');
        // console.log('props', this.props);
        // console.log('nextProps', nextProps);
        // console.log('state', this.state);
        // console.log('nextState', nextState);
        // console.log('nextContext', nextContext);

        const stateIsNew = nextState !== this.state;
        const propsAreNew = nextProps !== this.props;
        // console.log('propsAreNew', propsAreNew);
        // console.log('stateIsNew', stateIsNew);

        if (propsAreNew) {
            this.getHistoryData(nextProps);
            return false;
        }

        // if (nextState.isFetching || nextState.fetchFailed) {
        //     return true;
        // }

        return true;
    }

    public componentDidUpdate(): void {
        console.log('ArchiveCharts.componentDidUpdate()');
        // this.getHistoryData();
    }

    public componentDidMount(): void {
        console.log('ArchiveCharts.componentDidMount()');
        this.getHistoryData();
    }

    public render() {
        console.log('ArchiveCharts render');
        if (this.state.isFetching) {
            return (
                'loading....'
            )
        }
        if (this.state.fetchFailed) {
            return (
                'error'
            )
        }
        return (
            <Container>
                <Panel>
                    <TemperatureChart label="Temperature" chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                {/* <Panel>
                    <WindChart label="Wind"chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                <Panel>
                    <RainChart label="Rain" chartOptions={this.state.chartProps.chartOptions} />
                </Panel>
                <Panel>
                    <BarometerChart label="Barometer" chartOptions={this.state.chartProps.chartOptions} />
                </Panel> */}
            </Container>
        );
    }

    private async getHistoryData(props: Readonly<RouteComponentProps> = this.props) {
        console.log('ArchiveCharts getHistoryData');

        if (this.state.abortController) {
            console.warn('aborting');
            this.state.abortController.abort();
            console.log('aborted');
        }

        try {
            let port: number = 80;
            let hostname = window.location.hostname;
            if (hostname === 'localhost') {
                port = 8080;
            }
            console.log('location', props.location);
            const apiRouteEndPoint = props.location.pathname;
            const url = `http://${ hostname }:${ port }/api/archive${ apiRouteEndPoint }`;
            const abortController = new AbortController();

            this.setState({
                isFetching: true,
                fetchFailed: false,
                abortController: abortController,
            });

            // setTimeout(() => abortController.abort(), 100);

            const response = await fetch(url, { signal: abortController.signal });
            console.log(response);

            const data: ArchiveData[] = await response.json();
            const chartData: ArchiveChartData[] = data.map<ArchiveChartData>((d: ArchiveData) => {
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
                isFetching: false,
                fetchFailed: false,
                abortController: null,
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
            this.setState({
                isFetching: false,
                fetchFailed: true,
                abortController: null,
                chartProps: null,
            });
        }
    }


}

// export default ArchiveCharts;
export default withRouter(ArchiveCharts);


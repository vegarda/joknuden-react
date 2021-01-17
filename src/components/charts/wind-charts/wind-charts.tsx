import * as React from 'react';

import './wind-charts.scss';

import Panel from './../../main/panel/panel';
import Container from './../../container/container';
import WindChart from './wind-velocity-chart/wind-chart';
import { WindData } from 'src/models/wind-data.model';
import { RouteComponentProps, withRouter } from 'react-router';

export interface WindChartsState {
    windVelocity: number[];
    windFrequency: number[];
    windVector: number[];
    isFetching: boolean;
    fetchFailed: boolean;
    abortController?: AbortController;
}


class WindCharts extends React.Component<RouteComponentProps, WindChartsState> {


    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            isFetching: false,
            fetchFailed: false,
            windVelocity: [],
            windFrequency: [],
            windVector: [],
            abortController: null,
        };
    }

    public shouldComponentUpdate(nextProps: Readonly<RouteComponentProps>, nextState: Readonly<WindChartsState>, nextContext: any): boolean {
        const propsAreNew = nextProps !== this.props;
        if (propsAreNew) {
            this.getHistoryData(nextProps);
            return false;
        }
        return true;

    }


    public componentDidMount(): void {
        this.getHistoryData();
    }

    public render() {
        return (
            <Container>
                <Panel>
                    <WindChart label="Wind direction" unit="%" chartData={ this.state.windFrequency } {...this.state} />
                    <WindChart label="Wind speed" unit="m/s" chartData={ this.state.windVelocity } {...this.state} />
                    <WindChart label="Wind vector" unit="m/s" chartData={ this.state.windVector } {...this.state} />
                </Panel>
            </Container>
        );
    }

    private async getHistoryData(props: Readonly<RouteComponentProps> = this.props) {
        // console.log('WindCharts.getHistoryData()');

        const currentStateAbortController = this.state.abortController;
        if (currentStateAbortController) {
            console.warn('WindCharts aborting');
            currentStateAbortController.abort();
        }
        const newStateAbortController = new AbortController();

        try {

            let hostname = window.location.hostname;

            let port: number = 80;
            if (hostname === 'localhost') {
                port = 8080;
            }

            let apiRouteEndPoint = props.location.pathname;
            if (!apiRouteEndPoint || apiRouteEndPoint === '/') {
                apiRouteEndPoint = '/day/1';
            }
            const url = `http://${ hostname }:${ port }/api/windrose${ apiRouteEndPoint }`;

            this.setState({
                isFetching: true,
                fetchFailed: false,
                abortController: newStateAbortController,
                windVelocity: [],
                windFrequency: [],
                windVector: [],
            });

            const response = await fetch(url, { signal: newStateAbortController.signal });

            const windData: WindData = await response.json();
            this.setState({
                isFetching: false,
                fetchFailed: false,
                abortController: null,
                windVelocity: windData.windVelocity,
                windFrequency: windData.windFrequency,
                windVector: windData.windVector,
            });

        }
        catch (error) {
            console.error(error);
            const isFetching = this.state.abortController !== newStateAbortController;
            const fetchFailed = this.state.abortController !== currentStateAbortController;
            console.log('isFetching', isFetching);
            console.log('fetchFailed', fetchFailed);
            if (!isFetching || fetchFailed) {
                this.setState({
                    isFetching: false,
                    fetchFailed: true,
                    abortController: null,
                    windVelocity: [],
                    windFrequency: [],
                    windVector: [],
                });
            }
        }
    }


}

export default withRouter(WindCharts);


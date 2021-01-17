import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RouteOptionProps } from 'src/app';

import styles from './hilo.scss';


class HiLoValue {
    high: number = null;
    highTime: number = null;
    low: number = null;
    lowTime: number = null;
    average: number = null;
}

enum HiLoType {
    Average = 'AVG',
    Minimum = 'MIN',
    Maximum = 'MAX',
}

interface HiLoData {
    outTemp: HiLoValue;
    barometer: HiLoValue;
    windSpeed: HiLoValue;
    windGust: HiLoValue;
}

export interface HiLoState {
    hiLoData: HiLoData,
    isFetching: boolean;
    fetchFailed: boolean;
    abortController?: AbortController;
}

class HiLo extends React.Component<RouteComponentProps, HiLoState> {

    private locale: string = window.navigator.language;
    private numberFormat: Intl.NumberFormat = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 1 });

    constructor(
        props: RouteComponentProps,
    ) {
        super(props);
        this.state = {
            isFetching: false,
            fetchFailed: false,
            hiLoData: null,
            abortController: null,
        };
    }


    public shouldComponentUpdate(nextProps: Readonly<RouteComponentProps>, nextState: Readonly<any>, nextContext: any): boolean {
        const propsAreNew = nextProps !== this.props;
        if (propsAreNew) {
            this.getHiLoData(nextProps);
            return false;
        }
        return true;
    }

    public componentDidMount(): void {
        this.getHiLoData();
    }


    private async getHiLoData(props: Readonly<RouteComponentProps> = this.props) {
        // console.log('HiLo getHiLoData');

        const currentStateAbortController = this.state.abortController;

        if (currentStateAbortController) {
            console.warn('HiLo aborting');
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
            console.log('apiRouteEndPoint', apiRouteEndPoint);
            const url = `http://${ hostname }:${ port }/api/hilo${ apiRouteEndPoint }`;

            this.setState({
                isFetching: true,
                fetchFailed: false,
                abortController: newStateAbortController,
                hiLoData: null,
            });

            const response = await fetch(url, { signal: newStateAbortController.signal });
            console.log(response);

            const hiLoData: HiLoData = await response.json();

            this.setState({
                isFetching: false,
                fetchFailed: false,
                abortController: null,
                // chartData: chartData,
                hiLoData: hiLoData,
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
                    hiLoData: null,
                });
            }
        }
    }


    public render() {
        if (this.state.isFetching) {
            return (
                <span className={ `${ styles['status'] } ${ styles['loading'] }` }>Loading...</span>
            );
        }
        if (this.state.fetchFailed) {
            return (
                <span className={ `${ styles['status'] } ${ styles['error'] }` }>Error...</span>
            );
        }
        if (!this.state.hiLoData) {
            return (
                <span className={ `${ styles['status'] } ${ styles['no-data'] }` }>No data</span>
            );
        }
        return (
            <div className={ styles['hilo'] }>
                <table>
                    <thead>
                        <tr>
                            <th className={ styles['what'] }>what</th>
                            <th className={ styles['max'] }>max</th>
                            <th className={ styles['maxtime'] }>maxtime</th>
                            <th className={ styles['avg'] }>avg</th>
                            <th className={ styles['min'] }>min</th>
                            <th className={ styles['mintime'] }>mintime</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={ styles['what'] }>outTemp</td>
                            <td className={ styles['max'] }>{ this.numberFormat.format(this.state.hiLoData.outTemp.high) } °C</td>
                            <td className={ styles['maxtime'] }>{ new Date(this.state.hiLoData.outTemp.highTime * 1000).toISOString() }</td>
                            <td className={ styles['avg'] }>{ this.numberFormat.format(this.state.hiLoData.outTemp.average) } °C</td>
                            <td className={ styles['min'] }>{ this.numberFormat.format(this.state.hiLoData.outTemp.low) } °C</td>
                            <td className={ styles['mintime'] }>{ new Date(this.state.hiLoData.outTemp.lowTime * 1000).toISOString() }</td>
                        </tr>
                        <tr>
                            <td className={ styles['what'] }>barometer</td>
                            <td className={ styles['max'] }>{ this.numberFormat.format(this.state.hiLoData.barometer.high) } hPa</td>
                            <td className={ styles['maxtime'] }>{ new Date(this.state.hiLoData.barometer.highTime * 1000).toISOString() }</td>
                            <td className={ styles['avg'] }>{ this.numberFormat.format(this.state.hiLoData.barometer.average) } hPa</td>
                            <td className={ styles['min'] }>{ this.numberFormat.format(this.state.hiLoData.barometer.low) } hPa</td>
                            <td className={ styles['mintime'] }>{ new Date(this.state.hiLoData.barometer.lowTime * 1000).toISOString() }</td>
                        </tr>
                        <tr>
                            <td className={ styles['what'] }>windSpeed</td>
                            <td className={ styles['max'] }>{ this.numberFormat.format(this.state.hiLoData.windSpeed.high) } m/s</td>
                            <td className={ styles['maxtime'] }>{ new Date(this.state.hiLoData.windSpeed.highTime * 1000).toISOString() }</td>
                            <td className={ styles['avg'] }>{ this.numberFormat.format(this.state.hiLoData.windSpeed.average) } m/s</td>
                            <td className={ styles['min'] }></td>
                            <td className={ styles['mintime'] }></td>
                        </tr>
                        <tr>
                            <td className={ styles['what'] }>windGust</td>
                            <td className={ styles['max'] }>{ this.numberFormat.format(this.state.hiLoData.windGust.high) } m/s</td>
                            <td className={ styles['maxtime'] }>{ new Date(this.state.hiLoData.windGust.highTime * 1000).toISOString() }</td>
                            <td className={ styles['avg'] }>{ this.numberFormat.format(this.state.hiLoData.windGust.average) } m/s</td>
                            <td className={ styles['min'] }></td>
                            <td className={ styles['mintime'] }></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

}

export default withRouter(HiLo);

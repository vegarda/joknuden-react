import * as React from 'react';

import styles from './console.scss';

import IConsoleData from './console-data';
import IConsoleState from './console.state';

import Webcam from './webcam/webcam';
import WindCompass from './wind-compass/wind-compass';
import WindInfo from './wind-info/wind-info';

export default class Console extends React.Component<{}, IConsoleState> {

    private SOCKET_RETRY: number = 1000;

    private locale: string = window.navigator.language;
    private numberFormat: Intl.NumberFormat = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 1 });
    private static _socket: WebSocket;
    public static get socket(): WebSocket {
        return Console._socket;
    }

    constructor(props: any) {
        super(props);

        this.state = {
            consoleData: null
        }

        this.newSocket();

    }

    public render() {
        if (this.state.consoleData) {
            return (
                <div className={styles['console-container panel']}>
                    <div className={styles['console-column']}>
                        <div className={styles['data-row']}>
                            <i className={styles['wi wi-barometer']} />
                            <span className={styles['data-value']}>{ this.numberFormat.format(this.state.consoleData.barometer) }</span>
                            <span className={styles['data-unit']}>hPa</span>
                        </div>
                        <div className={styles['data-row']}>
                            <i className={styles['wi wi-humidity']} />
                            <span className={styles['data-value']}>{ this.state.consoleData.outHumidity }</span>
                            <span className={styles['data-unit']}>%</span>
                        </div>
                        <div className={styles['data-row']}>
                            <i className={styles['wi wi-rain']} />
                            <span className={styles['data-value']}>{ this.state.consoleData.dayRain }</span>
                            <span className={styles['data-unit']}>mm</span>
                        </div>
                        <span className={styles['time']}>{ (new Date(this.state.consoleData.dateTime * 1000)).toLocaleTimeString(this.locale) }</span>
                    </div>
                    <div className={styles['console-column']}>
                        <div className={styles['data-row thermometer']}>
                            <i className={styles['wi wi-thermometer']} />
                            <span>{ this.numberFormat.format(this.state.consoleData.outTemp) } °C</span>
                        </div>
                    </div>
                    <div className={styles['console-column']}>
                        <WindCompass consoleData={this.state.consoleData} />
                    </div>
                    <WindInfo consoleData={this.state.consoleData} />
                    <div className={styles['console-column']}>
                        <Webcam />
                    </div>
                </div>
            )
        }
        return null;
    }

    
    private async newSocket() {

        console.log('newSocket');

        Console._socket = new WebSocket('ws://localhost:800');

        Console._socket.addEventListener('open', (test: any) => {
            this.SOCKET_RETRY = 1000;
        });

        Console._socket.addEventListener('error', (error: any) => {
            console.log('socket error', error);
        });

        Console._socket.addEventListener('close', (event: CloseEvent) => {
            setTimeout(() => {
                this.newSocket();
                this.SOCKET_RETRY += 1000;
            }, this.SOCKET_RETRY);
        });

        Console._socket.addEventListener('message', (message: MessageEvent) => {
            // console.log(message);
            if (message && message.data) {
                const consoleData: IConsoleData = JSON.parse(message.data);
                if (consoleData && consoleData.dateTime) {
                    this.setState({consoleData});
                }
            }
        });

    }

}

import * as React from 'react';

import './console.scss';

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
                <div className="console-container panel">
                    <div className="console-column">
                        <div className="data-row">
                            <i className="wi wi-barometer" />
                            <span className="data-value">{ this.numberFormat.format(this.state.consoleData.barometer) }</span>
                            <span className="data-unit">hPa</span>
                        </div>
                        <div className="data-row">
                            <i className="wi wi-humidity" />
                            <span className="data-value">{ this.state.consoleData.outHumidity }</span>
                            <span className="data-unit">%</span>
                        </div>
                        <div className="data-row">
                            <i className="wi wi-rain" />
                            <span className="data-value">{ this.state.consoleData.dayRain }</span>
                            <span className="data-unit">mm</span>
                        </div>
                        <span className="time">{ (new Date(this.state.consoleData.dateTime * 1000)).toLocaleTimeString(this.locale) }</span>
                    </div>
                    <div className="console-column">
                        <div className="data-row thermometer">
                            <i className="wi wi-thermometer" />
                            <span>{ this.numberFormat.format(this.state.consoleData.outTemp) } °C</span>
                        </div>
                    </div>
                    <div className="console-column">
                        <WindCompass consoleData={this.state.consoleData} />
                    </div>
                    <WindInfo consoleData={this.state.consoleData} />
                    <div className="console-column">
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

        Console._socket.addEventListener('error', (event: CloseEvent) => {
            console.log('socket error');
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

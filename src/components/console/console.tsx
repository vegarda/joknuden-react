import * as React from 'react';

import './console.scss';

import IConsoleData from './console-data';
import IConsoleState from './console.state';

import Webcam from './webcam/webcam';
import WindCompass from './wind-compass/wind-compass';
import WindInfo from './wind-info/wind-info';

export default class Console extends React.Component<{}, IConsoleState> {

    private SOCKET_RETRY: number = 1000;

    private intl: Intl.NumberFormat = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 })
    private socket: WebSocket;

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
                <div className="console-container">
                    <div className="console-column">
                        <div className="data">
                            <i className="wi wi-barometer" />
                            <span className="data-value">{ this.intl.format(this.state.consoleData.barometer) }</span>
                            <span className="data-unit">hPa</span>
                        </div>
                        <div className="data">
                            <i className="wi wi-humidity" />
                            <span className="data-value">{ this.state.consoleData.outHumidity }</span>
                            <span className="data-unit">%</span>
                        </div>
                        <div className="data">
                            <i className="wi wi-rain" />
                            <span className="data-value">{ this.state.consoleData.dayRain }</span>
                            <span className="data-unit">mm</span>
                        </div>
                        <span className="time">{ (new Date(this.state.consoleData.dateTime * 1000)).toLocaleTimeString() }</span>
                    </div>
                    <div className="console-column">
                        <div className="thermometer">
                            <i className="wi wi-thermometer" />
                            <span>{ this.intl.format(this.state.consoleData.outTemp) } °C</span>
                        </div>
                    </div>
                    <div className="console-column">
                        <WindCompass consoleData={this.state.consoleData} />
                    </div>
                    <div className="console-column">
                        <WindInfo consoleData={this.state.consoleData} />
                    </div>
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

        this.socket = new WebSocket('ws://localhost:800');

        this.socket.addEventListener('open', (test: any) => {
            this.SOCKET_RETRY = 1000;
        });

        this.socket.addEventListener('error', (event: CloseEvent) => {
            console.log('socket error');
        });

        this.socket.addEventListener('close', (event: CloseEvent) => {
            setTimeout(() => {
                this.newSocket();
                this.SOCKET_RETRY += 1000;
            }, this.SOCKET_RETRY);
        });

        this.socket.addEventListener('message', (message: MessageEvent) => {
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

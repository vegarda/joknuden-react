import * as React from 'react';

import 'console.scss';

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
                        <span>{ this.state.consoleData.outHumidity } %</span>
                        <span>{ this.state.consoleData.dayRain } mm</span>
                        <span>{ (new Date(this.state.consoleData.dateTime * 1000)).toLocaleTimeString() }</span>
                    </div>
                    <div className="console-column">
                        <span>{ this.intl.format(this.state.consoleData.outTemp) } °C</span>
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

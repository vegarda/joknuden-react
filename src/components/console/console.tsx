import * as React from 'react';

interface IConsoleState {
    consoleData: IConsoleData
};

export default class Console extends React.Component<{}, IConsoleState> {

    // private static INTERVAL: number = 2500;
    // private RETRY_WAIT: number = 2500;

    private intl: Intl.NumberFormat = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 })
    private socket: WebSocket;

    constructor(props: any) {
        super(props);

        this.state = {
            consoleData: null
        }

        // this.getData();

        this.socket = new WebSocket('ws://localhost:800');
        console.log(this.socket);
        this.socket.addEventListener('open', (test: any) => {
            console.log(test);
        });
        this.socket.addEventListener('message', (message: MessageEvent) => {
            if (message && message.data) {
                const consoleData: IConsoleData = JSON.parse(message.data);
                if (consoleData && consoleData.dateTime) {
                    this.setState({consoleData});
                }
            }
        });

    }

    public render() {
        if (this.state.consoleData) {
            return (
                <div>
                    <div>
                        <span>{ (new Date(this.state.consoleData.dateTime * 1000)).toLocaleTimeString() }</span>
                    </div>
                    <div>
                        <span>{ this.intl.format(this.state.consoleData.outTemp) } °C</span>
                    </div>
                    <div>
                        <span>{ this.state.consoleData.outHumidity } %</span>
                    </div>
                    <div>
                        <span>{ this.state.consoleData.dayRain } mm</span>
                    </div>
                    <div>
                        <span>{ this.state.consoleData.windDir } °</span>
                    </div>
                    <div>
                        <span>{ this.intl.format(this.state.consoleData.windSpeed) } m/s</span>
                        <span> ({ this.intl.format(this.state.consoleData.windGust) })</span>
                    </div>
                </div>
            )
        }
        return null;
    }

    // private getData() {
    //     fetch('http://localhost:8080/api/realtime').then((response: Response) => {
    //         response.text().then(text => {
    //             console.log(text);
    //             if (text) {
    //                 const data: IConsoleData = JSON.parse(text);
    //                 if (data) {
    //                     this.setState({
    //                         consoleData: data
    //                     });
    //                 }
    //             }
    //             setTimeout(() => this.getData(), Console.INTERVAL);
    //             this.RETRY_WAIT = Console.INTERVAL;
    //         });
    //     }).catch(error => {
    //         console.error(error);
    //         setTimeout(() => this.getData(), this.RETRY_WAIT);
    //         this.RETRY_WAIT += this.RETRY_WAIT;
    //     })
    // }

}

interface IConsoleData {
    barometer?: number;
    dateTime?: number;
    dayRain?: number;
    heatindex?: number;
    outHumidity?: number;
    outTemp?: number;
    windDir?: number | null;
    windGust?: number;
    windGustDir?: number | null;
    windSpeed?: number;
}
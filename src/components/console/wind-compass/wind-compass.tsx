import * as React from 'react';

import IWindCompassProps from './wind-compass.props';

export default class WindCompass extends React.Component<IWindCompassProps, {}> {

    private SOCKET_RETRY: number = 1000;

    private intl: Intl.NumberFormat = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 })
    private socket: WebSocket;

    constructor(props: any) {
        super(props);
        console.log('wind compass');
        console.log(props);
    }

    public render() {
        if (this.props.consoleData) {
            return (
                <div>
                </div>
            )
        }
        return null;
    }

    
}

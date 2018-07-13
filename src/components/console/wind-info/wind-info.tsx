import * as React from 'react';
import IConsoleData from '../console-data';

interface IWindInfoProps {
    consoleData: IConsoleData
}

export default class WindInfo extends React.Component<IWindInfoProps, {}> {

    private intl: Intl.NumberFormat = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 })

    constructor(props: IWindInfoProps) {
        super(props);
    }

    public render() {
        return (
            <div className="wind-info-container">
                <span>{ this.props.consoleData.windDir } °</span>
                <span>{ this.intl.format(this.props.consoleData.windSpeed) } m/s</span>
                <span> ({ this.intl.format(this.props.consoleData.windGust) })</span>
            </div>
        )
    }

}

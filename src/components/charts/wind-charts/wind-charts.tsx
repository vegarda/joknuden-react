import * as React from 'react';

import './wind-charts.scss';

import Panel from './../../main/panel/panel';
import Container from './../../container/container';
import WindVelocityChart from './wind-velocity-chart/wind-velocity-chart';
import { WindData } from 'src/models/wind-data.model';


export default class WindCharts extends React.Component<{}, any> {


    constructor(props: any) {
        console.log('WindCharts constructor');
        super(props);
        // this.state = {
        //     windData: null
        // }
        this.getHistoryData();
    }


    public render() {
        console.log('WindCharts render');
        console.log(this.state);
        if (this.state && this.state.windData) {
            return (
                <Container>
                    <Panel>
                        <WindVelocityChart unit="m/s" data={this.state.windData.windVelocity} />
                        <WindVelocityChart unit="%" data={this.state.windData.windFrequency} />
                        <WindVelocityChart unit="m/s" data={this.state.windData.windVector} />
                    </Panel>
                </Container>
            );
        }
        return (null);
    }

    private async getHistoryData() {
        console.log('WindCharts getHistoryData');
        try {
            const response = await fetch('http://localhost:8080/api/windrose/year/1');
            console.log(response);
            const windData: WindData = await response.json();
            console.log(windData);
            this.setState({ windData });
        }
        catch (error) {
            console.error(error);
        }
    }


}


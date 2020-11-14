import * as React from 'react';

import './wind-charts.scss';

import Panel from './../../main/panel/panel';
import Container from './../../container/container';
import WindChart from './wind-velocity-chart/wind-chart';
import { WindData } from 'src/models/wind-data.model';


export default class WindCharts extends React.Component<{}, any> {


    constructor(props: any) {
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
                        <WindChart unit="m/s" data={this.state.windData.windVelocity} />
                        <WindChart unit="%" data={this.state.windData.windFrequency} />
                        <WindChart unit="m/s" data={this.state.windData.windVector} />
                    </Panel>
                </Container>
            );
        }
        return (null);
    }

    private async getHistoryData() {
        // console.log('WindCharts.getHistoryData()');
        try {
            const response = await fetch('http://localhost:8080/api/windrose/month/1');
            const windData: WindData = await response.json();
            this.setState({ windData });
        }
        catch (error) {
            console.error(error);
        }
    }


}


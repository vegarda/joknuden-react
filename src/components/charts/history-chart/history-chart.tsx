import * as React from 'react';

import './history-chart.scss';

import LineChart from '../line-chart/line-chart';
import { handleResponseErrors } from '../../../helpers';

export default class HistoryChart extends React.Component<{}, {data: any}> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: null
        }
        this.getHistoryData();
    }

    public render() {

        if (this.state.data) {
            return (
                <div className="history-chart-container">
                    <LineChart  data={this.state.data} />
                </div>
            )
        }
        return <div className="history-chart-container" />;
    }
    
    private async getHistoryData() {
        try {
            const response = await fetch('http://localhost:8080/api/archive/month/1');
            console.log(response);
            const data = await response.json();
            data.forEach((d: any) => {
                d.dateTime = new Date(d.dateTime * 1000);
            });
            this.setState({ data })
        }
        catch (error) {
            console.error(error);
        }
    }

}

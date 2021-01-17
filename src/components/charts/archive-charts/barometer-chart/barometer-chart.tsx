import * as React from 'react';

import styles from './barometer-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ChartBaseComponent } from '../../chart-base-component';
import { setUpArchiveChart } from '../archive-charts';

export default class BarometerChart extends ChartBaseComponent<ChartProps<ArchiveChartData>> {

    public readonly chartContainerClassName: string = styles['barometer-chart-container'];
    public readonly chartClassName: string = styles['barometer-chart'];

    protected drawChart(): void {

        const chartData = this.props.chartData;

        if (!chartData || chartData.length === 0) {
            return;
        }

        const { container, xAxisTimeRange, yAxisValueRange } = setUpArchiveChart(this, 'barometer');

        const barometerLine = d3.line<ArchiveChartData>();
        barometerLine.curve(d3.curveCatmullRom);
        barometerLine.x(d => xAxisTimeRange(d.dateTime));
        barometerLine.y(d => yAxisValueRange(d.barometer));

        container.append('path')
            .datum(chartData)
            .attr('d', barometerLine)
            .attr('class', svgStyles['line']);


        // g.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')

    }

}

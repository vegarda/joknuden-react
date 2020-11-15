import * as React from 'react';

import styles from './wind-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ContainerElement } from 'd3';
import { ChartBaseComponent } from '../../chart-base-component';
import { setUpArchiveChart } from '../archive-charts';

export default class WindChart extends ChartBaseComponent {

    public readonly chartContainerClassName: string = styles['wind-chart-container'];
    public readonly chartClassName: string = styles['wind-chart'];

    protected drawChart(): void {
        console.log('WindChart drawChart');

        const chartData = this.props.chartData;

        if (!chartData || chartData.length === 0) {
            console.warn(chartData);
            return;
        }

        const { container, xAxisTimeRange, yAxisValueRange } = setUpArchiveChart(this, 'windSpeed', 'windSpeed', 'windGust');

        // const width = this.width;
        // const height = this.height;

        // set the ranges
        // const xAxis = d3.scaleTime().range([0, width]);
        // xAxis.domain(d3.extent(chartData, d => d.dateTime ));

        // const windAxis = d3.scaleLinear().range([height, 0]);
        // const outTempMax = Math.ceil(d3.max(chartData, d => d.windGust ) + 1)
        // windAxis.domain([0, outTempMax]);

        const windSpeedLine = d3.line<ArchiveChartData>();
        windSpeedLine.curve(d3.curveCatmullRom);
        windSpeedLine.x(d => xAxisTimeRange(d.dateTime));
        windSpeedLine.y(d => yAxisValueRange(d.windSpeed));

        const windGustLine = d3.line<ArchiveChartData>();
        windGustLine.curve(d3.curveCatmullRom);
        windGustLine.x(d => xAxisTimeRange(d.dateTime));
        windGustLine.y(d => yAxisValueRange(d.windGust));

        // const windArea = d3.area<ArchiveChartData>()
        //     .curve(d3.curveCatmullRom)
        //     .x(d => xAxis(d.dateTime))
        //     .y0(d => windAxis(d.minOutTemp))
        //     .y1(d => windAxis(d.maxOutTemp));


        // container.append('linearGradient')
        //     .attr('id', 'outTempAreaGradient')
        //     .attr('gradientUnits', 'userSpaceOnUse')
        //     .attr('x1', 0).attr('y1', outTempAxis(-15))
        //     .attr('x2', 0).attr('y2', outTempAxis(25))
        //     .selectAll('stop')
        //         .data([
        //             {offset: '0%', color: '#2222ffdd'},
        //             {offset: '18.75%', color: '#2222ffaa'},
        //             {offset: '37.5%', color: '#cccccccc'},
        //             {offset: '56.25%', color: '#ff2222aa'},
        //             {offset: '100%', color: '#ff2222dd'},
        //         ])
        //     .enter().append('stop')
        //     .attr('offset', d =>  d.offset)
        //     .attr('stop-color', d => d.color);


        // container.append('path')
        //     .datum(chartData)
        //     .attr('d', windArea)
        //     // .style('fill', 'url(#outTempAreaGradient)')
        //     .attr('class', svgStyles['area']);


        container.append('path')
            .datum(chartData)
            .attr('d', windSpeedLine)
            .attr('class', svgStyles['line']);

        container.append('path')
            .datum(chartData)
            .attr('d', windGustLine)
            .attr('class', svgStyles['line']);




        // g.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(d3.axisBottom(xAxis));

        // archiveChartAxisBottom(chartData, width, height, xAxisTimeRange, container, svgStyles['tick']);



    }

}

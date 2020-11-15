import * as React from 'react';

import styles from './temperature-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ChartBaseComponent } from '../../chart-base-component';
import { setUpArchiveChart } from '../archive-charts';




export default class TemperatureChart extends ChartBaseComponent<ChartProps<ArchiveChartData>> {

    public readonly chartContainerClassName: string = styles['temperature-chart-container'];
    public readonly chartClassName: string = styles['temperature-chart'];

    // public readonly margins = {
    //     top: 12,
    //     right: 48,
    //     bottom: 36,
    //     left: 12,
    // };

    protected drawChart(): void {

        console.log('TemperatureChart drawChart');

        const chartData = this.props.chartData;

        if (!chartData || chartData.length === 0) {
            console.warn(chartData);
            return;
        }

        const { container, xAxisTimeRange, yAxisValueRange } = setUpArchiveChart(this, 'outTemp', 'minOutTemp', 'maxOutTemp');

        // const width = this.width;
        // const height = this.height;
        // console.log('width', width);
        // console.log('height', height);

        const outTempLine = d3.line<ArchiveChartData>();
        outTempLine.curve(d3.curveCatmullRom);
        outTempLine.x(d => xAxisTimeRange(d.dateTime));
        outTempLine.y(d => yAxisValueRange(d.outTemp));

        const outTempArea = d3.area<ArchiveChartData>();
        outTempArea.curve(d3.curveCatmullRom);
        outTempArea.x(d => xAxisTimeRange(d.dateTime));
        outTempArea.y0(d => yAxisValueRange(d.minOutTemp));
        outTempArea.y1(d => yAxisValueRange(d.maxOutTemp));

        const graphGroup = container.append('g');
        graphGroup.attr('class', 'graph');
        const linearGradient = graphGroup.append('linearGradient');
        linearGradient.attr('id', 'outTempAreaGradient');
        linearGradient.attr('gradientUnits', 'userSpaceOnUse');
        linearGradient.attr('x1', 0).attr('y1', yAxisValueRange(-15));
        linearGradient.attr('x2', 0).attr('y2', yAxisValueRange(25));
        linearGradient.selectAll('stop')
                .data([
                    { offset: '0%', color: '#2222ffdd' },
                    { offset: '18.75%', color: '#2222ffaa' },
                    { offset: '37.5%', color: '#cccccccc' },
                    { offset: '56.25%', color: '#ff2222aa' },
                    { offset: '100%', color: '#ff2222dd' },
                ])
            .enter().append('stop')
            .attr('offset', (d: { offset: string, color: string }) =>  d.offset)
            .attr('stop-color', (d: { offset: string, color: string }) => d.color);

        graphGroup.append('path')
            .datum(chartData)
            .attr('d', outTempArea)
            .style('fill', 'url(#outTempAreaGradient)')
            .attr('class', svgStyles['area']);

        graphGroup.append('path')
            .datum(chartData)
            .attr('d', outTempLine)
            .attr('class', svgStyles['line']);



        // const tooltip = g.append('text').attr('text-anchor', 'middle');
            // .attr('class', svgStyles['tooltip'])

        // const bisectDate = d3.bisector<ArchiveChartData, Date>(d => d.dateTime).left;

        // (this: T, datum: Datum, index: number, groups: T[] | ArrayLike<T>) => Result
        // const onMouseMove: d3.ValueFn<any, any, any> = (t: any, datum: any, index: any, groups: any[]) => {

        //     // let coords = d3.mouse(c[0]);
        //     // // let x0 = xAxis.invert(coords[0]);
        //     // // let i = bisectDate(this.props.chartOptions.chartData, x0, 1);
        //     // let i = Math.round(coords[0] * this.props.chartOptions.chartData.length / width);
        //     // let d = this.props.chartOptions.chartData[i];
        //     // tooltip.text(this.numberFormat.format(d.outTemp) + ' °C');
        //     // tooltip.attr('transform', 'translate(' + xAxis(d.dateTime) + ', ' + (outTempAxis(d.maxOutTemp) - 50) + ')');

        //     // return null;
        // }

        // g.append('rect')
        //     .attr('width', width)
        //     .attr('height', height)
        //     .style('fill', 'transparent')
        //     .on('mouseover', () => tooltip.style('opacity', 1) )
        //     .on('mouseout', () => tooltip.style('opacity', 0) )
        //     // .on('mousemove', onMouseMove);

    }

}

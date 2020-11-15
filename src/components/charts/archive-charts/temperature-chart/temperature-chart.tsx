import * as React from 'react';

import styles from './temperature-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ChartBaseComponent } from '../../chart-base-component';

export default class TemperatureChart extends ChartBaseComponent<PropsWithLabel<ChartProps>> {

    protected chartContainerClassName: string = styles['temperature-chart-container'];
    protected chartClassName: string = styles['temperature-chart'];

    protected margins = {
        top: 12,
        right: 48,
        bottom: 36,
        left: 12,
    };


    protected drawChart(): void {
        console.log('TemperatureChart drawChart');

        if (!this.props.chartOptions || !this.props.chartOptions.chartData || this.props.chartOptions.chartData.length === 0) {
            return;
        }

        const chartData = this.props.chartOptions.chartData;
        // console.log('chartData', chartData)

        const margin = this.margins;

        const width = this.width;
        const height = this.height;

        // console.log('width', width);
        // console.log('height', height);

        const svg = this.svg;

        const container = svg.append('g');
        container.attr('class', 'container');
        container.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // set the ranges
        const xAxisTimeRange = d3.scaleTime().range([0, width]);
        xAxisTimeRange.domain(d3.extent(chartData, d => d.dateTime ));

        const outTempAxis = d3.scaleLinear().range([height, 0]);
        const outTempMin = Math.floor(d3.min(chartData, d => d.minOutTemp ) - 1);
        const outTempMax = Math.ceil(d3.max(chartData, d => d.maxOutTemp ) + 1)
        outTempAxis.domain([outTempMin, outTempMax]);

        const outTempLine = d3.line<ArchiveChartData>();
        outTempLine.curve(d3.curveCatmullRom);
        outTempLine.x(d => xAxisTimeRange(d.dateTime));
        outTempLine.y(d => outTempAxis(d.outTemp));

        const outTempArea = d3.area<ArchiveChartData>();
        outTempArea.curve(d3.curveCatmullRom);
        outTempArea.x(d => xAxisTimeRange(d.dateTime));
        outTempArea.y0(d => outTempAxis(d.minOutTemp));
        outTempArea.y1(d => outTempAxis(d.maxOutTemp));


        const graphGroup = container.append('g');
        graphGroup.attr('class', 'graph');
        const linearGradient = graphGroup.append('linearGradient');
        linearGradient.attr('id', 'outTempAreaGradient');
        linearGradient.attr('gradientUnits', 'userSpaceOnUse');
        linearGradient.attr('x1', 0).attr('y1', outTempAxis(-15));
        linearGradient.attr('x2', 0).attr('y2', outTempAxis(25));
        linearGradient.selectAll('stop')
                .data([
                    { offset: '0%', color: '#2222ffdd' },
                    { offset: '18.75%', color: '#2222ffaa' },
                    { offset: '37.5%', color: '#cccccccc' },
                    { offset: '56.25%', color: '#ff2222aa' },
                    { offset: '100%', color: '#ff2222dd' },
                ])
            .enter().append('stop')
            .attr('offset', d =>  d.offset)
            .attr('stop-color', d => d.color);

        graphGroup.append('path')
            .datum(chartData)
            .attr('d', outTempArea)
            .style('fill', 'url(#outTempAreaGradient)')
            .attr('class', svgStyles['area']);

        graphGroup.append('path')
            .datum(chartData)
            .attr('d', outTempLine)
            .attr('class', svgStyles['line']);

        const yAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number): string => {
            return `${domainValue} °C`;
        }

        const _yAxis = d3.axisRight(outTempAxis);
        _yAxis.tickSize(-width);
        _yAxis.tickSizeOuter(0);
        _yAxis.tickFormat(yAxisTickFormat);

        const yAxisGroup = container.append('g');
        yAxisGroup.attr('class', 'y-axis');
        yAxisGroup.attr('transform', 'translate(' + (width) + ', 0)')
        yAxisGroup.call(_yAxis);
        yAxisGroup.attr('font-size', null);
        yAxisGroup.attr('font-family', null);
        yAxisGroup.style('shape-rendering', 'crispedges')

        const yAxisGroupTicks = yAxisGroup.selectAll('.tick');
        yAxisGroupTicks.attr('class', svgStyles['tick']);

        const yAxisGroupTexts = yAxisGroup.selectAll('text');
        yAxisGroupTexts.attr('x', '0.5em');
        // yAxisGroupTexts.attr('dy', '0.5em');

        const firstDate =  chartData[0].dateTime;
        const secondDate =  chartData[1].dateTime;
        const lastDate =  chartData[chartData.length - 1].dateTime;

        const interval = secondDate.getTime() - firstDate.getTime();
        const length = lastDate.getTime() - firstDate.getTime();

        // console.log(interval);
        // console.log(length);

        const localeSuffix = '-u-hc-h23';

        const language = window.navigator.language + localeSuffix;
        const languages = window.navigator.languages.slice().map(l => l + localeSuffix);

        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            // year: 'numeric',
            // month: '2-digit',
            // day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
        };

        // if (interval < 86400000) {
        //     delete dateTimeFormatOptions.day;
        //     delete dateTimeFormatOptions.month;
        //     delete dateTimeFormatOptions.year;
        // }

        if (length > 60 * 60 * 24 * 1000) {
            dateTimeFormatOptions.year = 'numeric';
            dateTimeFormatOptions.month = '2-digit';
            dateTimeFormatOptions.day = '2-digit';
        }
        if (length < 7 * 60 * 60 * 24 * 1000) {
            dateTimeFormatOptions.hour = '2-digit';
            dateTimeFormatOptions.minute = '2-digit';
        }

        const xAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number): string => {
            // console.log(domainValue);
            return Intl.DateTimeFormat(languages, dateTimeFormatOptions).format(domainValue as Date);
        }

        let tickCount = Math.ceil(width / 200);
        tickCount = Math.min(tickCount, chartData.length);
        tickCount = Math.max(tickCount, 2);

        // console.log('ticks', tickCount);

        const axisBottom = d3.axisBottom(xAxisTimeRange);
        axisBottom.tickFormat(xAxisTickFormat);
        axisBottom.ticks(tickCount);
        axisBottom.tickSizeInner(-height);

        const axisBottomGroup = container.append('g');
        axisBottomGroup.attr('class', 'axis-bottom');
        axisBottomGroup.attr('transform', 'translate(0,' + height + ')');
        axisBottomGroup.call(axisBottom);
        axisBottomGroup.attr('font-size', null);
        axisBottomGroup.attr('font-family', null);

        const axisBottomDomain = axisBottomGroup.selectAll('.domain');
        // axisBottomDomain.attr('style', 'color: transparent');

        const axisBottomTicks = axisBottomGroup.selectAll('.tick');
        axisBottomTicks.attr('class', svgStyles['tick']);
        axisBottomTicks.attr('stroke-dasharray', '6, 6');

        const axisBottomLines = axisBottomGroup.selectAll('line');
        // axisBottomLines.attr('stroke', null);

        const axisBottomTexts = axisBottomGroup.selectAll('text');
        axisBottomTexts.attr('y', '1em');
        axisBottomTexts.attr('dy', '0.5em');


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

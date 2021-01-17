import * as React from 'react';

import styles from './rain-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ChartProps } from 'src/models/chart-props.model';
import { ArchiveData } from 'src/models/archive-data.model';
import { ChartBaseComponent } from '../../chart-base-component';
import { setUpArchiveChart } from '../archive-charts';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';

export default class RainChart extends ChartBaseComponent<ChartProps<ArchiveChartData>> {

    public readonly chartContainerClassName: string = styles['rain-chart-container'];
    public readonly chartClassName: string = styles['rain-chart'];

    protected drawChart(): void {


        const chartData = this.props.chartData;

        if (!chartData || chartData.length === 0) {
            return null;
        }

        const margin = this.margins;

        const width = this.width;
        const height = this.height;
        // console.log('width', width);
        // console.log('height', height);

        const svg = this.svg;
        // console.log(svg);

        const container = svg.append('g');
        container.attr('class', 'container');
        container.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // set the ranges
        const xAxisTimeRange = d3.scaleTime().range([0, width]);
        xAxisTimeRange.domain(d3.extent(chartData, d => d.dateTime ));




        // const rainValueRange = d3.scaleLinear().range([height, 0]);
        // // const minRainValue = Math.floor(d3.min(chartData, d => d.rain) - 1);
        // const maxRainValue = Math.ceil(d3.max(chartData, d => d.rain) + 1);
        // // rainValueRange.domain([minRainValue, maxRainValue]);
        // rainValueRange.domain([0, maxRainValue]);

        // const rainAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } ${ this.props.unit }`;

        // const _rainAxis = d3.axisRight(rainValueRange);
        // _rainAxis.tickSize(-width);
        // _rainAxis.tickSizeOuter(0);
        // _rainAxis.tickFormat(rainAxisTickFormat);

        // const rainAxisGroup = container.append('g');
        // rainAxisGroup.attr('class', 'y-axis');
        // rainAxisGroup.attr('transform', 'translate(' + (width) + ', 0)')
        // rainAxisGroup.call(_rainAxis);
        // rainAxisGroup.attr('font-size', null);
        // rainAxisGroup.attr('font-family', null);
        // rainAxisGroup.style('shape-rendering', 'crispedges')

        // const rainAxisGroupTicks = rainAxisGroup.selectAll('.tick');
        // rainAxisGroupTicks.attr('class', svgStyles['tick']);

        // const rainAxisGroupTexts = rainAxisGroup.selectAll('text');
        // rainAxisGroupTexts.attr('x', '0.5em');
        // // yAxisGroupTexts.attr('dy', '0.5em');



        const rainAccumValueRange = d3.scaleLinear().range([height, 0]);
        // const minrainAccumValue = Math.floor(d3.min(chartData, d => d.rainAccum) - 1);
        // const maxRainAccumValue = Math.ceil(d3.max(chartData, d => d.rainAccum) + 1);
        // rainAccumValueRange.domain([minrainAccumValue, maxrainAccumValue]);
        rainAccumValueRange.domain([0, chartData[chartData.length - 1].rainAccum + 1]);

        const rainAccumAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } ${ this.props.unit }`;

        const _rainAccumAxis = d3.axisRight(rainAccumValueRange);
        _rainAccumAxis.tickSize(-width);
        _rainAccumAxis.tickSizeOuter(0);
        _rainAccumAxis.tickFormat(rainAccumAxisTickFormat);

        const rainAccumAxisGroup = container.append('g');
        rainAccumAxisGroup.attr('class', 'y-axis');
        rainAccumAxisGroup.attr('transform', 'translate(' + (width) + ', 0)')
        rainAccumAxisGroup.call(_rainAccumAxis);
        rainAccumAxisGroup.attr('font-size', null);
        rainAccumAxisGroup.attr('font-family', null);
        rainAccumAxisGroup.style('shape-rendering', 'crispedges')

        const rainAccumAxisGroupTicks = rainAccumAxisGroup.selectAll('.tick');
        rainAccumAxisGroupTicks.attr('class', svgStyles['tick']);

        const rainAccumAxisGroupTexts = rainAccumAxisGroup.selectAll('text');
        rainAccumAxisGroupTexts.attr('x', '0.5em');
        // yAxisGroupTexts.attr('dy', '0.5em');




        const rainRateValueRange = d3.scaleLinear().range([height, 0]);
        // const minrainRateValue = Math.floor(d3.min(chartData, d => d.rainRate) - 1);
        const maxRainRateValue = Math.ceil(d3.max(chartData, d => d.rainRate) + 1);
        // rainRateValueRange.domain([minrainRateValue, maxrainRateValue]);
        rainRateValueRange.domain([0, maxRainRateValue]);

        // const rainRateAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } mm/hr`;

        // // const _rainRateAxis = d3.axisRight(rainRateValueRange);
        // const _rainRateAxis = d3.axisLeft(rainRateValueRange);
        // // _rainRateAxis.tickSize(-width);
        // _rainRateAxis.tickSizeOuter(0);
        // _rainRateAxis.tickFormat(rainRateAxisTickFormat);

        // const rainRateAxisGroup = container.append('g');
        // rainRateAxisGroup.attr('class', 'y-axis');
        // // rainRateAxisGroup.attr('transform', 'translate(' + (width) + ', 0)')
        // rainRateAxisGroup.call(_rainRateAxis);
        // rainRateAxisGroup.attr('font-size', null);
        // rainRateAxisGroup.attr('font-family', null);
        // rainRateAxisGroup.style('shape-rendering', 'crispedges')

        // const rainRateAxisGroupTicks = rainRateAxisGroup.selectAll('.tick');
        // rainRateAxisGroupTicks.attr('class', svgStyles['tick']);

        // const rainRateAxisGroupTexts = rainRateAxisGroup.selectAll('text');
        // rainRateAxisGroupTexts.attr('x', '0.5em');
        // // yAxisGroupTexts.attr('dy', '0.5em');






        // const width = this.width;
        // const height = this.height;

        // const svg = this.svg;

        // // set the ranges
        // const xAxis = d3.scaleTime().range([0, width]);
        // xAxis.domain(d3.extent(chartData, d => d.dateTime ));

        // const rainMin = Math.floor(d3.min(chartData, d => d.rain ));
        // const rainMax = Math.ceil(d3.max(chartData, d => d.rain ) + 1)

        // const rainAxis = d3.scaleLinear().range([height, 0]);
        // rainAxis.domain([rainMin, rainMax]);

        // g.append('g')
        // .attr('transform', 'translate(' + (width) + ', 0)')
        // .call(d3.axisRight(rainAxis));

        // const rainLine = d3.line<ArchiveData>()
        //     .curve(d3.curveCatmullRom)
        //     .x(d => xAxisTimeRange(d.dateTime))
        //     .y(d => yAxisValueRange(d.rain));

        // container.append('path')
        //     .datum(chartData)
        //     .attr('d', rainLine)
        //     .attr('class', svgStyles['line']);



        // const rainLine = d3.line<ArchiveChartData>();
        // rainLine.curve(d3.curveStep);
        // rainLine.x(d => xAxisTimeRange(d.dateTime));
        // rainLine.y(d => rainValueRange(d.rain));

        // const rainLinePath = container.append('path').datum(chartData);
        // rainLinePath.attr('d', rainLine);
        // rainLinePath.attr('class', svgStyles['line']);

        const rainAccumLine = d3.line<ArchiveChartData>();
        rainAccumLine.curve(d3.curveStep);
        rainAccumLine.x(d => xAxisTimeRange(d.dateTime));
        rainAccumLine.y(d => rainAccumValueRange(d.rainAccum));

        const rainLinePath = container.append('path').datum(chartData);
        rainLinePath.attr('d', rainAccumLine);
        rainLinePath.attr('class', svgStyles['line']);




        const rainRateLine = d3.line<ArchiveChartData>();
        rainRateLine.curve(d3.curveCatmullRom);
        rainRateLine.x(d => xAxisTimeRange(d.dateTime));
        rainRateLine.y(d => rainRateValueRange(d.rainRate));

        const rainRateLinePath = container.append('path').datum(chartData);
        rainRateLinePath.attr('d', rainRateLine);
        rainRateLinePath.attr('class', svgStyles['line']);













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

        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { };

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






        // container.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(d3.axisBottom(xAxis));




        // const rainMin = Math.floor(d3.min(chartData, d => d.rain ));
        // const rainMax = Math.ceil(d3.max(chartData, d => d.rain ) + 1)

        // const rainXAxis = d3.scaleBand().range([0, width]).domain(chartData.map(d => d.dateTime));

        // const rainAxis = d3.scaleLinear().range([height, 0]).domain([rainMin, rainMax]);

        // const rainBarWidth = width / chartData.length;

        // const raintickColor = 'rgba(0, 0, 0, 0.6)';
        // const rainBarColor = '#dddddddd';


        // container.append('g').selectAll('bar')
        //     .data(chartData.filter(d => d.rain > 0))
        //     .enter()
        //     .append('rect')
        //     .style('fill', rainBarColor)
        //     .style('shape-rendering', 'crispedges')
        //     .attr('x', (d: ArchiveChartData) =>  (chartData.indexOf(d) * (rainBarWidth)))
        //     .attr('width', rainBarWidth)
        //     .attr('y', (d: ArchiveChartData) => Math.round(yAxisValueRange(d.rain)))
        //     .attr('height', (d: ArchiveChartData) => height - Math.round(yAxisValueRange(d.rain)))

        // container.append('g')
        //     .attr('transform', 'translate(' + (width) + ', 0)')
        //     .attr('class', svgStyles['rain-axis'])
        //     .style('shape-rendering', 'crispedges')
        //     .call(
        //         d3.axisRight(yAxisValueRange)
        //         .tickSize(-width)
        //         .ticks(5)
        //         .tickSizeOuter(0)
        //         .tickFormat(d => d + ' mm')
        //     )
        //     .selectAll('.tick')
        //     .attr('class', svgStyles['tick'])
        //     .style('color', raintickColor);



        // container.append('g')
        //     .style('shape-rendering', 'crispedges')
        //     .selectAll('line')
        //     .data(chartData)
        //     .enter()
        //     .append('line')
        //     .style('color', raintickColor)
        //     .attr('transform', d => 'translate(' + ((chartData.indexOf(d)) * (rainBarWidth)) + ', 0)')
        //     .attr('y1', d => height )
        //     .attr('y2', d => 0 )
        //     .attr('stroke', 'currentColor')
        //     .attr('class', svgStyles['tick'])



    }

}

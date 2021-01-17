import * as React from 'react';

import styles from './wind-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ContainerElement } from 'd3';
import { ChartBaseComponent } from '../../chart-base-component';
import { setUpArchiveChart } from '../archive-charts';

interface BeaufortNumber {
    description: string;
    fromWindSpeed: number;
    toWindSpeed: number;
}

type BeaufortScale = BeaufortNumber[];

const beaufortScale: BeaufortScale = [
    {
        // description: 'Calm',
        description: '',
        fromWindSpeed: 0,
        toWindSpeed: 0.5,
    },
    {
        // description: 'Light air',
        description: '',
        fromWindSpeed: 0.5,
        toWindSpeed: 1.6,
    },
    {
        description: 'Light breeze',
        fromWindSpeed: 1.6,
        toWindSpeed: 3.4,
    },
    {
        description: 'Gentle breeze',
        fromWindSpeed: 3.4,
        toWindSpeed: 5.5,
    },
    {
        description: 'Moderate breeze',
        fromWindSpeed: 5.5,
        toWindSpeed: 8,
    },
    {
        description: 'Fresh breeze',
        fromWindSpeed: 8,
        toWindSpeed: 10.8,
    },
    {
        description: 'Strong breeze',
        fromWindSpeed: 10.8,
        toWindSpeed: 13.9,
    },
    {
        description: 'Near gale',
        fromWindSpeed: 13.9,
        toWindSpeed: 17.2,
    },
    {
        description: 'Fresh gale',
        fromWindSpeed: 17.2,
        toWindSpeed: 20.8,
    },
    {
        description: 'Strong gale',
        fromWindSpeed: 20.8,
        toWindSpeed: 24.5,
    },
    {
        description: 'Storm',
        fromWindSpeed: 24.5,
        toWindSpeed: 28.5,
    },
    {
        description: 'Violent storm',
        fromWindSpeed: 28.5,
        toWindSpeed: 32.7,
    },
    {
        description: 'Hurricane force',
        fromWindSpeed: 32.7,
        toWindSpeed: 40,
    },
];


export default class WindChart extends ChartBaseComponent<ChartProps<ArchiveChartData>> {

    public readonly chartContainerClassName: string = styles['wind-chart-container'];
    public readonly chartClassName: string = styles['wind-chart'];

    protected drawChart(): void {

        const chartData = this.props.chartData;

        if (!chartData || chartData.length === 0) {
            return;
        }

        // const { container, xAxisTimeRange, yAxisValueRange } = setUpArchiveChart(this, 'windSpeed', 'windSpeed', 'windGust');

        const base = this;

        const margin = base.margins;

        const width = base.width;
        const height = base.height;
        // console.log('width', width);
        // console.log('height', height);

        const svg = base.svg;
        // console.log(svg);

        const container = svg.append('g');
        container.attr('class', 'container');
        container.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // set the ranges
        const xAxisTimeRange = d3.scaleTime().range([0, width]);
        xAxisTimeRange.domain(d3.extent(chartData, d => d.dateTime ));




        const yAxisValueRange = d3.scaleLinear().range([height, 0]);
        // const minValue = Math.floor(d3.min(chartData, d => 0));
        // const minValue = 0;
        const maxValue = Math.ceil(d3.max(chartData, d => d.windGust))
        // yAxisValueRange.domain([minValue, maxValue]);
        yAxisValueRange.domain([0, maxValue]);

        const yAxisTickFormat = (domainValue: number | Date | { valueOf(): number; }, index: number) => `${ domainValue } ${ base.props.unit }`;

        const _yAxis = d3.axisRight(yAxisValueRange);
        _yAxis.tickSize(-width);
        _yAxis.tickSizeOuter(0);
        _yAxis.tickFormat(yAxisTickFormat);

        const yAxisGroup = container.append('g');
        yAxisGroup.attr('class', 'y-axis');
        yAxisGroup.attr('transform', 'translate(' + (width) + ', 0)');
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












        const paths = container.append('g');
        paths.attr('class', 'paths');


        const windSpeedLine = d3.line<ArchiveChartData>();
        windSpeedLine.curve(d3.curveCatmullRom);
        windSpeedLine.x(d => xAxisTimeRange(d.dateTime));
        windSpeedLine.y(d => yAxisValueRange(d.windSpeed));

        const windSpeedPathGroup = paths.append('g');
        windSpeedPathGroup.attr('class', 'wind-speed');
        const windSpeedPath = windSpeedPathGroup.append('path').datum(chartData);
        windSpeedPath.attr('d', windSpeedLine);
        windSpeedPath.attr('class', svgStyles['line']);


        const windGustLine = d3.line<ArchiveChartData>();
        windGustLine.curve(d3.curveCatmullRom);
        windGustLine.x(d => xAxisTimeRange(d.dateTime));
        windGustLine.y(d => yAxisValueRange(d.windGust));

        const windGustPathGroup = paths.append('g');
        windGustPathGroup.attr('class', 'wind-gust');
        const windGustPath = windGustPathGroup.append('path').datum(chartData);
        windGustPath.attr('d', windGustLine);
        windGustPath.attr('class', svgStyles['line']);



        const windAreaPathGroup = paths.append('g');
        windAreaPathGroup.attr('class', 'wind-area');

        const windArea = d3.area<ArchiveChartData>();
        windArea.curve(d3.curveCatmullRom);
        windArea.x(d => xAxisTimeRange(d.dateTime));
        windArea.y0(d => yAxisValueRange(d.windSpeed));
        windArea.y1(d => yAxisValueRange(d.windGust));

        const windAreaGradient = windAreaPathGroup.append('linearGradient');
        windAreaGradient.attr('id', 'windAreaGradient');
        windAreaGradient.attr('gradientUnits', 'userSpaceOnUse');
        windAreaGradient.attr('x1', 0).attr('y1', yAxisValueRange(0));
        windAreaGradient.attr('x2', 0).attr('y2', yAxisValueRange(beaufortScale[12].fromWindSpeed));

        const gradientStops = [
            { offset: '0%', color: 'grey' },
            { offset: '100%', color: 'red' },
        ];

        gradientStops.forEach(gradientStops => {
            const stop = windAreaGradient.append('stop');
            stop.attr('offset', gradientStops.offset);
            stop.attr('stop-color', gradientStops.color);
        });


        const windAreaPath = windAreaPathGroup.append('path').datum(chartData);
        windAreaPath.attr('d', windArea);
        windAreaPath.style('fill', 'url(#windAreaGradient)');
        windAreaPath.attr('class', svgStyles['area']);





        const beaufortContainer = container.append('g');
        beaufortContainer.attr('class', 'beaufort');
        beaufortContainer.attr('width', width);
        beaufortContainer.attr('height', height);

        // beaufortGroup.attr('transform', `translate(${ width }, 0)`);
        // beaufortGroup.attr('transform', `translate(0, ${ height })`);


        // const beaufortValueRange = d3.scaleLinear().range([height, 0]);
        // const minValue = Math.floor(d3.min(chartData, d => d. as number ) - 1);
        // const maxValue = Math.ceil(d3.max(chartData, d => d[maxProp || prop] as number ) + 1)
        // yAxisValueRange.domain([minValue, maxValue]);

        // const bs = beaufortScale[0];

        beaufortScale.forEach((bs: BeaufortNumber, index: number) => {

            const isOdd = index % 2 !== 0;
            const isEven = index % 2 === 0;

            const beaufortGroup = beaufortContainer.append('g');

            const fromWindSpeed = yAxisValueRange(bs.fromWindSpeed);
            const toWindSpeed = yAxisValueRange(bs.toWindSpeed);
            const beaufortHeight = fromWindSpeed - toWindSpeed;

            beaufortGroup.attr('transform', `translate(0, ${ fromWindSpeed })`);
            beaufortGroup.attr('height', beaufortHeight);

            const rect = beaufortGroup.append('rect');
            rect.attr('x', 0);
            rect.attr('y', -beaufortHeight);
            rect.attr('width', width);
            rect.attr('height', beaufortHeight);

            rect.style('fill-opacity', 0.1);
            if (isOdd) {
                rect.style('fill', 'grey');
            }
            else {
                rect.style('fill', 'blue');
            }

            const text = beaufortGroup.append('text');
            text.attr('x', 6);
            text.attr('y', -beaufortHeight / 2);
            text.attr('alignment-baseline', 'middle');
            text.attr('alignment-baseline', 'central');
            text.text(() => bs.description);

        });




        // g.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(d3.axisBottom(xAxis));

        // archiveChartAxisBottom(chartData, width, height, xAxisTimeRange, container, svgStyles['tick']);



    }

}

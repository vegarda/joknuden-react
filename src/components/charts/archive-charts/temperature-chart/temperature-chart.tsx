import * as React from 'react';

import styles from './temperature-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ContainerElement } from 'd3';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

export default class TemperatureChart extends React.Component<ChartProps, {}> {

    private ref: React.RefObject<HTMLDivElement>;
    private svgRef: React.RefObject<SVGSVGElement>;

    private numberFormat: Intl.NumberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 1 });

    private onUnmount$: Subject<void> = new Subject();

    constructor(props: ChartProps) {
        super(props);
        console.log('TemperatureChart constructor');
        console.log(props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();
    }

    public render() {
        console.log('TemperatureChart render');
        return (
            <div className={styles['temperature-chart-container']} ref={this.ref}>
                <svg ref={this.svgRef} className={styles['temperature-chart']}/>
            </div>
        );
    }

    public componentDidMount(): void {
        console.log('TemperatureChart componentDidMount');
        this.drawChart();
        const onResize = () => {
            this.drawChart();
        };
        window.addEventListener('resize', onResize);
        this.onUnmount$.pipe(first()).subscribe(() => window.removeEventListener('resize', onResize));
    }

    public componentDidUpdate(): void {
        console.log('TemperatureChart componentDidUpdate');
        this.drawChart();
    }

    public componentWillUnmount(): void {
        this.onUnmount$.next();
    }


    private drawChart(): void {
        console.log('TemperatureChart drawChart');

        if (!this.props.chartOptions || !this.props.chartOptions.chartData || this.props.chartOptions.chartData.length === 0) {
            return;
        }

        const chartData = this.props.chartOptions.chartData;
        console.log('chartData', chartData)

        const margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 10
        };

        const width = this.ref.current.offsetWidth - margin.left - margin.right;
        const height = this.ref.current.offsetHeight - margin.top - margin.bottom;

        const svg = d3.select(this.svgRef.current);
        svg.selectAll('*').remove();

        svg
        // .attr('width', width + margin.left + margin.right)
        // .attr('height', height + margin.top + margin.bottom)
        // .attr('preserveAspectRatio', 'none')
        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom));

        const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // set the ranges
        const xAxis = d3.scaleTime().range([0, width]);
        xAxis.domain(d3.extent(chartData, d => d.dateTime ));

        const outTempAxis = d3.scaleLinear().range([height, 0]);
        const outTempMin = Math.floor(d3.min(chartData, d => d.minOutTemp ) - 1);
        const outTempMax = Math.ceil(d3.max(chartData, d => d.maxOutTemp ) + 1)
        outTempAxis.domain([outTempMin, outTempMax]);

        const outTempLine = d3.line<ArchiveChartData>()
            .curve(d3.curveCatmullRom)
            .x(d => xAxis(d.dateTime))
            .y(d => outTempAxis(d.outTemp));

        const outTempArea = d3.area<ArchiveChartData>()
            .curve(d3.curveCatmullRom)
            .x(d => xAxis(d.dateTime))
            .y0(d => outTempAxis(d.minOutTemp))
            .y1(d => outTempAxis(d.maxOutTemp));

        g.append('linearGradient')
            .attr('id', 'outTempAreaGradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', outTempAxis(-15))
            .attr('x2', 0).attr('y2', outTempAxis(25))
            .selectAll('stop')
                .data([
                    {offset: '0%', color: '#2222ffdd'},
                    {offset: '18.75%', color: '#2222ffaa'},
                    {offset: '37.5%', color: '#cccccccc'},
                    {offset: '56.25%', color: '#ff2222aa'},
                    {offset: '100%', color: '#ff2222dd'},
                ])
            .enter().append('stop')
            .attr('offset', d =>  d.offset)
            .attr('stop-color', d => d.color);

        g.append('path')
            .datum(chartData)
            .attr('d', outTempArea)
            .style('fill', 'url(#outTempAreaGradient)')
            .attr('class', svgStyles['area']);

        g.append('path')
            .datum(chartData)
            .attr('d', outTempLine)
            .attr('class', svgStyles['line']);

        // const tickColor = 'rgba(0, 0, 0, 0.2)';
        g.append('g')
            .attr('transform', 'translate(' + (width) + ', 0)')
            .call(
                d3.axisRight(outTempAxis)
                .tickSize(-width)
                .tickSizeOuter(0)
            )
            .style('shape-rendering', 'crispedges')
            .selectAll('.tick')
            .attr('class', svgStyles['tick'])
            // .selectAll('.tick')
            // .select('line')
            // .style('color', tickColor)

        const firstDate =  chartData[0].dateTime;
        const secondDate =  chartData[1].dateTime;
        const lastDate =  chartData[chartData.length - 1].dateTime;

        const interval = secondDate.getTime() - firstDate.getTime();
        const length = lastDate.getTime() - firstDate.getTime();

        console.log(interval);
        console.log(length);

        const language = window.navigator.language;
        const languages = window.navigator.languages.slice();

        const dateToDay = (domainValue: number | Date | { valueOf(): number; }, index: number): string => {
            console.log(domainValue)
            return Intl.DateTimeFormat(languages, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(domainValue as Date);
        }

        const axisBottom = d3.axisBottom(xAxis)
            // .tickFormat(dateToDay)
            .tickFormat(() => 'dateToDay')
            .ticks(5)
        console.log(axisBottom);

        const test = g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisBottom)
            .selectAll('text')
            // .attr('preserveAspectRatio', 'xMidYMid')

        console.log(test)

        const tooltip = g.append('text').attr('text-anchor', 'middle');
            // .attr("class", svgStyles["tooltip"])

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

        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'transparent')
            .on('mouseover', () => tooltip.style('opacity', 1) )
            .on('mouseout', () => tooltip.style('opacity', 0) )
            // .on('mousemove', onMouseMove);

    }

}

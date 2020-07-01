import * as React from 'react';

import styles from './wind-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';
import { ContainerElement } from 'd3';

export default class WindChart extends React.Component<ChartProps, {}> {

    private ref: React.RefObject<HTMLDivElement>;
    private svgRef: React.RefObject<SVGSVGElement>;

    private numberFormat: Intl.NumberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 1 });

    constructor(props: ChartProps) {
        super(props);
        console.log('WindChart constructor');
        console.log(props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();
    }

    public render() {
        console.log('WindChart render');
        return (
            <div className={styles['wind-chart-container']} ref={this.ref}>
                <svg ref={this.svgRef} className={styles['wind-chart']}/>
            </div>
        );
    }

    public componentDidMount(): void {
        console.log('WindChart componentDidMount');
        this.drawChart();
    }

    public componentDidUpdate(): void {
        console.log('WindChart componentDidUpdate');
        this.drawChart();
    }

    private drawChart(): void {
        console.log('WindChart drawChart');
        if (this.props.chartOptions && this.props.chartOptions.chartData && this.props.chartOptions.chartData.length > 0) {

            const margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 10
            };

            const width = this.ref.current.offsetWidth - margin.left - margin.right;
            const height = this.ref.current.offsetHeight - margin.top - margin.bottom;

            const svg = d3.select(this.svgRef.current);

            svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom));

            const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            // set the ranges
            const xAxis = d3.scaleTime().range([0, width]);
            xAxis.domain(d3.extent(this.props.chartOptions.chartData, d => d.dateTime ));

            const windAxis = d3.scaleLinear().range([height, 0]);
            const outTempMax = Math.ceil(d3.max(this.props.chartOptions.chartData, d => d.windGust ) + 1)
            windAxis.domain([0, outTempMax]);

            const windSpeedLine = d3.line<ArchiveChartData>()
                .curve(d3.curveCatmullRom)
                .x(d => xAxis(d.dateTime))
                .y(d => windAxis(d.windSpeed));

            const windGustLine = d3.line<ArchiveChartData>()
                .curve(d3.curveCatmullRom)
                .x(d => xAxis(d.dateTime))
                .y(d => windAxis(d.windSpeed));

            // const windArea = d3.area<ArchiveChartData>()
            //     .curve(d3.curveCatmullRom)
            //     .x(d => xAxis(d.dateTime))
            //     .y0(d => windAxis(d.minOutTemp))
            //     .y1(d => windAxis(d.maxOutTemp));


            // g.append('linearGradient')
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


            // g.append('path')
            //     .datum(this.props.chartOptions.chartData)
            //     .attr('d', windArea)
            //     // .style('fill', 'url(#outTempAreaGradient)')
            //     .attr('class', svgStyles['area']);


            g.append('path')
                .datum(this.props.chartOptions.chartData)
                .attr('d', windSpeedLine)
                .attr('class', svgStyles['line']);

            g.append('path')
                .datum(this.props.chartOptions.chartData)
                .attr('d', windGustLine)
                .attr('class', svgStyles['line']);



            g.append('g')
                .attr('transform', 'translate(' + (width) + ', 0)')
                .call(
                    d3.axisRight(windAxis)
                    .tickSize(-width)
                    .tickSizeOuter(0)
                )
                .style('shape-rendering', 'crispedges')
                .selectAll('.tick')
                .attr('class', svgStyles['tick'])





            g.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(xAxis));






        }
    }

}

import * as React from 'react';

import styles from './rain-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ChartProps } from 'src/models/chart-props.model';
import { ArchiveData } from 'src/models/archive-data.model';

export default class RainChart extends React.Component<ChartProps, {}> {

    private ref: any;
    private svgRef: React.RefObject<SVGSVGElement>;

    constructor(props: ChartProps) {
        super(props);
        console.log('RainChart constructor');
        console.log(props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();
    }

    public render() {
        console.log('RainChart render');
        return (
            <div className={styles['rain-chart-container']} ref={this.ref}>
                <svg ref={this.svgRef} className={styles['rain-chart']}/>
            </div>
        );
    }

    public componentDidMount(): void {
        console.log('RainChart componentDidMount');
        this.drawChart();
    }

    public componentDidUpdate(): void {
        console.log('RainChart componentDidUpdate');
        this.drawChart();
    }

    private drawChart(): void {
        console.log('RainChart drawChart');
        if (this.props.chartOptions && this.props.chartOptions.chartData && this.props.chartOptions.chartData.length > 0) {

            const margin = {
                top: 10,
                right: 20,
                bottom: 20,
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

            const rainMin = Math.floor(d3.min(this.props.chartOptions.chartData, d => d.rain ));
            const rainMax = Math.ceil(d3.max(this.props.chartOptions.chartData, d => d.rain ) + 1)

            const rainAxis = d3.scaleLinear().range([height, 0]);
            rainAxis.domain([rainMin, rainMax]);
            g.append('g')
            .attr('transform', 'translate(' + (width) + ', 0)')
            .call(d3.axisRight(rainAxis));

            const rainLine = d3.line<ArchiveData>()
                .curve(d3.curveCatmullRom)
                .x(d => xAxis(d.dateTime))
                .y(d => rainAxis(d.rain));

            g.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(xAxis));










                // const rainMin = Math.floor(d3.min(this.props.chartOptions.chartData, d => d.rain ));
                // const rainMax = Math.ceil(d3.max(this.props.chartOptions.chartData, d => d.rain ) + 1)

                // const rainXAxis = d3.scaleBand().range([0, width]).domain(this.props.chartOptions.chartData.map(d => d.dateTime));

                // const rainAxis = d3.scaleLinear().range([height, 0]).domain([rainMin, rainMax]);

                const rainBarWidth = width / this.props.chartOptions.chartData.length;

                const raintickColor = 'rgba(0, 0, 0, 0.6)'; 
                const rainBarColor = '#dddddddd';


                g.append('g').selectAll('bar')
                    .data(this.props.chartOptions.chartData.filter(d => d.rain > 0))
                    .enter()
                    .append('rect')
                    .style('fill', rainBarColor)
                    .style('shape-rendering', 'crispedges')
                    .attr('x', d =>  (this.props.chartOptions.chartData.indexOf(d) * (rainBarWidth)))
                    .attr('width', rainBarWidth)
                    .attr('y', d => Math.round(rainAxis(d.rain)))
                    .attr('height', d => height - Math.round(rainAxis(d.rain)))

                g.append('g')
                    .attr('transform', 'translate(' + (width) + ', 0)')
                    .attr('class', svgStyles['rain-axis'])
                    .style('shape-rendering', 'crispedges')
                    .call(
                        d3.axisRight(rainAxis)
                        .tickSize(-width)
                        .ticks(5)
                        .tickSizeOuter(0)
                        .tickFormat(d => d + ' mm')
                    )
                    .selectAll('.tick')
                    .attr('class', svgStyles['tick'])
                    .style('color', raintickColor);



                // g.append('g')
                //     .style('shape-rendering', 'crispedges')
                //     .selectAll('line')
                //     .data(this.props.chartOptions.chartData)
                //     .enter()
                //     .append('line')
                //     .style('color', raintickColor)
                //     .attr('transform', d => 'translate(' + ((this.props.chartOptions.chartData.indexOf(d)) * (rainBarWidth)) + ', 0)')
                //     .attr('y1', d => height )
                //     .attr('y2', d => 0 )
                //     .attr('stroke', 'currentColor')
                //     .attr('class', svgStyles['tick'])




        }
    }

}

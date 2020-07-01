import * as React from 'react';

import './barometer-chart.scss';

import * as d3 from 'd3';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import { ChartProps } from 'src/models/chart-props.model';

export default class BarometerChart extends React.Component<ChartProps, {}> {

    private ref: any;
    private svgRef: React.RefObject<SVGSVGElement>;

    constructor(props: ChartProps) {
        super(props);
        console.log('BarometerChart constructor');
        console.log(props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();
    }

    public render() {
        console.log('BarometerChart render');
        return (
            <div className="barometer-chart-container" ref={this.ref}>
                <svg ref={this.svgRef} className='barometer-chart'/>
            </div>
        );
    }

    public componentDidMount(): void {
        console.log('BarometerChart componentDidMount');
        this.drawChart();
    }

    public componentDidUpdate(): void {
        console.log('BarometerChart componentDidUpdate');
        this.drawChart();
    }

    private drawChart(): void {
        console.log('BarometerChart drawChart');
        if (this.props.chartOptions && this.props.chartOptions.chartData && this.props.chartOptions.chartData.length > 0) {

            const margin = {
                top: 10,
                right: 40,
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
            const xAxis = d3.scaleTime<number, number>().range([0, width]);
            xAxis.domain(d3.extent<ArchiveChartData, Date>(this.props.chartOptions.chartData, d => d.dateTime ));

            const barometerMin = Math.floor(d3.min(this.props.chartOptions.chartData, d => d.barometer ) - 1);
            const barometerMax = Math.ceil(d3.max(this.props.chartOptions.chartData, d => d.barometer ) + 1)

            const barometerAxis = d3.scaleLinear().range([height, 0]);
            barometerAxis.domain([barometerMin, barometerMax]);
            g.append('g')
            .attr('transform', 'translate(' + (width) + ', 0)')
            .call(
                d3.axisRight(barometerAxis)
                .ticks(3)
            );

            const barometerLine = d3.line<ArchiveChartData>()
                .curve(d3.curveCatmullRom)
                .x(d => xAxis(d.dateTime))
                .y(d => barometerAxis(d.barometer));

            g.append('path')
                .datum(this.props.chartOptions.chartData)
                .attr('d', barometerLine as any)
                .attr('class', 'line');


            g.append('g')
                .attr('transform', 'translate(0,' + height + ')')

        }
    }

}

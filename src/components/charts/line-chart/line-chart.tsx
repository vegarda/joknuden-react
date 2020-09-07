import * as React from 'react';

import './line-chart.scss';

import * as d3 from 'd3';

export default class LineChart extends React.Component<{data: any}, {}> {

    private containerRef: React.RefObject<HTMLDivElement>;
    private svgRef: React.RefObject<SVGSVGElement>;
    private lastResize: number = 0;

    constructor(props: any) {
        super(props);
        this.containerRef = React.createRef();
        this.svgRef = React.createRef();
        console.log('line chart');
        console.log(props);
        console.log(this.svgRef);
    }

    
    public render() {
        return (
            <div ref={this.containerRef} className="line-chart-container">
                <svg ref={this.svgRef} className='line-chart'/>
            </div>
        );
    }

    public resizeHandler = () => {
        this.lastResize = Date.now();
        setTimeout(() => {
            if (Date.now() - this.lastResize >= 100) {
                this.forceUpdate();
            }
        }, 100);
    };

    public componentDidMount() {
        console.log('line chart componentDidMount');
        this.draw();
        window.addEventListener('resize', this.resizeHandler)
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    public forceUpdate() {
        this.draw();
    }

    private draw() {

        if (this.props.data) {

            const data: any[] = this.props.data.slice();

            requestAnimationFrame(() => {

                const containerRect = this.containerRef.current.getBoundingClientRect();

                console.log(containerRect);

                const margin = {top: 20, right: 60, bottom: 30, left: 50};

                const height = containerRect.height - margin.top - margin.bottom;
                const width = (containerRect.width) - margin.left - margin.right;

                const tickColor = 'rgba(0, 0, 0, 0.2)';

                this.svgRef.current.innerHTML = '';

                const svg = d3.select(this.svgRef.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                
                // set the ranges
                const xAxis = d3.scaleTime().range([0, width]);
                xAxis.domain(d3.extent(data, (d) => d.dateTime ));




                const outTempAxis = d3.scaleLinear().range([height / 1.25, height / 4]);
                const outTempLine = d3.line()
                .curve(d3.curveBasis)
                .x((d: any) => xAxis(d.dateTime))
                .y((d: any) => outTempAxis(d.outTemp))

                const outTempArea = d3.area()
                .curve(d3.curveBasis)
                .x((d: any) => xAxis(d.dateTime))
                .y0((d: any) => outTempAxis(d.minoutTemp))
                .y1((d: any) => outTempAxis(d.maxoutTemp));

                const outTempMin = Math.floor(d3.min(data, (d) => d.minoutTemp ) - 1);
                const outTempMax = Math.ceil(d3.max(data, (d) => d.maxoutTemp ) + 1)
                outTempAxis.domain([outTempMin, outTempMax]);

                svg.append('path')
                    .datum(data)
                    .attr('d', outTempArea)
                    .attr('class', 'out-temp-area');

                svg.append('path')
                    .datum(data)
                    .attr('d', outTempLine)
                    .attr('class', 'out-temp-line');

                svg.append('g')
                    .call(
                        d3.axisLeft(outTempAxis)
                        .tickSize(-width)
                        .tickSizeOuter(0)
                    )
                .style('shape-rendering', 'crispedges')
                .selectAll('.tick')
                .style('color', tickColor)

                svg.append('linearGradient')
                    .attr('id', 'outTempAreaGradient')
                    .attr('gradientUnits', 'userSpaceOnUse')
                    .attr('x1', 0).attr('y1', outTempAxis(-15))
                    .attr('x2', 0).attr('y2', outTempAxis(25))
                    .selectAll('stop')
                        .data([
                            {offset: '0%', color: 'rgba(0, 0, 255, 0.7)'},
                            {offset: '18.75%', color: 'rgba(0, 0, 255, 0.6)'},
                            {offset: '37.5%', color: 'rgba(200, 200, 200, 0.8)'},
                            {offset: '56.25%', color: 'rgba(255, 0, 0, 0.6)'},
                            {offset: '100%', color: 'rgba(255, 0, 0, 0.7)'},
                        ])
                    .enter().append('stop')
                    .attr('offset', d =>  d.offset)
                    .attr('stop-color', d => d.color);




                const barometerMin = Math.floor(d3.min(data, (d) => d.barometer ) - 1);
                const barometerMax = Math.ceil(d3.max(data, (d) => d.barometer ) + 1)

                const barometerAxis = d3.scaleLinear().range([height / 4 - 10, 0]);
                barometerAxis.domain([barometerMin, barometerMax]);
                svg.append('g')
                .attr('transform', 'translate(' + (width) + ', 0)')
                .style('shape-rendering', 'crispedges')
                .call(
                    d3.axisRight(barometerAxis)
                    .tickSize(-width)
                    .tickSizeOuter(0)
                    .ticks(5)
                    .tickFormat(d => d + ' hPa')
                )
                .selectAll('.tick')
                .style('color', tickColor)

                const barometerLine = d3.line()
                    .curve(d3.curveBasis)
                    .x((d: any) => xAxis(d.dateTime))
                    .y((d: any) => barometerAxis(d.barometer));

                svg.append('path')
                    .datum(data)
                    .attr('d', barometerLine)
                    .attr('class', 'line');








                const rainMin = Math.floor(d3.min(data, (d) => d.rain ));
                const rainMax = Math.ceil(d3.max(data, (d) => d.rain ) + 1)

                const rainXAxis = d3.scaleBand().range([0, width]).domain(data.map(d => d.dateTime));

                const rainAxis = d3.scaleLinear().range([height, (height / 1.25) + 10]).domain([rainMin, rainMax]);

                const rainBarWidth = width / data.length;

                const raintickColor = 'rgba(0, 0, 0, 0.6)';
                const rainBarColor = 'rgba(5, 10, 40, 0.9)';


                svg.append('g').selectAll('bar')
                    .data(data.filter(d => d.rain > 0))
                    .enter()
                    .append('rect')
                    .style('fill', rainBarColor)
                    .style('shape-rendering', 'crispedges')
                    .attr('x', d =>  (data.indexOf(d) * (rainBarWidth)))
                    .attr('width', rainBarWidth)
                    .attr('y', d => Math.round(rainAxis(d.rain)))
                    .attr('height', d => height - Math.round(rainAxis(d.rain)))

                svg.append('g')
                    .attr('transform', 'translate(' + (width) + ', 0)')
                    .attr('class', 'rain-axis')
                    .style('shape-rendering', 'crispedges')
                    .call(
                        d3.axisRight(rainAxis)
                        .tickSize(-width)
                        .ticks(5)
                        .tickSizeOuter(0)
                        .tickFormat(d => d + ' mm')
                    )
                    .selectAll('.tick')
                    .style('color', raintickColor);



                svg.append('g')
                    .style('shape-rendering', 'crispedges')
                    .selectAll('line')
                    .data(data)
                    .enter()
                    .append('line')
                    .style('color', raintickColor)
                    .attr('transform', d => 'translate(' + ((data.indexOf(d)) * (rainBarWidth)) + ', 0)')
                    .attr('y1', d => height )
                    .attr('y2', d => height/1.25 + 10 )
                    .attr('stroke', 'currentColor')
                    .attr('class', 'tick')


            });

        }
    }

}

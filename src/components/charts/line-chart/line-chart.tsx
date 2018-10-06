import * as React from 'react';

import './line-chart.scss';

import * as d3 from 'd3';

export default class LineChart extends React.Component<{data: any}, {}> {

    constructor(props: any) {
        super(props);
        console.log('line chart');
        console.log(props);
    }

    public render() {
        return (
          <svg className='line-chart'/>
        );
    }

    public componentDidMount() {
        console.log('line chart componentDidMount');
        if (this.props.data) {

            const data: any[] = this.props.data.slice();

            data.forEach((d: any) => {
                d.dateTime = new Date(d.dateTime * 1000);
            });

            const margin = {top: 20, right: 60, bottom: 30, left: 50};
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;

            const svg = d3.select('.line-chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            // set the ranges
            const xAxis = d3.scaleTime().range([0, width]);
            xAxis.domain(d3.extent(data, (d) => d.dateTime ));


            const outTempAxis = d3.scaleLinear().range([height, 0]);
            const outTempLine = d3.line()
            .curve(d3.curveBasis)
            .x((d: any) => xAxis(d.dateTime))
            .y((d: any) => outTempAxis(d.outTemp));

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
                .attr('class', 'area-line');

            svg.append('path')
                .datum(data)
                .attr('d', outTempLine)
                .attr('class', 'line');

            svg.append('g')
                .call(d3.axisLeft(outTempAxis));





            const barometerMin = Math.floor(d3.min(data, (d) => d.barometer ) - 1);
            const barometerMax = Math.ceil(d3.max(data, (d) => d.barometer ) + 1)

            const barometerAxis = d3.scaleLinear().range([height / 4, 0]);
            barometerAxis.domain([barometerMin, barometerMax]);
            svg.append('g')
            .attr('transform', 'translate(' + (width) + ', 0)')
            .call(d3.axisRight(barometerAxis));

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

            const rainAxis = d3.scaleLinear().range([height, height / 1.25]);
            rainAxis.domain([rainMin, rainMax]);
            svg.append('g')
            .attr('transform', 'translate(' + (width) + ', 0)')
            .call(d3.axisRight(rainAxis));

            const rainLine = d3.line()
                .curve(d3.curveBasis)
                .x((d: any) => xAxis(d.dateTime))
                .y((d: any) => rainAxis(d.rain));

            svg.append('path')
                .datum(data)
                .attr('d', rainLine)
                .attr('class', 'line');





            svg.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(xAxis));

        }
    }

}

import * as React from 'react';

import styles from './wind-velocity-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';

export default class WindVelocityChart extends React.Component<any, any> {

    private numberFormat: Intl.NumberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 1 });

    private ref: React.RefObject<HTMLDivElement>;
    private svgRef: React.RefObject<SVGSVGElement>;

    constructor(props: any) {
        super(props);
        console.log('WindVelocityChart constructor');
        console.log(props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();
    }

    public render() {
        console.log('WindVelocityChart render');
        return (
            <div className={styles['wind-velocity-chart-container']} ref={this.ref}>
            <svg ref={this.svgRef} className={styles['wind-velocity-chart']}/>
            </div>
        );
    }

    public componentDidMount(): void {
        console.log('WindVelocityChart componentDidMount');
        this.drawChart();
    }

    public componentDidUpdate(): void {
        console.log('WindVelocityChart componentDidUpdate');
        this.drawChart();
    }

    private drawChart(): void {
        console.log('WindVelocityChart drawChart');
        if (this.props.data && this.props.data.length > 0) {

            const margin = 30;
            const margins = {
                top: margin,
                right: margin,
                bottom: margin,
                left: margin
            };

            const width = this.ref.current.offsetWidth - margins.left - margins.right;
            const height = this.ref.current.offsetHeight - margins.top - margins.bottom;

            const innerRadius = 0;
            const outerRadius = (Math.min(width, height) / 2);

            const svg = d3.select(this.svgRef.current);

            svg
            .attr('width', width + margins.left + margins.right)
            .attr('height', height + margins.top + margins.bottom)
            .attr('viewBox', '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom));

            const g = svg.append('g')
            .attr('class', svgStyles['test1'])
            .attr('transform', 'translate(' + ((width / 2) + margins.left) + ',' + ((height / 2) + margins.top) + ')');


            var y = d3.scaleLinear().range([innerRadius, outerRadius]);

            y.domain([0, d3.max(this.props.data as number[])]);

            g.append('g')
                .attr('transform', 'rotate('+ - (360 / 32) + ')')
                .selectAll('path')
                .data(this.props.data)
                .enter()
                .append('path')
                .attr('class', svgStyles['arc'])
                .attr('d',

                    // d3.arc<number>()
                    //     .innerRadius(d => 0)
                    //     .outerRadius((d, i, j) => y(d))
                    //     .startAngle((d, i) => ((i * 2 * Math.PI) / 16))
                    //     .endAngle((d, i) => (((i + 1) * 2 * Math.PI) / 16))
                    //     .padAngle(Math.PI / 32)
                )

            var label = g.append("g")
                .selectAll("g")
                .data(this.props.data)
                .enter()
                .append("g")
                .attr("text-anchor", "middle")
                .attr("transform", (d, i) => "rotate(" + ((i * 360 / 16) - 90) + "), translate(" + (outerRadius + margin / 2) + ",0)")

            let windPrincipals = [
                "N", "NNØ", "NØ", "ØNØ",
                "Ø", "ØSØ", "SØ", "SSØ",
                "S", "SSV", "SV", "VSV",
                "V", "VNV", "NV", "NNV"
            ];

            label.append("text")
                .attr("transform", (d, i) => "rotate(" + (90 + (i > 3 && i < 12 ? 180 : 0)) + ")")
                .attr('dominant-baseline', 'middle')
                .text((d, i) => windPrincipals[i])
                .style("font-size",14);


            // g.append("g")
            //     .selectAll(".axis")
            //     .data(this.props.data)
            //     .enter()
            //     .append("g")
            //     .attr("class", "axis")
            //     .attr("transform", (d, i) => "rotate(" + (i * 360 / 16) + ")")
            //     .call(
            //         d3.axisLeft(
            //             d3.scaleLinear()
            //                 .range([0, outerRadius - 20])
            //                 .domain([])
            //         )
            //         .tickSizeOuter(0)
            //     )
            //     .selectAll('.domain')
            //     .style('shape-rendering', 'geometricprecision')

            var yAxis = g.append('g')
                .attr('text-anchor', 'middle');

            var yTick = yAxis
                .selectAll('g')
                .data(y.ticks(5).slice(1))
                .enter().append('g');
    
            yTick.append('circle')
                .attr('fill', 'none')
                .attr('stroke', 'gray')
                .attr('stroke-dasharray', '4,4')
                .attr('r', y);
    
            yTick.append('text')
                .attr('y', d => -y(d))
                // .attr('dy', '-0.35em')
                // .attr('x', d => -10)
                .text(
                    d => d + ' ' + this.props.unit
                )
                .style('font-size',14);



        }
    }

}

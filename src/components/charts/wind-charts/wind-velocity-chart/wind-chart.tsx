
import styles from './wind-chart.scss';
import svgStyles from './../../../../scss/_svg.scss';

import * as d3 from 'd3';
import { ChartBaseComponent } from '../../chart-base-component';

export interface WindChartProps extends PropsWithLabel {
    unit: string;
    data: any[];
}

export default class WindChart extends ChartBaseComponent<WindChartProps> {

    protected chartContainerClassName: string = styles['wind-velocity-chart-container'];
    protected chartClassName: string = styles['wind-velocity-chart'];

    constructor(props: any) {
        super(props);
    }

    protected drawChart(): void {
        console.log('WindVelocityChart drawChart');

        const data = this.props.data;
        // console.log(data);

        if (!data || data.length === 0) {
            return;
        }

        const svg = this.svg;
        const width = this.width;
        const height = this.height;

        const innerRadius = 0;
        const outerRadius = (Math.min(width, height) / 2);

        const g = svg.append('g');
        g.attr('class', svgStyles['test1'])
        g.attr('transform', `translate(${(width / 2) + this.margins.left},${(height / 2) + this.margins.top})`);


        const y = d3.scaleLinear().range([innerRadius, outerRadius]);

        y.domain([0, d3.max(data as number[])]);

        // data?
        const g2 = g.append('g');
        g2.attr('transform', `rotate(${ -360 / 32 })`);

        const g2Paths = g2.selectAll('path').data(data).enter().append('path');
        g2Paths.attr('class', svgStyles['arc']);

        const arc = d3.arc<any>();
        // d3.arc<any>()
        arc.innerRadius(d => 0);
        arc.outerRadius((d, i, j) => y(d));
        arc.startAngle((d, i) => ((i * 2 * Math.PI) / 16));
        arc.endAngle((d, i) => (((i + 1) * 2 * Math.PI) / 16));
        arc.padAngle(Math.PI / 32);

        g2Paths.attr('d', arc);

        // rings
        var label = g.append('g')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('text-anchor', 'middle')
            .attr('transform', (d, i) => `rotate(${(i * 360 / 16) - 90}), translate(${(outerRadius + this.margins.top / 2)}, 0)`)

        let windPrincipals = [
            'N', 'NNØ', 'NØ', 'ØNØ',
            'Ø', 'ØSØ', 'SØ', 'SSØ',
            'S', 'SSV', 'SV', 'VSV',
            'V', 'VNV', 'NV', 'NNV'
        ];

        label.append('text')
            .attr('transform', (d, i) => 'rotate(' + (90 + (i > 3 && i < 12 ? 180 : 0)) + ')')
            .attr('dominant-baseline', 'middle')
            .text((d, i) => windPrincipals[i])
            .style('font-size',14);


        // g.append('g')
        //     .selectAll('.axis')
        //     .data(this.props.data)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'axis')
        //     .attr('transform', (d, i) => 'rotate(' + (i * 360 / 16) + ')')
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

        var yAxis = g.append('g').attr('text-anchor', 'middle');

        var yTick = yAxis
            .selectAll('g')
            .data(y.ticks(3).slice(1))
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

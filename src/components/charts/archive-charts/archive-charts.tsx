import * as React from 'react';
import * as d3 from 'd3';

import './archive-charts.scss';
import svgStyles from './../../../scss/_svg.scss';

import Panel from './../../main/panel/panel';
import BarometerChart from './barometer-chart/barometer-chart';
import { ArchiveData } from 'src/models/archive-data.model';
import RainChart from './rain-chart/rain-chart';
import TemperatureChart from './temperature-chart/temperature-chart';
import { ArchiveChartData } from 'src/models/archive-chart-data.model';
import Container from './../../container/container';
import WindChart from './wind-chart/wind-chart';
import { ChartProps } from 'src/models/chart-props.model';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChartOptions } from 'src/models/chart-options.model';
import { ChartBaseComponent } from '../chart-base-component';

export interface ArchiveChartsState {
    chartData: ArchiveChartData[],
    isFetching: boolean;
    fetchFailed: boolean;
    abortController?: AbortController;
}

class ArchiveCharts extends React.Component<RouteComponentProps, ArchiveChartsState> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            isFetching: false,
            fetchFailed: false,
            chartData: null,
            abortController: null,
        }

    }

    public shouldComponentUpdate(nextProps: Readonly<RouteComponentProps>, nextState: Readonly<ArchiveChartsState>, nextContext: any): boolean {
        const propsAreNew = nextProps !== this.props;
        if (propsAreNew) {
            this.getHistoryData(nextProps);
            return false;
        }
        return true;
    }

    public componentDidMount(): void {
        this.getHistoryData();
    }

    public render() {
        return (
            <Container>
                <Panel>
                    <TemperatureChart label="Temperature" unit="°C" {...this.state} />
                </Panel>
                <Panel>
                    <WindChart label="Wind" unit="m/s" {...this.state} />
                </Panel>
                <Panel>
                    <BarometerChart label="Barometer" unit="hPa" {...this.state} />
                </Panel>
                <Panel>
                    <RainChart label="Rain" unit="mm" {...this.state} />
                </Panel>
            </Container>
        );
    }

    private async getHistoryData(props: Readonly<RouteComponentProps> = this.props) {
        // console.log('ArchiveCharts getHistoryData');

        const currentStateAbortController = this.state.abortController;

        if (currentStateAbortController) {
            console.warn('ArchiveCharts aborting');
            currentStateAbortController.abort();
        }

        const newStateAbortController = new AbortController();

        try {

            let hostname = window.location.hostname;

            let port: number = 80;
            if (hostname === 'localhost') {
                port = 8080;
            }

            let apiRouteEndPoint = props.location.pathname;
            if (!apiRouteEndPoint || apiRouteEndPoint === '/') {
                apiRouteEndPoint = '/day/1';
            }
            console.log('apiRouteEndPoint', apiRouteEndPoint);
            const url = `http://${ hostname }:${ port }/api/archive${ apiRouteEndPoint }`;

            this.setState({
                isFetching: true,
                fetchFailed: false,
                abortController: newStateAbortController,
                chartData: null,
            });

            const response = await fetch(url, { signal: newStateAbortController.signal });
            // console.log(response);

            const data: ArchiveData[] = await response.json();
            const chartData: ArchiveChartData[] = data.map<ArchiveChartData>((d: ArchiveData, index: number, array: ArchiveData[]) => {
                return {
                    barometer: d.barometer,
                    dateTime: new Date(d.dateTime * 1000),
                    minOutTemp: d.minOutTemp,
                    maxOutTemp: d.maxOutTemp,
                    outHumidity: d.outHumidity,
                    outTemp: d.outTemp,
                    rain: d.rain,
                    rainRate: d.rainRate,
                    rainAccum: d.rain,
                    windDir: d.windDir,
                    windGust: d.windGust,
                    windGustDir: d.windGustDir,
                    windSpeed: d.windSpeed,
                }
            });
            for (let i = 1; i < chartData.length; i++) {
                chartData[i].rainAccum += chartData[i - 1].rainAccum;
            }
            // console.log(chartData);
            this.setState({
                isFetching: false,
                fetchFailed: false,
                abortController: null,
                chartData: chartData,
            });
        }
        catch (error) {
            console.error(error);
            const isFetching = this.state.abortController !== newStateAbortController;
            const fetchFailed = this.state.abortController !== currentStateAbortController;
            console.log('isFetching', isFetching);
            console.log('fetchFailed', fetchFailed);
            if (!isFetching || fetchFailed) {
                this.setState({
                    isFetching: false,
                    fetchFailed: true,
                    abortController: null,
                    chartData: null,
                });
            }
        }
    }


}

// export default ArchiveCharts;
export default withRouter(ArchiveCharts);


export function setUpArchiveChart(
    base: ChartBaseComponent<ChartProps<ArchiveChartData>>,
    prop: keyof ArchiveChartData,
    minProp?: keyof ArchiveChartData,
    maxProp?: keyof ArchiveChartData
): {
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    xAxisTimeRange: d3.ScaleTime<number, number, never>,
    yAxisValueRange: d3.ScaleLinear<number, number, never>,
} {

    const chartData = base.props.chartData;

    if (!chartData || chartData.length === 0) {
        console.warn(chartData);
        return null;
    }

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
    const minValue = Math.floor(d3.min(chartData, d => d[minProp ||  prop] as number ) - 1);
    const maxValue = Math.ceil(d3.max(chartData, d => d[maxProp || prop] as number ) + 1)
    yAxisValueRange.domain([minValue, maxValue]);

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





    // const tooltip = g.append('text').attr('text-anchor', 'middle');
        // .attr('class', svgStyles['tooltip'])

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

    // g.append('rect')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .style('fill', 'transparent')
    //     .on('mouseover', () => tooltip.style('opacity', 1) )
    //     .on('mouseout', () => tooltip.style('opacity', 0) )
    //     // .on('mousemove', onMouseMove);


    return {
        container,
        xAxisTimeRange,
        yAxisValueRange,
    }

}

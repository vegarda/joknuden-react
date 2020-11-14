import * as React from 'react';

import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import * as d3 from 'd3';

import styles from './chart-base-component.scss';

export class ChartBaseComponent<Props extends PropsWithLabel> extends React.Component<Props> {

    protected onUnmount$: Subject<void> = new Subject();

    protected ref: React.RefObject<HTMLDivElement>;
    protected svgRef: React.RefObject<SVGSVGElement>;
    protected svg: d3.Selection<SVGSVGElement, unknown, null, undefined>

    protected chartContainerClassName: string;
    protected chartClassName: string;

    protected margins = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
    };

    protected get width(): number {
        return this.ref.current.offsetWidth - this.margins.left - this.margins.right;
    }

    protected get height(): number {
        return this.ref.current.offsetHeight - this.margins.top - this.margins.bottom;
    }

    constructor(props: Props) {
        super(props);
        console.log('ChartBaseComponent', props);
        this.ref = React.createRef();
        this.svgRef = React.createRef();

    }

    public componentDidMount(): void {
        this.svg = d3.select(this.svgRef.current);
        this._drawChart();
        const onResize = () => {
            this._drawChart();
        }
        window.addEventListener('resize', onResize);
        this.onUnmount$.pipe(first()).subscribe(() => window.removeEventListener('resize', onResize));
    }

    public componentDidUpdate(): void {
        this.drawChart();
    }

    public componentWillUnmount(): void {
        this.onUnmount$.next();
    }

    private renderLabel(): JSX.Element {
        if (this.props.label) {
            return (
                <div className={styles['chart-header']}>
                    <span className={styles['chart-label']}>
                        { this.props.label }
                    </span>
                </div>
            );
        }
        return null;
    }

    public render(): JSX.Element {
        return (
            <div className={ this.chartContainerClassName } ref={ this.ref }>
                { this.renderLabel() }
                <svg ref={ this.svgRef } className={ `${ styles['chart'] } ${ this.chartClassName }` }/>
            </div>
        );
    }

    protected drawChart(): void {
        throw new Error('drawChart not implemented');
    }

    private _drawChart(): void {
        this.clearSvg();
        this.setSvgMargins();
        this.drawChart();
    }

    protected clearSvg(): void {
        console.log('clearSvg');
        this.svg.selectAll('*').remove();
    }

    protected setSvgMargins(): void {
        console.log('setSvgMargins');
        const width = this.width;
        const height = this.height;
        this.svg.attr('width', width + this.margins.left + this.margins.right);
        this.svg.attr('height', height + this.margins.top + this.margins.bottom);
        this.svg.attr('viewBox', '0 0 ' + (width + this.margins.left + this.margins.right) + ' ' + (height + this.margins.top + this.margins.bottom));
    }

}


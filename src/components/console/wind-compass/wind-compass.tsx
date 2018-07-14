import * as React from 'react';

import IWindCompassProps from './wind-compass.props';

export default class WindCompass extends React.Component<IWindCompassProps, {}> {

    private rotateDir: number;
    private windDir: number;

    private svgStyle: React.CSSProperties = {
        display: "inline-block",
        height: "10em",
        margin: "0 auto",
        verticalAlign: "middle",
        width: "10em",
    }

    private polygonStyle: any = {
        strokeLinejoin: "round",
        transition: "all 500ms",
        vectorEffect: "none",
    }

    constructor(props: IWindCompassProps) {
        super(props);
        this.windDir = props.consoleData.windDir;
        this.rotateDir = props.consoleData.windDir;
        console.log('wind compass');
        console.log(props);
    }

    public render() {

        this.calculateRotateDir();

        return (
            <div className="wind-compass-container">
                <svg viewBox="0 0 200 200" style={this.svgStyle}>

                    <path d="M 100 0 L 100 10" transform="rotate(0 100 100)  translate(0 5)" stroke="black" strokeWidth="4" />
                    <path d="M 100 0  L 100 20" transform="rotate(11.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(22.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(33.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(45 100 100)  translate(0 5)" stroke="black" strokeWidth="2" />
                    <path d="M 100 0  L 100 20" transform="rotate(56.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(67.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(78.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />

                    <path d="M 100 0 L 100 10" transform="rotate(90 100 100)  translate(0 5)" stroke="black" strokeWidth="4" />
                    <path d="M 100 0  L 100 20" transform="rotate(101.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(112.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(123.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(135 100 100)  translate(0 5)" stroke="black" strokeWidth="2" />
                    <path d="M 100 0  L 100 20" transform="rotate(146.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(157.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(168.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />

                    <path d="M 100 0 L 100 10" transform="rotate(180 100 100)  translate(0 5)" stroke="black" strokeWidth="4" />
                    <path d="M 100 0  L 100 20" transform="rotate(191.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(202.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(213.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(225 100 100)  translate(0 5)" stroke="black" strokeWidth="2" />
                    <path d="M 100 0  L 100 20" transform="rotate(236.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(247.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(258.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />

                    <path d="M 100 0 L 100 10" transform="rotate(270 100 100)  translate(0 5)" stroke="black" strokeWidth="4" />
                    <path d="M 100 0  L 100 20" transform="rotate(281.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(292.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(303.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(315 100 100)  translate(0 5)" stroke="black" strokeWidth="2" />
                    <path d="M 100 0  L 100 20" transform="rotate(326.25 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />
                    <path d="M 100 0 L 100 10" transform="rotate(337.5 100 100)  translate(0 5)" stroke="black" strokeWidth="3" />
                    <path d="M 100 0  L 100 20" transform="rotate(348.75 100 100)  translate(0 0)" stroke="black" strokeWidth="1" />

                    <polygon stroke="black" style={this.polygonStyle} className="arrow" points="85,120 100,75 115,120 100,110" transform={"rotate(" + this.rotateDir + ")"} transform-origin="center" strokeWidth="5" fill="black"/>

                </svg>
            </div>
        )
    }

    private calculateRotateDir() {

        const d1 = this.props.consoleData.windDir - this.windDir;
        const d2 = d1 + 360;
        const d3 = d1 - 360;

        const absD1 = Math.abs(d1);
        const absD2 = Math.abs(d2);
        const absD3 = Math.abs(d3);

        if (absD1 < absD2 && absD1 < absD3) {
            this.rotateDir = this.rotateDir + d1;
        }
        else if (absD2 < absD1 && absD2 < absD3) {
            this.rotateDir = this.rotateDir + d2;
        }
        else if (absD3 < absD1 && absD3 < absD2) {
            this.rotateDir = this.rotateDir + d3;
        }
        else {
            this.rotateDir = this.props.consoleData.windDir;
        }

        this.windDir = this.props.consoleData.windDir;

    }
    
    
    
}

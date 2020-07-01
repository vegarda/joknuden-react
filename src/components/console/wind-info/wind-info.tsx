import * as React from 'react';
import IConsoleData from '../console-data';

import styles from './wind-info.scss';

interface IWindInfoProps {
    consoleData: IConsoleData
}

export default class WindInfo extends React.Component<IWindInfoProps, {}> {
    
    private fromString = "fra";

    private language = "no";
    private supportedLanguages = ["en", "no"];
    private languages = window.navigator.languages;
    private intl: Intl.NumberFormat = new Intl.NumberFormat(this.languages[0], { maximumFractionDigits: 1 });

    private beaufort = {
        description: {
            no: [
                "Stille",
                "Flau vind",
                "Svak vind",
                "Lett bris",
                "Laber bris",
                "Frisk bris",
                "Liten kuling",
                "Stiv kuling",
                "Sterk kuling", 
                "Liten storm",
                "Full storm",
                "Sterk storm",
                "Orkan"
            ],
            en: [
                "Calm",
                "Light air",
                "Light breeze",
                "Gentle breeze",
                "Moderate breeze",
                "Fresh breeze",
                "Strong breeze",
                "Near gale",
                "Gale",
                "Strong gale",
                "Storm",
                "Violent storm",
                "Hurricane"
            ]
        },
        windSpeed: [0.2, 1.5, 3.3, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.6, 100]
    };

    private windPrincipals = {
        abbr: {
            en: [
                "N", "NNE", "NE", "ENE",
                "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW",
                "W", "WNW", "NW", "NNW"
            ],
            no: [
                "N", "NNØ", "NØ", "ØNØ",
                "Ø", "ØSØ", "SØ", "SSØ",
                "S", "SSV", "SV", "VSV",
                "V", "VNV", "NV", "NNV"
            ]
        },
        long: {
            en: [
                "north", "north-northeast", "northeast", "east-northeast",
                "east", "east-southeast", "southeast", "south-southeast",
                "south", "south-southwest", "southwest", "west-southwest",
                "west", "west-northwest", "northwest", "north-northwest"
            ],
            no: [
                "nord", "nord-nordøst", "nordøst", "øst-nordøst",
                "øst", "øst-sørøst", "sørøst", "sør-sørøst",
                "sør", "sør-sørvest", "sørvest", "vest-sørvest",
                "vest", "vest-nordvest", "nordvest", "nord-nordvest"
            ]
        }
    };

    constructor(props: IWindInfoProps) {
        super(props);
        // const language = window.navigator.languages.find(l => this.supportedLanguages.indexOf(l) >= 0);
        // if (language) {
        //     this.language = language;
        // }
        // if (this.language !== 'no') {
        //     this.fromString = 'from';
        // }
    }

    public render() {

        return (
            <div className={styles['wind-info-container console-column']}>
                <span className={styles['beaufort']}>{ this.getBeaufort() }</span>
                <span className={styles['direction']}>{ this.getDirection() } ({ this.props.consoleData.windDir } °)</span>
                <div className={styles['data-row wind-speed']}>
                    <i className={styles['wi wi-strong-wind']} />
                    <span className={styles['data-value']}>{ this.intl.format(this.props.consoleData.windSpeed) }</span>
                    <span className={styles['data-unit']}>mps</span>
                </div>
                { this.getGustingElement() }
            </div>
        )
    }

    private getGustingElement() {
        if (this.props.consoleData.windGust > this.props.consoleData.windSpeed) {
            return (
                <div className={styles['data-row wind-gust']}>
                    <i className={styles['wi']} />
                    <span className={styles['data-value']}>({ this.intl.format(this.props.consoleData.windGust) })</span>
                    <span className={styles['data-unit']} />
                </div>
            )
        }
        return (
            <div className={styles['data-row wind-gust']} />
        )
    }

    private getBeaufort() {
        const beaufortIndex = this.beaufort.windSpeed.findIndex(windSpeed => this.props.consoleData.windSpeed < windSpeed)
        return this.beaufort.description[this.language][beaufortIndex - 1];
    }

    private getDirection() {
        let i = Math.floor((this.props.consoleData.windDir + 11.25) / 22.5);
        if (i > 15) {
            i = 0;
        }
        return this.fromString + ' ' + this.windPrincipals.long[this.language][i];
    }

}

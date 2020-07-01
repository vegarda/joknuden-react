import * as React from 'react';

import './main.scss';

import Console from '../console/console';
import Panel from './panel/panel';
import ArchiveCharts from '../charts/archive-charts/archive-charts';
import WindCharts from '../charts/wind-charts/wind-charts';

export default class Main extends React.Component {

    public render() {
        console.log('Main render');
        const consolePanel = <Panel><Console /></Panel>
        console.log(consolePanel);
        console.log(Console);
        return (
            <main className="main-container">
                {/* <Panel>
                    <Console />
                </Panel> */}
                <ArchiveCharts />
                <WindCharts />
            </main>
        );
    }

}


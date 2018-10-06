import * as React from 'react';

import './main.scss';

import Console from '../console/console';
import Panel from './panel/panel';
import HistoryChart from '../charts/history-chart/history-chart';

export default class Main extends React.Component<{}, {}> {


    public render() {
        return (
            <main className="main-container">
                <Panel>
                    <Console />
                </Panel>
                <Panel>
                    <HistoryChart />
                </Panel>
            </main>
        )
    }


}

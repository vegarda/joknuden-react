import * as React from 'react';
import * as History from 'history';

import styles from './main.scss';

import Console from '../console/console';
import Panel from './panel/panel';
import ArchiveCharts from '../charts/archive-charts/archive-charts';
import WindCharts from '../charts/wind-charts/wind-charts';
import { BrowserRouter, Switch, Route, Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { RouteOption, RouteOptionProps } from 'src/app';

class Main extends React.Component<RouteOptionProps> {

    private onUnmount$: Subject<void> = new Subject();

    constructor(props: RouteOptionProps) {
        super(props);
        const unlisten = props.history.listen((location: History.Location, action: History.Action) => {
            console.log(location);
        });
        this.onUnmount$.subscribe(unlisten);
    }

    public componentWillUnmount(): void {
        console.log('Main.componentWillUnmount()');
        this.onUnmount$.next();
        this.onUnmount$.complete();
    }

    public componentDidUpdate(prevProps: RouteComponentProps): void  {
        // console.log('Main.componentDidUpdate()', prevProps);
    }

    public render() {
        return (
            <main className={styles['main-container']}>
                <ArchiveCharts />
                {/* <Route path={ this.props.routeOptions.map(ro => ro.route) }>
                    <ArchiveCharts />
                </Route> */}
                {/* <Route>
                    <Panel>
                        <Console />
                    </Panel>
                    <ArchiveCharts />
                    <WindCharts />
                </Route> */}
            </main>
        );
    }

}

export default withRouter(Main);

import * as React from 'react';
import * as History from 'history';

import { BrowserRouter, Switch, Route, Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import styles from './header.scss';
import { RouteOption, RouteOptionProps } from 'src/app';
import { Subject } from 'rxjs';


class Header extends React.Component<RouteOptionProps> {

    private onUnmount$: Subject<void> = new Subject();

    constructor(props: RouteComponentProps) {
        super(props);
        // const unlisten = props.history.listen((location: History.Location, action: History.Action) => {
        //     console.log(location);
        //     console.log(action);
        // });
        // this.onUnmount$.subscribe(unlisten);
    }

    public componentWillUnmount(): void {
        console.log('Main.componentWillUnmount()');
        this.onUnmount$.next();
        this.onUnmount$.complete();
    }

    public componentDidUpdate(prevProps: RouteComponentProps): void  {
        // console.log('Header.componentDidUpdate()', prevProps);
    }

    public renderRouteOption(routeOption: RouteOption): JSX.Element {
        return (
            <li key={ routeOption.route }>
                <NavLink activeClassName={ styles['active'] } exact={ true } to={ routeOption.route }>{ routeOption.label }</NavLink>
            </li>
        );
    }

    public render(): JSX.Element {
        return (
            <header className={styles['header-container']}>
                <h1>Joknuden</h1>
                <nav>
                    <ul>
                        { this.props.routeOptions.map(ro => this.renderRouteOption(ro)) }
                    </ul>
                </nav>
            </header>
        );
    }

}

export default withRouter(Header);

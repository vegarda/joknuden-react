import * as React from 'react';
import * as History from 'history';

import { BrowserRouter, Switch, Route, Link, NavLink, withRouter, RouteComponentProps, useLocation, useHistory } from 'react-router-dom';

import 'weather-icons/sass/weather-icons.scss';

import styles from './App.scss';

import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

export interface RouteOption {
    route: string;
    label: string;
}

export type PropsWithRouteOptions<P> = P & { routeOptions?: RouteOption[] };

export type RouteOptionProps = PropsWithRouteOptions<RouteComponentProps>;

class App extends React.Component<RouteOptionProps> {


    private routeOptions: RouteOption[] = [
        {
            route: '/yesterday',
            label: 'Yesterday',
        },
        {
            route: '/',
            label: 'Today',
        },
        {
            route: '/day/3',
            label: '3 Days',
        },
        {
            route: '/week/1',
            label: '1 week',
        },
        {
            route: '/week/2',
            label: '2 weeks',
        },
        {
            route: '/month/1',
            label: '1 Month',
        },
        {
            route: '/month/3',
            label: '3 Months',
        },
        {
            route: '/month/6',
            label: '6 Months',
        },
        {
            route: '/ytd',
            label: 'YTD',
        },
        {
            route: '/year/1',
            label: '1 Year',
        },
        {
            route: '/year/2019',
            label: '2019',
        },
    ];



    constructor(props: RouteComponentProps) {
        super(props);
        // this.props.history.listen((location) => {
        //     console.log(location.pathname);
        // });
    }

    public componentDidUpdate(prevProps: RouteComponentProps): void  {
        // console.log('App.componentDidUpdate()', prevProps);
    }

    public render() {
        return (
            <div className={styles['App']}>
                <Header routeOptions={ this.routeOptions }/>
                <Main routeOptions={ this.routeOptions } />
                {/* <Footer/> */}
            </div>
        );
    }

}

export default withRouter(App);

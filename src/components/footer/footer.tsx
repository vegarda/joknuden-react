import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RouteOptionProps } from 'src/app';

import styles from './footer.scss';

import HiLo from './hilo/hilo';

class Footer extends React.Component<RouteComponentProps> {

    constructor(
        props: RouteComponentProps,
    ) {
        super(props);
        console.log(props);
    }

    public render() {
        return (
            <footer className={ styles['footer-container'] }>
                <HiLo ></HiLo>
            </footer>
        );
    }

}

export default withRouter(Footer);

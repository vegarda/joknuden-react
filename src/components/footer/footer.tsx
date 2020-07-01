import * as React from 'react';

import styles from './footer.scss';

export default class Footer extends React.Component {
    public render() {
        return (
            <footer className={styles['footer-container']}>footer</footer>
        )
    }
}
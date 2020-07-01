import * as React from 'react';

import styles from './webcam.scss';

export default class Webcam extends React.Component<{}, {}> {

    public render() {
        return (
            <div className={styles['webcam-container']} tabIndex={-1}>
                <img className={styles['image']} src="#" />
            </div>
        )
    }

}

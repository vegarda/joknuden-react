import * as React from 'react';

import styles from './panel.scss';

export default class Panel extends React.Component<{}, {}> {

    public render() {
        return (
            <div className={styles['panel-container']}>
                { this.props.children }
            </div>
        )
    }

}

import * as React from 'react';

import styles from './panel.scss';

export interface PanelProps {
    label?: string,
}

export default class Panel extends React.Component<React.PropsWithChildren<PanelProps>, {}> {

    constructor(props: React.PropsWithChildren<PanelProps>) {
        super(props);
    }

    private renderLabel(): JSX.Element {
        if (this.props.label) {
            return (
                <div className={styles['panel-header']}>
                    <span className={styles['panel-label']}>
                        { this.props.label }
                    </span>
                </div>
            );
        }
        return null;
    }

    public render(): JSX.Element {
        return (
            <div className={styles['panel-container']}>
                { this.renderLabel() }
                <div className={styles['panel-content']}>
                    { this.props.children }
                </div>
            </div>
        )
    }

}

import * as React from 'react';

import './panel.scss';

export default class Panel extends React.Component<{}, {}> {

    public render() {
        return (
            <div className="panel-container">
                {this.props.children}
            </div>
        )
    }

}

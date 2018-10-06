import * as React from 'react';

import * as d3 from 'd3';

export default class SimpleChart extends React.Component<{}, {}> {

    public render() {
        return (
            <div className="simple-chart-container">
                {this.props.children}
            </div>
        )
    }

}

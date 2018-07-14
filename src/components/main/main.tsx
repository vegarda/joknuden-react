import * as React from 'react';

import './main.scss';

export default class Main extends React.Component<{}, {}> {

    // private intl: Intl.NumberFormat = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 });

    public render() {
        return (
            <main className="main-container" />
        )
    }

}

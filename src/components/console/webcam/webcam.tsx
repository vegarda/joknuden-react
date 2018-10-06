import * as React from 'react';

import './webcam.scss';

export default class Webcam extends React.Component<{}, {}> {

    public render() {
        return (
            <div className="webcam-container" tabIndex={-1}>
                <img className="image" src="http://joknuden.no/timelapse/2018-07-14/2018-07-14%201530.jpg" />
            </div>
        )
    }

}

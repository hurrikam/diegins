'use strict';

import * as React from 'react';

interface JobLogViewerProps {
    text?: string;
}

export default class JobLogViewer extends React.Component<JobLogViewerProps> {

    public render(): React.ReactElement {
        const text = this.props.text || '';
        const textRows = text.split('\n');
        return (
            <div className="job-log-viewer text-block-container">
                <div className="job-log-viewer-content">
                    {textRows.map(row => (<div>{row}</div>))}
                </div>
            </div>
        );
    }
}

'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobLogViewer from '../components/jobLogViewer';
import { jobService } from '../services';

interface JobLogViewerContainerProps {
    jobNumber: number;
}

interface JobLogViewerContainerState {
    text?: string;
}

export default class JobLogViewerContainer
    extends React.Component<RouteComponentProps, JobLogViewerContainerState> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {};
    }

    public async componentDidMount(): Promise<void> {
        const jobNumber = this.getJobNumber();
        try {
            const data = await jobService.getJobLog(jobNumber);
            this.setState({ text: data });
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="job-log-viewer-container">
                <div className="job-number">{this.getJobNumber()}</div>
                <JobLogViewer text={this.state.text} />
            </div>
        );
    }

    private getJobNumber(): number {
        return (this.props as JobLogViewerContainerProps).jobNumber;
    }
}

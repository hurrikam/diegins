'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobLogViewer from '../components/jobLogViewer';
import { jobService } from '../services';

interface JobLogViewerContainerProps extends RouteComponentProps {
    jobNumber?: number;
    refreshIntervalMs: number;
}

interface JobLogViewerContainerState {
    text?: string;
}

export default class JobLogViewerContainer
    extends React.Component<JobLogViewerContainerProps, JobLogViewerContainerState> {

    private intervalTimer: NodeJS.Timeout;
    private isMounted: boolean;

    constructor(props: JobLogViewerContainerProps) {
        super(props);
        this.state = {};
    }

    public async componentDidMount(): Promise<void> {
        this.isMounted = true;
        this.refreshLog();
        this.intervalTimer = setInterval(() => this.refreshLog(), this.props.refreshIntervalMs);
    }

    public componentWillUnmount(): void {
        this.isMounted = false;
        clearInterval(this.intervalTimer);
    }

    public render(): React.ReactNode {
        return (
            <div className="job-log-viewer-container">
                <div className="page-header">{this.props.jobNumber}</div>
                <JobLogViewer text={this.state.text} />
            </div>
        );
    }

    private async refreshLog(): Promise<void> {
        if (!this.isMounted) {
            return;
        }
        try {
            const data = await jobService.getJobLog(this.props.jobNumber);
            this.setState({ text: data });
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }
}

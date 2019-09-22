'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobLogViewer from '../components/jobLogViewer';
import { jobService } from '../services';
import { getJobInfo } from '../services/jobService';
import JobStatus from '../../common/models/jobStatus';

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
    private shouldRefreshLog: boolean;

    constructor(props: JobLogViewerContainerProps) {
        super(props);
        this.state = {};
    }

    public async componentDidMount(): Promise<void> {
        this.shouldRefreshLog = true;
        this.refreshLog();
        this.intervalTimer = setInterval(() => this.refreshLog(), this.props.refreshIntervalMs);
    }

    public componentWillUnmount(): void {
        this.stopLogRefresh();
    }

    public render(): React.ReactNode {
        return (
            <div className="job-log-viewer-container">
                <div className="page-header">{this.props.jobNumber}</div>
                <JobLogViewer text={this.state.text} />
            </div>
        );
    }

    private stopLogRefresh(): void {
        this.shouldRefreshLog = false;
        clearInterval(this.intervalTimer);
    }

    private async refreshLog(): Promise<void> {
        if (!this.shouldRefreshLog) {
            return;
        }
        const jobNumber = this.props.jobNumber;
        try {
            const data = await jobService.getJobLog(jobNumber);
            this.setState({ text: data });
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
        let jobInfo;
        try {
            jobInfo = await getJobInfo(jobNumber);
        } catch (error) {
            return;
        }
        if (jobInfo.status === JobStatus.Finished) {
            this.stopLogRefresh();
        }
    }
}

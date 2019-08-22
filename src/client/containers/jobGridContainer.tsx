'use strict';

import * as React from 'react';
import { jobService } from '../services';
import JobInfo from '../../common/models/jobInfo';
import JobGrid from '../components/jobGrid';

const GRID_UPDATE_INTERVAL_MS = 2000;

interface JobGridContainerState {
    jobInfos: Array<JobInfo>;
}

export default class JobGridContainer extends React.Component<{}, JobGridContainerState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            jobInfos: []
        };
    }

    public componentDidMount(): void {
        this.updateJobInfos();
        setInterval(() => this.updateJobInfos(), GRID_UPDATE_INTERVAL_MS);
    }

    public render(): React.ReactNode {
        return (
            <JobGrid
                jobInfos={this.state.jobInfos}
                cancelJob={jobService.cancelJob.bind(jobService)}>
            </JobGrid>
        );
    }

    private updateJobInfos(): void {
        jobService.getJobInfos()
            .then(jobInfos => this.setState({ jobInfos }))
            .catch(() => this.setState({ jobInfos: [] }));
    }
}

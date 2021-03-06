'use strict';

import * as React from 'react';
import { jobService } from '../services';
import JobInfo from '../../common/models/jobInfo';
import JobGrid from '../components/jobGrid';
import { openJobLog } from '../services/jobService';

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
                cancelJob={jobService.cancelJob.bind(jobService)}
                openJobLog={openJobLog}>
            </JobGrid>
        );
    }

    private async updateJobInfos(): Promise<void> {
        let jobInfos = new Array<JobInfo>();
        try {
            jobInfos = await jobService.getJobInfos();
        } finally {
            this.setState({ jobInfos });
        }
    }
}

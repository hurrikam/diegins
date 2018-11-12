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
        setInterval(() => {
            jobService.getJobInfos()
                .then(jobInfos => this.setState({ jobInfos }))
                .catch(() => this.setState({ jobInfos: [] }));
        }, GRID_UPDATE_INTERVAL_MS);
    }

    public render(): React.ReactElement<void> {
        return (
            <JobGrid
                jobInfos={this.state.jobInfos}
                cancelJob={jobService.cancelJob.bind(jobService)}>
            </JobGrid>
        );
    }
}

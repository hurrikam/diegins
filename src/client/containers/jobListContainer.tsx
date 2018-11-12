'use strict';

import * as React from 'react';
import { jobService } from '../services';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobList from '../components/jobList';

interface JobListContainerState {
    jobConfigurations: Array<JobConfiguration>;
}

export default class JobListContainer extends React.Component<{}, JobListContainerState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            jobConfigurations: []
        };
    }

    public componentDidMount(): void {
        jobService.getJobConfigurations()
            .then(jobConfigurations => this.setState({ jobConfigurations }))
            .catch(() => this.setState({ jobConfigurations: [] }));
    }

    public render(): React.ReactElement<void> {
        return (
            <JobList
                jobConfigurations={this.state.jobConfigurations}
                runJob={jobService.runJob.bind(jobService)}>
            </JobList>
        );
    }
}

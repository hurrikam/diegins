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

    public async componentDidMount(): Promise<void> {
        let jobConfigurations = new Array<JobConfiguration>();
        try {
            jobConfigurations = await jobService.getJobConfigurations();
        } finally {
            this.setState({ jobConfigurations });
        }
    }

    public render(): React.ReactNode {
        return (
            <JobList
                jobConfigurations={this.state.jobConfigurations}
                runJob={jobService.runJob.bind(jobService)}
                configureJob={() => undefined}>
            </JobList>
        );
    }
}

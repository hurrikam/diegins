'use strict';

import * as React from 'react';
import { jobService } from '../services';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobConfigurationList from '../components/jobConfigurationList';
import { getJobConfigurations } from '../services/jobConfigurationServices';

interface JobConfigurationListContainerState {
    jobConfigurations: Array<JobConfiguration>;
}

export default class JobConfigurationListContainer extends React.Component<{}, JobConfigurationListContainerState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            jobConfigurations: []
        };
    }

    public async componentDidMount(): Promise<void> {
        let jobConfigurations = new Array<JobConfiguration>();
        try {
            jobConfigurations = await getJobConfigurations();
        } finally {
            this.setState({ jobConfigurations });
        }
    }

    public render(): React.ReactNode {
        return (
            <JobConfigurationList
                jobConfigurations={this.state.jobConfigurations}
                runJob={jobService.runJob.bind(jobService)}
                configureJob={() => undefined}>
            </JobConfigurationList>
        );
    }
}

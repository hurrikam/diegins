'use strict';

import * as React from 'react';
import { jobService  } from '../services';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobConfigurationList from '../components/jobConfigurationList';
import {
    getJobConfiguration,
    getJobConfigurations,
    openJobConfiguration
} from '../services/jobConfigurationServices';
import { openJobRunner } from '../services/jobService';

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
                runJob={this.runJob.bind(this)}
                openJobConfiguration={openJobConfiguration}>
            </JobConfigurationList>
        );
    }

    private async runJob(jobId: string): Promise<void> {
        let jobCofiguration;
        try {
            jobCofiguration = await getJobConfiguration(jobId);
        } catch (error) {
            alert(`An error occurrer while retrieving the configuration for ${jobId}: ${error.message}`);
            return;
        }
        if (jobCofiguration.parameters && jobCofiguration.parameters.length > 0) {
            openJobRunner(jobId);
            return;
        }
        jobService.runJob(jobId);
    }
}

'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobConfiguration from '../../common/models/jobConfiguration';
import { getJobStepIds, saveJobConfiguration } from '../services/jobConfigurationServices';
import JobConfigurator from '../components/jobConfigurator';

interface JobConfiguratorContainerRouteProps extends RouteComponentProps {
    jobId: string;
}

interface JobConfiguratorContainerState {
    isLoading: boolean;
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
}

export default class JobConfiguratorContainer extends React.Component<RouteComponentProps, JobConfiguratorContainerState> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            isLoading: true,
            jobStepIds: []
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            const jobStepIds = await getJobStepIds();
            this.setState({ jobStepIds });
            const isNewJob = !(this.props as JobConfiguratorContainerRouteProps).jobId;
            if (isNewJob) {
                return;
            }
        // tslint:disable-next-line:no-empty
        } catch (error) {

        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render(): React.ReactNode {
        if (this.state.isLoading) {
            return (<div>Loading...</div>);
        }
        const jobConfiguration = this.state.jobConfiguration;
        return (
            <JobConfigurator
                jobConfiguration={jobConfiguration}
                jobStepIds={this.state.jobStepIds}
                save={() => saveJobConfiguration(jobConfiguration)} />
        );
    }
}

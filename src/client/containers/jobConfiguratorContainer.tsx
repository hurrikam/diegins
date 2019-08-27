'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobConfiguration from '../../common/models/jobConfiguration';
import { getJobConfiguration, getJobStepIds, saveJobConfiguration } from '../services/jobConfigurationServices';
import JobConfigurator from '../components/jobConfigurator';

interface JobConfiguratorContainerRouteProps extends RouteComponentProps {
    jobId: string;
}

interface JobConfiguratorContainerState {
    isLoading: boolean;
    isSaving: boolean;
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
}

export default class JobConfiguratorContainer extends React.Component<RouteComponentProps, JobConfiguratorContainerState> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            isLoading: true,
            isSaving: false,
            jobStepIds: []
        };
    }

    public async componentDidMount(): Promise<void> {
        let jobConfiguration = {} as JobConfiguration;
        let jobStepIds = new Array<string>();
        try {
            jobStepIds = await getJobStepIds();
            const jobId = (this.props as JobConfiguratorContainerRouteProps).jobId;
            const isNewJob = !jobId;
            if (isNewJob) {
                return;
            }
            jobConfiguration = await getJobConfiguration(jobId);
            // tslint:disable-next-line:no-empty
        } finally {
            this.setState({
                isLoading: false,
                jobConfiguration,
                jobStepIds
            });
        }
    }

    public render(): React.ReactNode {
        if (this.state.isLoading) {
            return (<div className="job-configurator-container-overlay">Loading...</div>);
        }
        return (
            <div>
                {this.state.isSaving ? (<div className="job-configurator-container-overlay">Saving...</div>) : ''}
                <JobConfigurator
                    jobConfiguration={this.state.jobConfiguration}
                    jobStepIds={this.state.jobStepIds}
                    save={this.save.bind(this)} />
            </div>
        );
    }

    private async save(newJobConfiguration: JobConfiguration): Promise<void> {
        if (this.state.isSaving) {
            return;
        }
        this.setState({
            isSaving: true,
            jobConfiguration: newJobConfiguration
        });
        try {
            await saveJobConfiguration(newJobConfiguration);
        } catch (error) {
            alert(error);
        } finally {
            this.setState({ isSaving: false });
        }
    }
}

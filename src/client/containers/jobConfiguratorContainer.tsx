'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobConfiguration from '../../common/models/jobConfiguration';
import {
    createJobConfiguration,
    getJobConfiguration,
    getJobStepIds,
    saveJobConfiguration
} from '../services/jobConfigurationServices';
import JobConfigurator from '../components/jobConfigurator';

interface JobConfiguratorContainerRouteProps extends RouteComponentProps {
    jobId: string;
}

interface JobConfiguratorContainerState {
    isLoading: boolean;
    isNewConfiguration: boolean;
    isSaving: boolean;
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
}

export default class JobConfiguratorContainer extends React.Component<RouteComponentProps, JobConfiguratorContainerState> {

    constructor(props: JobConfiguratorContainerRouteProps) {
        super(props);
        this.state = {
            isLoading: true,
            isNewConfiguration: !props.jobId,
            isSaving: false,
            jobStepIds: []
        };
    }

    public async componentDidMount(): Promise<void> {
        let jobConfiguration = {} as JobConfiguration;
        let jobStepIds = new Array<string>();
        try {
            jobStepIds = await getJobStepIds();
            if (this.state.isNewConfiguration) {
                return;
            }
            const jobId = (this.props as JobConfiguratorContainerRouteProps).jobId;
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
        this.setState({ isSaving: true });
        try {
            if (this.state.isNewConfiguration) {
                await createJobConfiguration(newJobConfiguration);
            } else {
                await saveJobConfiguration(newJobConfiguration);
            }
            this.setState({
                isNewConfiguration: false,
                jobConfiguration: newJobConfiguration
            });
        } catch (error) {
            alert(error);
        } finally {
            this.setState({ isSaving: false });
        }
    }
}

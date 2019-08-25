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
        return (
            <div>
                {this.state.isLoading ? (<div className="job-configurator-container-overlay">Loading...</div>) : ''}
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

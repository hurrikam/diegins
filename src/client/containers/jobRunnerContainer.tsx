'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobRunner from '../components/jobRunner';
import JobParameter from '../../common/models/jobParameter';
import { getJobConfiguration } from '../services/jobConfigurationServices';
import { jobService } from '../services';

interface JobRunnerContainerProps extends RouteComponentProps {
    jobId: string;
}

interface JobRunnerContainerState {
    isLoading: boolean;
    jobParameters: Array<JobParameter>;
}

export default class JobRunnerContainer
    extends React.Component<RouteComponentProps, JobRunnerContainerState> {

    private readonly jobId: string;

    constructor(props: RouteComponentProps) {
        super(props);
        this.jobId = (this.props as JobRunnerContainerProps).jobId;
        this.state = {
            isLoading: true,
            jobParameters: []
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            const jobConfiguration = await getJobConfiguration(this.jobId);
            this.setState({ jobParameters: jobConfiguration.parameters });
        } catch (error) {
            this.setState({ jobParameters: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className="page-header">{this.jobId}</div>
                <hr/>
                {this.renderJobParameters()}
            </div>
        );
    }

    private renderJobParameters(): React.ReactNode {
        if (this.state.isLoading) {
            return (<div>Loading job parameters...</div>);
        }
        return (<JobRunner jobParameters={this.state.jobParameters}
            runJob={() => jobService.runJob(this.jobId)} />);
    }
}

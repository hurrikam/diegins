'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';

interface JobConfigurationListItemProps {
    jobConfiguration: JobConfiguration;
    openJobConfiguration: (jobId: string) => void;
    runJob: (jobId: string) => void;
}

export default class JobConfigurationListItem extends React.Component<JobConfigurationListItemProps> {

    public render(): JSX.Element {
        return (
            <div className="job-list-item">
                <span className="job-id">{this.props.jobConfiguration.id}</span>
                {this.renderWarningIcon()}
                {this.renderRunIcon()}
                {this.renderConfigureIcon()}
            </div>
        );
    }

    private renderRunIcon(): JSX.Element {
        if (!this.canRun()) {
            return;
        }
        return (
            <img src="/icons/right.png" className="run-icon icon-button" title="Run the job"
                onClick={() => this.props.runJob(this.props.jobConfiguration.id)}/>
        );
    }

    private renderWarningIcon(): JSX.Element {
        if (this.canRun()) {
            return;
        }
        return (
            <img src="/icons/exclamation.png" className="exclamation-icon"
                title="The job can't run because no steps are defined or it is misconfigured."/>
        );
    }

    private renderConfigureIcon(): JSX.Element {
        return (
            <img src="/icons/gear.png" className="gear-icon icon-button" title="Configure the job"
                onClick={() => this.props.openJobConfiguration(this.props.jobConfiguration.id)}/>
        );
    }

    private canRun(): boolean {
        const stepIds = this.props.jobConfiguration.stepConfigurations;
        return stepIds && stepIds.length > 0;
    }
}

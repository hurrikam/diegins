'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';

interface JobListItemProps {
    jobConfiguration: JobConfiguration;
    runJob: (jobId: string) => void;
}

export default class JobListItem extends React.Component<JobListItemProps> {

    public render(): React.ReactElement<JobListItemProps> {
        return (
            <div className="job-list-item">
                <span className="job-id">{this.props.jobConfiguration.id}</span>
                {this.renderWarningIcon()}
                {this.renderRunButton()}
            </div>
        );
    }

    private renderRunButton(): JSX.Element {
        if (!this.canRun()) {
            return;
        }
        return (<button className="run-button"
            onClick={() => this.props.runJob(this.props.jobConfiguration.id)}>run</button>);
    }

    private renderWarningIcon(): JSX.Element {
        if (this.canRun()) {
            return;
        }
        return (<img src="icons/exclamation.png" className="exclamation-icon"
                title="The job can't run because no steps are defined or it is misconfigured."/>);
    }

    private canRun(): boolean {
        const stepIds = this.props.jobConfiguration.stepIds;
        return stepIds && stepIds.length > 0;
    }
}

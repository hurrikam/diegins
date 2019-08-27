'use strict';

import * as React from 'react';
import JobInfo from '../../common/models/jobInfo';
import JobResult from '../../common/models/jobResult';

interface JobGridItemProps {
    jobInfo: JobInfo;
    cancelJob: (jobNumber: number) => void;
}

export default class JobGridItemComponent extends React.Component<JobGridItemProps> {

    public render(): React.ReactNode {
        const { jobInfo } = this.props;
        let className = 'job-grid-item';
        const resultClass = this.getJobResultClass();
        if (resultClass) {
            className += ` ${resultClass}`;
        }
        return (
            <div className={className}>
                <span className="job-number">{jobInfo.number}</span>
                {this.renderCancelButton()}
                <span className="job-id">{jobInfo.id}</span>
                <br/>
                <progress value={this.getPercentageCompleted()} max="100"></progress>
                <br/>
                <span>{this.getJobStatus()}</span>
            </div>
        );
    }

    private renderCancelButton(): JSX.Element {
        const {
            jobInfo,
            cancelJob
        } = this.props;
        if (!this.canCancel()) {
            return;
        }
        return (<img src="/icons/close.png" className="cancel-icon img-button"
            title="Cancel the job"
            onClick={() => cancelJob(jobInfo.number)}/>);
    }

    private getJobResultClass(): string {
        switch (this.props.jobInfo.result) {
            case JobResult.Succeeded:
                return 'job-grid-item-succeeded';
            case JobResult.Failed:
                return 'job-grid-item-failed';
            case JobResult.Canceled:
                return 'job-grid-item-canceled';
            default:
                return '';
        }
    }

    private canCancel(): boolean {
        return this.props.jobInfo.result === undefined;
    }

    private getJobStatus(): string {
        const { jobInfo } = this.props;
        const stepNumber = `${jobInfo.currentStepIndex + 1} of ${jobInfo.stepCount}`;
        switch (jobInfo.result) {
            case JobResult.Succeeded:
                return `${jobInfo.stepCount} steps completed`;
            case JobResult.Failed:
                return `Step ${stepNumber} failed`;
            case JobResult.Canceled:
                return `Canceled during step ${stepNumber}`;
            default:
                return `Executing step ${stepNumber}`;
        }
    }

    private getPercentageCompleted(): number {
        const { jobInfo } = this.props;
        if (jobInfo.result === JobResult.Succeeded) {
            return 100;
        }
        const progressRatio = jobInfo.currentStepIndex / jobInfo.stepCount;
        return progressRatio * 100;
    }
}

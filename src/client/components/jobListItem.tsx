'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';

interface JobListItemProps {
    jobConfiguration: JobConfiguration;
    runJob: (jobId: string) => void;
}

export default class JobListItem extends React.Component<JobListItemProps> {

    public render(): React.ReactElement<JobListItemProps> {
        const jobId = this.props.jobConfiguration.id;
        return (
            <div className="job-list-item">
                <span className="job-list-item-name">{jobId}</span>
                <button className="job-list-item-button"
                 onClick={() => this.props.runJob(jobId)}>run</button>
            </div>
        );
    }
}

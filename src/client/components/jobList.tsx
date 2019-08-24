'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobListItem from './jobListItem';

interface JobListProps {
    jobConfigurations: Array<JobConfiguration>;
    configureJob: (jobId: string) => void;
    runJob: (jobId: string) => void;
}

export default class JobList extends React.Component<JobListProps> {

    public render(): React.ReactNode {
        const jobConfigurationElements = this.props.jobConfigurations.map(jobConfiguration =>
            (<JobListItem
                key={jobConfiguration.id}
                jobConfiguration={jobConfiguration}
                configureJob={this.props.configureJob}
                runJob={this.props.runJob}
            >
            </JobListItem>)
        );
        return (<div className="job-list">{jobConfigurationElements}</div>);
    }
}

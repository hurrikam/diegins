'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobConfigurationListItem from './jobConfigurationListItem';

interface JobConfigurationListProps {
    jobConfigurations: Array<JobConfiguration>;
    openJobConfiguration: (jobId: string) => void;
    runJob: (jobId: string) => void;
}

export default class JobConfigurationList extends React.Component<JobConfigurationListProps> {

    public render(): React.ReactNode {
        const jobConfigurationElements = this.props.jobConfigurations.map(jobConfiguration =>
            (<JobConfigurationListItem
                key={jobConfiguration.id}
                jobConfiguration={jobConfiguration}
                openJobConfiguration={this.props.openJobConfiguration}
                runJob={this.props.runJob}
            >
            </JobConfigurationListItem>)
        );
        return (<div className="job-list">{jobConfigurationElements}</div>);
    }
}

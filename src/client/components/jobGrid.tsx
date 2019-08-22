'use strict';

import * as React from 'react';
import JobInfo from '../../common/models/jobInfo';
import JobGridItem from './jobGridItem';

interface JobGridProps {
    jobInfos: Array<JobInfo>;
    cancelJob: (jobNumber: number) => void;
}

export default class JobGridComponent extends React.Component<JobGridProps> {

    public render(): React.ReactNode {
        const jobInfoElements = this.props.jobInfos
            .reverse()
            .map(jobInfo =>
                (<JobGridItem
                    key={jobInfo.number}
                    jobInfo={jobInfo}
                    cancelJob={this.props.cancelJob}
                >
                </JobGridItem>)
            );
        return (<div className="job-grid">{jobInfoElements}</div>);
    }
}

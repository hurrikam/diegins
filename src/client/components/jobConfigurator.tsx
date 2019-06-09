'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';

interface JobConfiguratorProps {
    jobConfiguration: JobConfiguration;
    jobStepIds: Array<string>;
    save: () => void;
}

export default class JobConfigurator extends React.Component<JobConfiguratorProps> {

    public render(): JSX.Element {
        const jobConfiguration = this.props.jobConfiguration;
        return (
            <div>
                <h1>{jobConfiguration.id}</h1>
                {jobConfiguration.stepConfigurations.map(stepConfiguration =>
                    (<div>
                        <br/>
                        <h3>{stepConfiguration.stepId}</h3>
                    </div>)
                )}
            </div>
        );
    }
}

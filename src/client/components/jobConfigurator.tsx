'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobStepConfiguration from '../../common/models/jobStepConfiguration';

interface JobConfiguratorProps {
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
    save: () => void;
}

interface JobConfiguratorState {
    newStepId: string;
    stepConfigurations: Array<JobStepConfiguration>;
}

export default class JobConfigurator extends React.Component<JobConfiguratorProps, JobConfiguratorState> {

    constructor(props: JobConfiguratorProps) {
        super(props);
        const jobConfiguration = this.props.jobConfiguration;
        const stepConfigurations = jobConfiguration && jobConfiguration.stepConfigurations || [];
        this.state = {
            newStepId: this.props.jobStepIds[0],
            stepConfigurations
        };
    }

    public render(): JSX.Element {
        const jobConfiguration = this.props.jobConfiguration || {} as JobConfiguration;
        const jobConfigurationId = jobConfiguration.id || 'Unnamed Job';
        return (
            <div>
                <span>Job ID: </span>{jobConfigurationId}
                <br />
                {this.state.stepConfigurations.map((stepConfiguration, index) =>
                    (<div>
                        <span>{`Step ${index + 1}`}</span>
                        <br />
                        <h3>{stepConfiguration.stepId}</h3>
                    </div>)
                )}
                <br />
                <button onClick={() => this.addStepConfiguration()}>Add step:</button>
                <select onChange={(event) => this.setState({ newStepId: event.currentTarget.value })}>
                    {this.props.jobStepIds.map(stepId => (<option value={stepId}>{stepId}</option>))}
                </select>
            </div>
        );
    }

    private addStepConfiguration(): void {
        const newStepConfiguration = {
            stepId: this.state.newStepId
        } as JobStepConfiguration;
        this.setState({ stepConfigurations: [...this.state.stepConfigurations, newStepConfiguration] });
    }
}

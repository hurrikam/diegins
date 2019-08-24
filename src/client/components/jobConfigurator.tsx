'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobStepConfiguration from '../../common/models/jobStepConfiguration';
import JobStepConfigurator from './jobStepConfigurator';

interface JobConfiguratorProps {
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
    save: () => void;
}

interface JobConfiguratorState {
    jobId: string;
    newStepId: string;
    stepConfigurations: Array<JobStepConfiguration>;
}

export default class JobConfigurator extends React.Component<JobConfiguratorProps, JobConfiguratorState> {

    constructor(props: JobConfiguratorProps) {
        super(props);
        const jobConfiguration = this.props.jobConfiguration;
        const defaultJobStepId = this.props.jobStepIds[0];
        if (jobConfiguration) {
            this.state = {
                jobId: jobConfiguration.id,
                newStepId: defaultJobStepId,
                stepConfigurations: jobConfiguration.stepConfigurations || []
            };
            return;
        }
        this.state = {
            jobId: '',
            newStepId: defaultJobStepId,
            stepConfigurations: []
        };
    }

    public render(): JSX.Element {
        return (
            <div className="job-configurator">
                <div className="job-configurator-id-container">
                    <span>Job ID </span>
                    <input className="job-configurator-id" type="text" value={this.state.jobId}
                        onChange={(event) => this.setState({ jobId: event.currentTarget.value })} />
                </div>
                <br />
                <div className="job-configurator-steps-container">
                    {this.state.stepConfigurations.map((stepConfiguration, index) =>
                        (<JobStepConfigurator
                            data={stepConfiguration.data}
                            deleteStepConfiguration={this.deleteStepConfiguration.bind(this)}
                            onDataChanged={(newData) => this.onStepConfigurationDataChanged(index, newData)}
                            stepId={stepConfiguration.stepId}
                            stepIndex={index}
                        />))
                    }
                    <div className="job-configurator-add-step-controls">
                        <button className="job-configurator-add-step-button"
                            onClick={() => this.addStepConfiguration()}>
                            Add step:
                        </button>
                        <select onChange={(event) => this.setState({ newStepId: event.currentTarget.value })}>
                            {this.props.jobStepIds.map(stepId => (<option value={stepId}>{stepId}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    private addStepConfiguration(): void {
        const newStepConfiguration = {
            stepId: this.state.newStepId
        } as JobStepConfiguration;
        const modifiedStepConfigurations = [...this.state.stepConfigurations, newStepConfiguration];
        this.setState({ stepConfigurations: modifiedStepConfigurations });
    }

    private deleteStepConfiguration(stepIndex: number): void {
        const splicedStepConfigurations = [...this.state.stepConfigurations];
        splicedStepConfigurations.splice(stepIndex, 1);
        this.setState({ stepConfigurations: splicedStepConfigurations });
    }

    private onStepConfigurationDataChanged(index: number, newData: string): void {
        const modifiedStepConfigurations = [...this.state.stepConfigurations];
        modifiedStepConfigurations[index].data = newData;
        this.setState({ stepConfigurations: modifiedStepConfigurations });
    }
}

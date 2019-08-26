'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobStepConfiguration from '../../common/models/jobStepConfiguration';
import JobStepConfigurator from './jobStepConfigurator';

interface JobConfiguratorProps {
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
    save: (newJobConfiguration: JobConfiguration) => void;
}

interface JobConfiguratorState {
    jobId: string;
    stepConfigurations: Array<JobStepConfiguration>;
}

export default class JobConfigurator extends React.Component<JobConfiguratorProps, JobConfiguratorState> {

    private readonly newJobStepIdSelect: React.RefObject<HTMLSelectElement>;

    constructor(props: JobConfiguratorProps) {
        super(props);
        const jobConfiguration = this.props.jobConfiguration;
        this.newJobStepIdSelect = React.createRef();
        if (jobConfiguration) {
            this.state = {
                jobId: jobConfiguration.id,
                stepConfigurations: jobConfiguration.stepConfigurations || []
            };
            return;
        }
        this.state = {
            jobId: '',
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
                        <select ref={this.newJobStepIdSelect}>
                            {this.props.jobStepIds.map(stepId => (<option value={stepId}>{stepId}</option>))}
                        </select>
                    </div>
                </div>
                <div className="job-configurator-update-controls">
                    <button className="job-configurator-save-button" onClick={() => this.save()}>
                        Save
                    </button>
                </div>
            </div>
        );
    }

    private addStepConfiguration(): void {
        const newStepConfiguration = {
            stepId: this.newJobStepIdSelect.current.value
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

    private save(): void {
        this.props.save({
            id: this.state.jobId,
            stepConfigurations: this.state.stepConfigurations
        });
    }
}

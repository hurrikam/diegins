'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobStepConfiguration from '../../common/models/jobStepConfiguration';
import JobParameterConfigurator from './jobParameterConfigurator';
import JobStepConfigurator from './jobStepConfigurator';
import JobParameter from '../../common/models/jobParameter';

interface JobConfiguratorProps {
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
    save: (newJobConfiguration: JobConfiguration) => void;
}

interface JobConfiguratorState {
    jobId: string;
    parameters: Array<JobParameter>;
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
                parameters: jobConfiguration.parameters || [],
                stepConfigurations: jobConfiguration.stepConfigurations || []
            };
            return;
        }
        this.state = {
            jobId: '',
            parameters: [],
            stepConfigurations: []
        };
    }

    public render(): JSX.Element {
        return (
            <div className="job-configurator">
                <div className="job-configurator-id-container">
                    {this.isNewJob() ? (<span>Job ID </span>) : ''}
                    {this.renderJobId()}
                </div>
                <div className="job-configurator-steps-container">
                    <div>Parameters</div>
                    <div>
                        {this.state.parameters.map((parameter, index) =>
                            (<JobParameterConfigurator
                                index={index}
                                parameter={parameter}
                                deleteParameter={this.deleteParameter.bind(this)}
                                onParameterChanged={(newParameter) => this.onParameterChanged(index, newParameter)}
                            />)
                        )}
                    </div>
                    <div>Steps</div>
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

    private renderJobId(): JSX.Element {
        if (this.isNewJob()) {
            return (<input className="job-configurator-id" type="text" value={this.state.jobId}
                onChange={(event) => this.setState({ jobId: event.currentTarget.value })} />);
        }
        return (<span className="job-configurator-id">{this.props.jobConfiguration.id}</span>);
    }

    private isNewJob(): boolean {
        const { jobConfiguration } = this.props;
        return !jobConfiguration || !jobConfiguration.id;
    }

    private addStepConfiguration(): void {
        const newStepConfiguration = {
            stepId: this.newJobStepIdSelect.current.value
        } as JobStepConfiguration;
        const modifiedStepConfigurations = [...this.state.stepConfigurations, newStepConfiguration];
        this.setState({ stepConfigurations: modifiedStepConfigurations });
    }

    private deleteStepConfiguration(index: number): void {
        const splicedStepConfigurations = [...this.state.stepConfigurations];
        splicedStepConfigurations.splice(index, 1);
        this.setState({ stepConfigurations: splicedStepConfigurations });
    }

    private onStepConfigurationDataChanged(index: number, newData: string): void {
        const modifiedStepConfigurations = [...this.state.stepConfigurations];
        modifiedStepConfigurations[index].data = newData;
        this.setState({ stepConfigurations: modifiedStepConfigurations });
    }

    private onParameterChanged(index: number, newParameter: JobParameter): void {
        const modifiedParameters = [...this.state.parameters];
        modifiedParameters[index] = newParameter;
        this.setState({ parameters: modifiedParameters });
    }

    private deleteParameter(index: number): void {
        const splicedParameters = [...this.state.parameters];
        splicedParameters.splice(index, 1);
        this.setState({ parameters: splicedParameters });
    }

    private save(): void {
        this.props.save({
            id: this.state.jobId,
            parameters: this.state.parameters,
            stepConfigurations: this.state.stepConfigurations
        });
    }
}

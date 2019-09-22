'use strict';

import * as React from 'react';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobStepConfiguration from '../../common/models/jobStepConfiguration';
import JobParameterConfigurator from './jobParameterConfigurator';
import JobStepConfigurator from './jobStepConfigurator';
import JobParameter from '../../common/models/jobParameter';
import { number } from 'prop-types';

interface JobConfiguratorProps {
    jobConfiguration?: JobConfiguration;
    jobStepIds: Array<string>;
    save: (newJobConfiguration: JobConfiguration) => void;
}

interface JobConfiguratorState {
    jobId: string;
    maximumConcurrentJobs: number;
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
                maximumConcurrentJobs: jobConfiguration.maximumConcurrentJobs,
                parameters: jobConfiguration.parameters || [],
                stepConfigurations: jobConfiguration.stepConfigurations || []
            };
            return;
        }
        this.state = {
            jobId: '',
            maximumConcurrentJobs: undefined,
            parameters: [],
            stepConfigurations: []
        };
    }

    public render(): JSX.Element {
        return (
            <div className="job-configurator">
                {this.renderJobId()}
                <hr />
                <div className="job-configurator-scroll-container">
                    <div className="job-configurator-section-header">Job Properties</div>
                    <div className="text-block-container">
                        <span className="text-input-label">Maximum concurrent jobs</span>
                        <input type="text" value={this.state.maximumConcurrentJobs || ''}
                            onChange={(event) => this.setState({maximumConcurrentJobs: parseInt(event.currentTarget.value, 10)})} />
                    </div>
                    <hr />
                    <div className="job-configurator-section-header">Parameters</div>
                    {this.state.parameters.map((parameter, index) =>
                        (<JobParameterConfigurator
                            index={index}
                            parameter={parameter}
                            deleteParameter={this.deleteParameter.bind(this)}
                            onParameterChanged={(newParameter) => this.onParameterChanged(index, newParameter)}
                        />)
                    )}
                    <div className="job-configurator-add-parameter-controls">
                        <button className="job-configurator-add-parameter-button"
                            onClick={() => this.addParameter()}>
                            Add parameter
                    </button>
                    </div>
                    <hr />
                    <div className="job-configurator-section-header">Steps</div>
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
                <hr />
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
            return (
                <div className="page-header">
                    <span>Job ID </span>
                    <input className="job-configurator-id-field" type="text" value={this.state.jobId}
                        onChange={(event) => this.setState({ jobId: event.currentTarget.value })} />
                </div>
            );
        }
        return (<div className="page-header">{this.props.jobConfiguration.id}</div>);
    }

    private isNewJob(): boolean {
        const { jobConfiguration } = this.props;
        return !jobConfiguration || !jobConfiguration.id;
    }

    private addParameter(): void {
        const newParameter = {
            name: ''
        } as JobParameter;
        const modifiedParameters = [...this.state.parameters, newParameter];
        this.setState({ parameters: modifiedParameters });
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

    private save(): void {
        this.props.save({
            id: this.state.jobId,
            maximumConcurrentJobs: this.state.maximumConcurrentJobs,
            parameters: this.state.parameters,
            stepConfigurations: this.state.stepConfigurations
        });
    }
}

'use strict';

import * as React from 'react';

interface JobStepConfiguratorProps {
    data: string;
    deleteStepConfiguration: (stepIndex: number) => void;
    description: string;
    onDataChanged: (newData: string) => void;
    onDescriptionChanged: (newDescription: string) => void;
    stepId: string;
    stepIndex: number;
}

export default class JobStepConfigurator extends React.Component<JobStepConfiguratorProps> {

    public render(): JSX.Element {
        const stepIndex = this.props.stepIndex;
        return (
            <div className="job-step-configurator-container text-block-container">
                <div className="job-step-configurator-header">
                    <span className="job-step-configurator-number">{stepIndex + 1}.</span>
                    <span className="job-step-configurator-id">{this.props.stepId}</span>
                    <input className="job-step-configurator-description" maxLength={255} type="text"
                        placeholder="Description"
                        onChange={(event) => this.props.onDescriptionChanged(event.currentTarget.value)}
                        value={this.props.description} />
                    <img className="job-step-configurator-delete-button icon-button"
                        src="/icons/close.png" title="Delete the step"
                        onClick={() => this.props.deleteStepConfiguration(stepIndex)} />
                </div>
                <textarea className="job-step-configurator-data" rows={3}
                    onChange={(event) => this.props.onDataChanged(event.currentTarget.value)}
                    value={this.props.data} />
            </div >
        );
    }
}

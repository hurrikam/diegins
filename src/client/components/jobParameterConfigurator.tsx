'use strict';

import * as React from 'react';
import JobParameter from '../../common/models/jobParameter';

interface JobParameterConfiguratorProps {
    index: number;
    parameter: JobParameter;
    deleteParameter: (index: number) => void;
    onParameterChanged: (newParameter: JobParameter) => void;
}

export default class JobParameterConfigurator
    extends React.Component<JobParameterConfiguratorProps> {

        constructor(props: JobParameterConfiguratorProps) {
            super(props);
            this.state = {
                name: props.parameter.name
            };
        }

    public render(): React.ReactNode {
        return (
            <div className="job-parameter-container text-block-container">
                <span className="job-parameter-name">Name</span>
                <input type="text" value={this.props.parameter.name}
                    onChange={(event) => this.notifyParameterChanged(event.currentTarget.value)} />
                <img className="job-parameter-delete-button icon-button"
                    src="/icons/close.png" title="Delete the parameter"
                    onClick={() => this.props.deleteParameter(this.props.index)} />
            </div>
        );
    }

    private notifyParameterChanged(newName: string): void {
        this.props.onParameterChanged({ name: newName });
    }
}

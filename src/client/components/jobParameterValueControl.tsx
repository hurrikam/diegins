'use strict';

import * as React from 'react';
import JobParameter from '../../common/models/jobParameter';

interface JobParameterValueControlProps {
    onValueChanged: (newValue: string) => void;
    parameter: JobParameter;
    value: string;
}

export default class JobParameterValueControl
    extends React.Component<JobParameterValueControlProps> {

    public render(): React.ReactNode {
        return (
            <div className="job-parameter-container text-block-container">
                <span className="text-input-label">{this.props.parameter.name}</span>
                <input type="text"
                    value={this.props.value}
                    onChange={(event) => this.props.onValueChanged(event.currentTarget.value)} />
            </div>
        );
    }
}

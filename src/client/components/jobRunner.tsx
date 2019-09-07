'use strict';

import * as React from 'react';
import JobParameter from '../../common/models/jobParameter';
import JobParameterValueControl from './jobParameterValueControl';

interface JobRunnerProps {
    runJob: (values: Array<string>) => void;
    jobParameters: Array<JobParameter>;
}

interface JobRunnerState {
    parameterValues: Array<string>;
}

export default class JobRunner extends React.Component<JobRunnerProps, JobRunnerState> {

    constructor(props: JobRunnerProps) {
        super(props);
        this.state = {
            parameterValues: new Array<string>(this.props.jobParameters.length)
        };
    }

    public render(): React.ReactNode {
        return (
            <div>
                {this.props.jobParameters.map((parameter, index) =>
                    <JobParameterValueControl
                        parameter={parameter}
                        value={this.state.parameterValues[index]}
                        onValueChanged={(newValue) => this.onParameterValueChanged(newValue, index)} />
                )}
                <hr />
                <div className="centered-content">
                    <button>Run</button>
                </div>
            </div>
        );
    }

    private onParameterValueChanged(newValue: string, index: number): void {
        this.state.parameterValues[index] = newValue;
        const modifiedParameterValues = [...this.state.parameterValues];
        modifiedParameterValues[index] = newValue;
        this.setState({ parameterValues: modifiedParameterValues });
    }
}

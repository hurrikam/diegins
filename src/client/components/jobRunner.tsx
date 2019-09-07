'use strict';

import * as React from 'react';
import JobParameter from '../../common/models/jobParameter';
import JobParameterValueControl from './jobParameterValueControl';
import JobParameterValues from '../../common/models/jobParameterValues';

interface JobRunnerProps {
    runJob: (parameterValues: JobParameterValues) => void;
    jobParameters: Array<JobParameter>;
}

interface JobRunnerState {
    parameterValues: { [parameterName: string]: string };
}

export default class JobRunner extends React.Component<JobRunnerProps, JobRunnerState> {

    constructor(props: JobRunnerProps) {
        super(props);
        this.state = {
            parameterValues: {}
        };
    }

    public render(): React.ReactNode {
        return (
            <div>
                {this.props.jobParameters.map((parameter, index) =>
                    <JobParameterValueControl
                        parameter={parameter}
                        value={this.state.parameterValues[index]}
                        onValueChanged={(newValue) => this.onParameterValueChanged(parameter.name, newValue)} />
                )}
                <hr />
                <div className="centered-content">
                    <button onClick={() => this.props.runJob(this.state.parameterValues)}>Run</button>
                </div>
            </div>
        );
    }

    private onParameterValueChanged(name: string, newValue: string): void {
        const modifiedParameterValues = {...this.state.parameterValues};
        modifiedParameterValues[name] = newValue;
        this.setState({ parameterValues: modifiedParameterValues });
    }
}

'use strict';

import * as React from 'react';
import { openJobConfiguration } from '../services/jobConfigurationServices';

interface ToolbarProps {
    openJobConfiguration: (jobId: string) => void;
}

export default class Toolbar extends React.Component<ToolbarProps> {

    public render(): React.ReactElement {
        return (
            <div className="toolbar">
                <img className="img-button new-job-configuration-icon" src="/icons/new_job_configuration.png"
                    title="Create a new job configuration" onClick={() => openJobConfiguration('')} />
            </div>
        );
    }
}

'use strict';

import * as React from 'react';
import { Router } from '@reach/router';
import Home from './home';
import JobConfiguratorContainer from '../containers/jobConfiguratorContainer';
import JobLogViewerContainer from '../containers/JobLogViewerContainer';
import { NEW_JOB_CONFIGURATION, JOB_CONFIGURATION, JOB_LOG } from '../routes';

export default class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <Router className="app-router">
                <Home path="/" />
                <JobConfiguratorContainer path={NEW_JOB_CONFIGURATION} />
                <JobConfiguratorContainer path={JOB_CONFIGURATION} />
                <JobLogViewerContainer path={JOB_LOG} />
            </Router>
        );
    }
}

'use strict';

import * as React from 'react';
import { Router } from '@reach/router';
import Home from './home';
import JobConfiguratorContainer from '../containers/jobConfiguratorContainer';
import { NEW_JOB_CONFIGURATION, JOB_CONFIGURATION } from '../routes';

export default class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <Router className="app-router">
                <Home path="/" />
                <JobConfiguratorContainer path={NEW_JOB_CONFIGURATION} />
                <JobConfiguratorContainer path={JOB_CONFIGURATION} />
            </Router>
        );
    }
}

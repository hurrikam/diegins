'use strict';

import * as React from 'react';
import { Router } from '@reach/router';
import Home from './home';
import JobConfiguratorContainer from '../containers/jobConfiguratorContainer';

export default class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <div className="app">
                <Router>
                    <Home path="/" />
                    <JobConfiguratorContainer path="job/configure/:jobId" />
                </Router>
            </div>
        );
    }
}

'use strict';

import * as React from 'react';
import { Router } from '@reach/router';
import JobListContainer from '../containers/jobListContainer';
import JobGridContainer from '../containers/jobGridContainer';
import Home from './home';

export default class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <div className="app">
                <Router>
                    <Home path="/" />
                </Router>
            </div>
        );
    }
}

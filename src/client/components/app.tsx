'use strict';

import * as React from 'react';
import JobListContainer from '../containers/jobListContainer';
import JobGridContainer from '../containers/jobGridContainer';

export default class App extends React.Component {

    public render(): React.ReactElement<any> {
        return (
            <div className="app">
                <JobListContainer></JobListContainer>
                <JobGridContainer></JobGridContainer>
            </div>
        );
    }
}

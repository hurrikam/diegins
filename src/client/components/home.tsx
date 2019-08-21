'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobListContainer from '../containers/jobListContainer';
import JobGridContainer from '../containers/jobGridContainer';

export default class Home extends React.Component<RouteComponentProps> {

    public render(): React.ReactNode {
        return (
            <div>
                <JobListContainer></JobListContainer>
                <JobGridContainer></JobGridContainer>
            </div>
        );
    }
}

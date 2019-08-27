'use strict';

import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import JobConfigurationListContainer from '../containers/jobConfigurationListContainer';
import JobGridContainer from '../containers/jobGridContainer';
import Toolbar from './toolbar';
import { openJobConfiguration } from '../services/jobConfigurationServices';

export default class Home extends React.Component<RouteComponentProps> {

    public render(): React.ReactNode {
        return (
            <div className="home">
                <div>
                    <Toolbar openJobConfiguration={openJobConfiguration} />
                    <JobConfigurationListContainer />
                </div>
                <JobGridContainer />
            </div>
        );
    }
}

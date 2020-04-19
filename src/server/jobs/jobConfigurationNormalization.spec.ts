'use strict';

import { normalizeJobConfiguration } from './jobConfigurationNormalization';
import JobConfiguration from '../../common/models/jobConfiguration';

describe('normalizeJobConfiguration', () => {

    test('throws an exception if no configuration is passed', () => {
        expect(() => normalizeJobConfiguration(undefined))
            .toThrowError('Invalid job configuration passed');
    });

    test('trims parameter names', () => {
        const configuration = {
            id: 'testId',
            parameters: [{ name: ' param1 ' }],
            stepConfigurations: []
        } as JobConfiguration;
        normalizeJobConfiguration(configuration);
        expect(configuration.parameters[0].name)
            .toBe('param1');
    });

    test('trims step descriptions', () => {
        const configuration = {
            id: 'testId',
            parameters: [],
            stepConfigurations: [
                { description: ' test step description ' }
            ]
        } as JobConfiguration;
        normalizeJobConfiguration(configuration);
        expect(configuration.stepConfigurations[0].description)
            .toBe('test step description');
    });
});

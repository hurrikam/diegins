'use strict';

import { validateJobConfiguration } from './jobConfigurationValidation';
import JobConfiguration from '../models/jobConfiguration';

describe('validateJobConfiguration', () => {

    test('throws an exception if no configuration is passed', () => {
        expect(() => validateJobConfiguration(undefined))
            .toThrowError('Invalid configuration passed.');
    });

    test('throws an exception if no configuration is passed', () => {
        const configuration = {
            id: ''
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Configuration ID cannot be blank.');
    });

    test('throws an exception if no configuration is passed', () => {
        const configuration = {
            id: ''
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Configuration ID cannot be blank.');
    });

    test('throws an exception if job parameters are not an array', () => {
        const configuration = {
            id: 'testId'
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Invalid parameters list.');
    });

    test('throws an exception if job parameters contains duplicate names', () => {
        const configuration = {
            id: 'testId',
            parameters: [
                { name: 'param1' },
                { name: 'param2' },
                { name: ' param1 ' }
            ]
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Duplicated parameter name. Parameters are case-insensitive.');
    });

    test('throws an exception if job step configurations are not an array', () => {
        const configuration = {
            id: 'testId',
            parameters: []
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Step configurations must be an array.');
    });

    test('throws an exception if a job step configuration description is neither undefined nor a string', () => {
        const configuration = {
            id: 'testId',
            parameters: [],
            stepConfigurations: [
                { description: null }
            ]
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .toThrowError('Step configuration description must be either undefined or a string.');
    });

    test('does not throw an exception if a valid configuration is passed', () => {
        const configuration = {
            id: 'testId',
            parameters: [
                { name: 'param1' },
                { name: 'param2' }
            ],
            stepConfigurations: [
                { description: '' }
            ]
        } as JobConfiguration;
        expect(() => validateJobConfiguration(configuration))
            .not
            .toThrow();
    });
});

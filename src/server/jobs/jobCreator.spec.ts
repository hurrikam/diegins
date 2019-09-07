'use strict';

import JobCreator from './jobCreator';
import JobStepRepository from './jobStepRepository';
import JobConfiguration from '../../common/models/jobConfiguration';
import Job from './job';
import JobStep from './jobStep';

const TEST_STEP_ID = 'test_step';

function createMockJobStepRepository(): any {
    const testStep = { } as JobStep;
    return {
        createJobStep: (stepId: string) => {
            if (stepId === TEST_STEP_ID) {
                return testStep;
            }
        },
        testStep
    };
}

describe('JobCreator', () => {

    describe('create', () => {

        test('throws an exception if no configuration is passed', () => {
            const jobStepRepository = {} as JobStepRepository;
            const jobCreator = new JobCreator(jobStepRepository);
            expect(() => jobCreator.create(1, undefined))
                .toThrow(new Error('jobConfiguration not specified'));
        });

        test('throws an exception if a non positive job number is passed', () => {
            const jobStepRepository = {} as JobStepRepository;
            const jobCreator = new JobCreator(jobStepRepository);
            expect(() => jobCreator.create(0, {} as JobConfiguration))
                .toThrow(new Error('jobNumber must be positive'));
        });

        test('returns a job with no steps if an empty configuration is passed', () => {
            const testJobId = 'test_job';
            const testJobNumber = 1;
            const jobStepRepository = {} as JobStepRepository;
            const jobCreator = new JobCreator(jobStepRepository);
            const jobConfiguration: JobConfiguration = {
                id: testJobId,
                parameters: [],
                stepConfigurations: []
            };
            const testJob = jobCreator.create(testJobNumber, jobConfiguration);
            expect(testJob).toEqual({
                id: testJobId,
                number: testJobNumber,
                steps: [],
                stepsData: []
            } as Job);
        });

        test('returns a job matching the passed steps', () => {
            const testJobId = 'test_job';
            const testJobNumber = 1;
            const jobStepRepository = createMockJobStepRepository();
            const jobCreator = new JobCreator(jobStepRepository);
            const jobConfiguration: JobConfiguration = {
                id: testJobId,
                parameters: [],
                stepConfigurations: [{
                    stepId: TEST_STEP_ID
                }]
            };
            const testJob = jobCreator.create(testJobNumber, jobConfiguration);
            expect(testJob).toEqual({
                id: testJobId,
                number: testJobNumber,
                steps: [jobStepRepository.testStep],
                stepsData: [undefined]
            } as Job);
        });

        test('ignores missing steps in the passed configuration', () => {
            const testJobId = 'test_job';
            const testJobNumber = 1;
            const jobStepRepository = createMockJobStepRepository();
            const jobCreator = new JobCreator(jobStepRepository);
            const jobConfiguration: JobConfiguration = {
                id: testJobId,
                parameters: [],
                stepConfigurations: [{
                    stepId: 'missing_test_step'
                }]
            };
            const testJob = jobCreator.create(testJobNumber, jobConfiguration);
            expect(testJob).toEqual({
                id: testJobId,
                number: testJobNumber,
                steps: [],
                stepsData: [undefined]
            } as Job);
        });
    });
});

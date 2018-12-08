'use strict';

import { join, resolve } from 'path';
import JobStepRepository from './jobStepRepository';
import SampleJobStep from '../../test/jobSteps/testJobStep';

const TEST_JOB_STEPS_ROOT = resolve(join(__dirname, '../../test/jobSteps'));
const TEST_JOB_STEP_ID = 'test_job_step';

describe('JobStepRepository', () => {

    afterAll(() => jest.resetModules());

    describe('initialize', () => {

        test('throws an exception if called more than once', () => {
            const jobStepRepository = new JobStepRepository(TEST_JOB_STEPS_ROOT);
            jobStepRepository.initialize();
            expect(() => jobStepRepository.initialize())
                .toThrow('job step repository already initialized');
        });
    });

    describe('createJobStep', () => {

        test('returns undefined if initialize has not been called first', () => {
            const jobStepRepository = new JobStepRepository(TEST_JOB_STEPS_ROOT);
            const jobStep = jobStepRepository.createJobStep(TEST_JOB_STEP_ID);
            expect(jobStep).toBeUndefined();
        });

        test('returns undefined if the specified step ID has no match', () => {
            const jobStepRepository = new JobStepRepository(TEST_JOB_STEPS_ROOT);
            jobStepRepository.initialize();
            const jobStep = jobStepRepository.createJobStep('a');
            expect(jobStep).toBeUndefined();
        });

        test('creates an instance of the specified step', () => {
            const jobStepRepository = new JobStepRepository(TEST_JOB_STEPS_ROOT);
            jobStepRepository.initialize();
            const jobStep = jobStepRepository.createJobStep(TEST_JOB_STEP_ID);
            expect(jobStep).toBeInstanceOf(SampleJobStep);
        });
    });
});

'use strict';

import * as fs from 'fs';
import { resolve, join } from 'path';
import JobStep from './jobStep';

const JOB_STEPS_ROOT = resolve(__dirname + '/../jobSteps');

interface JobStepConstructor {
    new(): JobStep;
}

export default class JobStepRepository {

    private readonly jobStepConstructors: { [id: string]: JobStepConstructor } = {};
    private isInitialized = false;

    public initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.scanJobStepsDirectory();
    }

    public createJobStep(id: string): JobStep {
        const jobStepConstructor = this.jobStepConstructors[id];
        if (!jobStepConstructor) {
            return;
        }
        return new jobStepConstructor();
    }

    private scanJobStepsDirectory(): void {
        const jobStepFiles = fs.readdirSync(JOB_STEPS_ROOT);
        jobStepFiles.forEach(fileName => {
            const jobStepDefinition = this.readJobStepDefinitionFile(fileName);
            if (jobStepDefinition) {
                this.jobStepConstructors[jobStepDefinition.ID] = jobStepDefinition.default;
            }
        });
    }

    private readJobStepDefinitionFile(fileName: string): {
        ID: string,
        default: JobStepConstructor
    } {
        const jobStepFilePath = join(JOB_STEPS_ROOT, fileName);
        try {
            return require(jobStepFilePath);
        } catch (error) {
            return;
        }
    }
}

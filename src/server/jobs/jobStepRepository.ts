'use strict';

import { readdirSync } from 'fs';
import { join } from 'path';
import JobStep from './jobStep';

interface JobStepConstructor {
    new(): JobStep;
}

export default class JobStepRepository {

    private readonly jobStepConstructors: { [id: string]: JobStepConstructor } = {};
    private isInitialized = false;

    constructor(private readonly jobStepsRootPath: string) {
        if (!jobStepsRootPath) {
            throw new Error('jobStepsRootPath not specified');
        }
    }

    public initialize() {
        if (this.isInitialized) {
            throw new Error('job step repository already initialized');
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

    public getJobStepIds(): Array<string> {
        return Object.keys(this.jobStepConstructors);
    }

    private scanJobStepsDirectory(): void {
        const jobStepFiles = readdirSync(this.jobStepsRootPath);
        jobStepFiles.forEach(fileName => {
            const jobStepDefinition = this.readJobStepDefinitionFile(fileName);
            const hasJobStepDefinitionId = jobStepDefinition && jobStepDefinition.ID;
            if (hasJobStepDefinitionId) {
                this.jobStepConstructors[jobStepDefinition.ID] = jobStepDefinition.default;
            }
        });
    }

    private readJobStepDefinitionFile(fileName: string): {
        ID: string,
        default: JobStepConstructor
    } {
        const jobStepFilePath = join(this.jobStepsRootPath, fileName);
        try {
            return require(jobStepFilePath);
        // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }
}

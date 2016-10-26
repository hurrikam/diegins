import * as fs from 'fs';
import * as path from 'path';
import { Job } from '../../common/models';
import { JobStep } from '.';

const JOB_STEPS_ROOT = 'server/jobSteps/';

export class JobStepRepository {

    private readonly jobStepsRelativeRoot: string;
    private readonly jobStepDictionary: { [id: string]: JobStep } = {};
    private isInitialized = false;

    public constructor() {
        this.jobStepsRelativeRoot = this.getJobStepsRelativeRoot();
    }

    public initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.scanJobStepsDirectory();
    }

    public getJobStep(id: string): JobStep {
        return this.jobStepDictionary[id];
    }

    private getJobStepsRelativeRoot(): string {
        return path.join('..', '..', JOB_STEPS_ROOT);
    }

    private scanJobStepsDirectory(): void {
        let jobStepFiles = fs.readdirSync(JOB_STEPS_ROOT);
        jobStepFiles.forEach((fileName) => {
            let jobStep = this.createJobStepFromFile(fileName);
            if (jobStep) {
                this.jobStepDictionary[jobStep.id] = jobStep;
            }
        });
    }

    private createJobStepFromFile(fileName: string): JobStep {
        let jobStepFilePath = path.join(this.jobStepsRelativeRoot, fileName);
        try {
            let jobStepModule = require(jobStepFilePath);
            let jobStep = <JobStep>new jobStepModule.default();
            return jobStep;
        } catch (error) {
            return null;
        }
    }
}

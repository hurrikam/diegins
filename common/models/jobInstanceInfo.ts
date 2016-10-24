import { JobResult } from './jobResult';

export interface JobInstanceInfo {

    id: string;
    currentStepIndex: number;
    displayName: string;
    isRunning: boolean;
    number: number;
    result?: JobResult;
    stepCount: number;
}

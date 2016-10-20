import { JobStatus } from './jobStatus';

export interface JobInstanceInfo {

    id: string;
    displayName: string;
    number: number;
    status: JobStatus;
}

import { JobStatus } from './jobStatus';

export interface JobInstanceInfo {

    id: string;
    displayName: string;
    status: JobStatus;
}

import { Injectable } from '@angular/core';
import { Job } from '../models/job';
import { JOBS } from '../mocks/jobs';

@Injectable()
export class JobService {

    public getJobs(): Promise<Array<Job>> {
        return Promise.resolve(JOBS);
    }
}
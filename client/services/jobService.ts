import { Injectable } from '@angular/core';
import { Job } from '../models/job';
import { JOBS } from '../mocks/jobs';
//import { ApiUrlService } from '../network/apiUrlService';

@Injectable()
export class JobService {

    //public constructor(private apiUrlService: ApiUrlService) {
    //}

    public getJobs(): Promise<Array<Job>> {
        return Promise.resolve(JOBS);
    }
}

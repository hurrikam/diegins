import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Job } from '../models/job';
import { JOBS } from '../mocks/jobs';
import { ApiUrlService } from '../network/apiUrlService';

@Injectable()
export class JobService {

    public constructor(private http: Http) {
    }

    private getUrl(apiEndpoint): string {
        let location = window.location;
        return `${location.protocol}//${location.host}/api/${apiEndpoint}`; 
    }

    public getJobs(): Promise<Job[]> {
        let apiUrl = this.getUrl('jobs');
        return this.http.get(apiUrl)
            .toPromise()
            .then((response) => {
                return response.json() as Job[];
            })
            .catch(() => {
                return [];
            });
    }
}

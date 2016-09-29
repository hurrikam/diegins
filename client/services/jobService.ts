import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Job } from '../../common/models/job';
import { Endpoints } from '../../common/api/endpoints';
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
        let apiUrl = this.getUrl(Endpoints.GET_JOBS);
        return this.http.get(apiUrl)
            .toPromise()
            .then((response) => {
                return response.json() as Job[];
            })
            .catch(() => {
                return [];
            });
    }

    public runJob(id: string): Promise<boolean> {
        let apiUrl = this.getUrl(Endpoints.RUN_JOB);
        return this.http.get(apiUrl)
            .toPromise()
            .then((response) => {
                return response.json() as boolean;
            })
            .catch(() => {
                return false;
            });
    }
}

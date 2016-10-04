import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { format } from 'url';
import 'rxjs/add/operator/toPromise';
import { Job } from '../../common/models/job';
import { Endpoints } from '../../common/api/endpoints';
import { ApiUrlService } from '../network/apiUrlService';
import { RunJobCommandParameters } from '../../common/api/commandsParameters';

@Injectable()
export class JobService {

    public constructor(private http: Http) {
    }

    private buildApiUrl(apiEndpoint: string, parameters?: any): string {
        let location = window.location;
        let endpoint = `${Endpoints.API_ENDPOINT_PREFIX}${apiEndpoint}`;
        let apiUrl = format({
            protocol: location.protocol,
            host: location.host,
            pathname: endpoint,
            query: parameters        
        });
        return apiUrl;
        //return `${location.protocol}//${location.host}${Endpoints.API_ENDPOINT_PREFIX}${apiEndpoint}`; 
    }

    public getJobs(): Promise<Job[]> {
        let apiUrl = this.buildApiUrl(Endpoints.GET_JOBS);
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
        let parameters = <RunJobCommandParameters>{
            id: id
        };
        let apiUrl = this.buildApiUrl(Endpoints.RUN_JOB, parameters);
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

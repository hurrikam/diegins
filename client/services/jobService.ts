import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { format } from 'url';
import 'rxjs/add/operator/toPromise';
import { Job, JobInstanceInfo } from '../../common/models';
import { Endpoints, CancelJobCommandParameters, RunJobCommandParameters } from '../../common/api';
import { ApiUrlService } from '../network/apiUrlService';

@Injectable()
export class JobService {

    constructor(private readonly http: Http) {
    }

    cancelJob(id: string, number: number): Promise<boolean> {
        let parameters = <CancelJobCommandParameters>{
            id: id,
            number: number
        };
        return this.getEndpoint(Endpoints.CANCEL_JOB, parameters)
            .then((response) => {
                return response.json() as boolean;
            })
            .catch(() => {
                return false;
            });
    }

    getJobs(): Promise<Job[]> {
        return this.getEndpoint(Endpoints.GET_JOBS)
            .then((response) => {
                return response.json() as Job[];
            })
            .catch(() => {
                return [];
            });
    }

    runJob(id: string): Promise<boolean> {
        let parameters = <RunJobCommandParameters>{
            id: id
        };
        return this.getEndpoint(Endpoints.RUN_JOB, parameters)
            .then((response) => {
                return response.json() as boolean;
            })
            .catch(() => {
                return false;
            });
    }

    getJobInstanceInfos(): Promise<JobInstanceInfo[]> {
        return this.getEndpoint(Endpoints.GET_JOB_INSTANCE_INFOS)
            .then((response) => {
                return response.json() as JobInstanceInfo[];
            })
            .catch(() => {
                return [];
            });
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

    private getEndpoint(endpoint: string, parameters?: any) {
        let apiUrl = this.buildApiUrl(endpoint, parameters);
        return this.http.get(apiUrl).toPromise();
    }
}

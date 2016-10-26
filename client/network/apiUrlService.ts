import { Injectable } from '@angular/core';
import { StringUtils } from '../../common/stringUtils';

@Injectable()
export class ApiUrlService {

    private get hostName(): string {
        return window.location.hostname;
    }

    public getUrl(apiEndpoint: string): string {
        if (StringUtils.isUndefinedOrBlank(apiEndpoint)) {
            throw new Error('The apiEndpoint parameter cannot be a blank string');
        }
        return this.hostName + '/api/' + apiEndpoint;
    }
}
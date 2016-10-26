import { Injectable } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {

    public constructor(private http: Http) {
    }

    //public get(url: string) {
    //    return this.http.get(url)
    //        .toPromise()
    //        .then(response => response.json().data as Hero[])
    //        .catch(this.handleError);
    //}
}
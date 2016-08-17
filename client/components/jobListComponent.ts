import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-list',
    template: `
        <ul>
            <li *ngFor="let job of jobs">
                <span>{{job.displayName}}</span>
            </li>
        </ul>
        `,
    providers: [ JobService ]
})
export class JobListComponent implements OnInit {

    private _jobs: Array<Job>;

    public constructor(private jobService: JobService) {
    }

    public ngOnInit() {
        this.jobService.getJobs().then((jobs) => {
            this._jobs = jobs;
        });
    }

    public get jobs(): Array<Job> {
        return this._jobs;
    }
}

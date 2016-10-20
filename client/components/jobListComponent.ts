import { Component, OnInit } from '@angular/core';
import { Job } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-list',
    template: `
        <div class="job-list">
            <job-list-item *ngFor="let job of jobs" [job]="job"></job-list-item>
        </div>
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

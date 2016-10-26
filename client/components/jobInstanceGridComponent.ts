import { Component, OnInit } from '@angular/core';
import { JobInstanceInfo } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-instance-grid',
    template: `
        <job-instance-grid-item *ngFor="let jobInstanceInfo of jobInstanceInfos" [jobInstanceInfo]="jobInstanceInfo"></job-instance-grid-item>
        `,
    providers: [JobService]
})
export class JobInstanceGridComponent implements OnInit {

    private _jobInstanceInfos: Array<JobInstanceInfo>;

    public constructor(private jobService: JobService) {
    }

    public ngOnInit(): void {
        this.updateGrid();
        setInterval(() => {
            this.updateGrid();
        }, 1000);
    }

    public get jobInstanceInfos(): Array<JobInstanceInfo> {
        return this._jobInstanceInfos;
    }

    private updateGrid(): void {
        this.jobService.getJobInstanceInfos()
            .then((jobInstanceInfos) => {
                this._jobInstanceInfos = jobInstanceInfos;
            });
    }
}

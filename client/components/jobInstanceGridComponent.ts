import { Component, OnInit } from '@angular/core';
import { JobInstanceInfo } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-instance-grid',
    template: `
        <div class="job-instance-grid" *ngFor="let jobInstanceInfo of jobInstanceInfos">
            <job-instance-grid-item [jobInstanceInfo]="jobInstanceInfo"></job-instance-grid-item>
        </div>
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

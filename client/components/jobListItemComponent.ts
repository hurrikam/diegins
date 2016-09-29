import { Component, Input, OnInit } from '@angular/core';
import { Job } from '../../common/models/job';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-list-item',
    template: `
        <div class="job-list-item">
            <span class="job-list-item-name">{{job.displayName}}</span>
            <button class="job-list-item-button">run</button>
        </div>
        `,
    providers: [JobService]
})
export class JobListItemComponent {

    @Input() public job: Job;

    public constructor(private jobService: JobService) {
    }

    public runJob(): void {
        this.jobService.runJob(this.job.id);
    }
}
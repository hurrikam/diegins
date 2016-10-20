import { Component, Input, OnInit } from '@angular/core';
import { JobInstanceInfo } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-instance-grid-item',
    template: `
        <div class="job-instance-grid-item">
            <img src="client/icons/close.png" class="cancel-icon" (click)="cancel()"/>
            <span class="display-name">{{jobInstanceInfo.displayName}}</span>            
            <br/>
            <span class="display-name">{{jobInstanceInfo.status | jobStatus}}</span>
        </div>
        `,
    providers: [JobService]
})
export class JobInstanceGridItemComponent {

    @Input() jobInstanceInfo: JobInstanceInfo;

    constructor(private jobService: JobService) {
    }

    canCancel() {
        return true;
    }

    cancel() {
        this.jobService.cancelJob(this.jobInstanceInfo.id, this.jobInstanceInfo.number);
    }
}
import { Component, Input, OnInit } from '@angular/core';
import { JobInstanceInfo } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-instance-grid-item',
    template: `
        <div class="job-instance-grid-item">
            <span class="job-instance-grid-item-displayname">{{jobInstanceInfo.displayName}}</span>
            <br/>
            <span class="job-instance-grid-item-displayname">{{jobInstanceInfo.status}}</span>
        </div>
        `,
    providers: [JobService]
})
export class JobInstanceGridItemComponent {

    @Input() public jobInstanceInfo: JobInstanceInfo;

    public constructor(private jobService: JobService) {
    }
}
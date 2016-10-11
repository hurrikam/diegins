import { Component, Input, OnInit } from '@angular/core';
import { JobInstanceInfo } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    selector: 'job-instance-grid-item',
    template: `
        <div class="job-list-item">
            <span class="job-list-item-name">{{jobInstanceInfo.id}}</span>
        </div>
        `,
    providers: [JobService]
})
export class JobInstanceGridItemComponent {

    @Input() public jobInstanceInfo: JobInstanceInfo;

    public constructor(private jobService: JobService) {
    }
}
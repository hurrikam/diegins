import { Class, Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { JobInstanceInfo, JobResult } from '../../common/models';
import { JobService } from '../services/jobService';

@Component({
    directives: [NgClass],
    providers: [JobService],
    selector: 'job-instance-grid-item',
    template: `
        <div class="job-instance-grid-item" 
            [ngClass]="{'job-instance-grid-item-succeeded': hasSucceeded, 
                'job-instance-grid-item-failed': hasFailed,
                'job-instance-grid-item-canceled': wasCanceled}">
            <span class="job-number">#{{jobInstanceInfo.number}}</span>
            <img *ngIf="canCancel" src="client/icons/close.png" class="cancel-icon" 
                (click)="cancel()"/>
            <span class="display-name">{{jobInstanceInfo.displayName}}</span>
            <br/>
            <progress value="{{percentageCompleted}}" max="100"></progress>
            <br/>
            <span *ngIf="hasSteps && jobInstanceInfo.isRunning">Executing step {{jobInstanceInfo.currentStepIndex + 1}} of {{jobInstanceInfo.stepCount}}</span>
            <span *ngIf="!jobInstanceInfo.isRunning">{{jobInstanceInfo.result | jobResult}}</span>
        </div>
        `
})
export class JobInstanceGridItemComponent {

    @Input() jobInstanceInfo: JobInstanceInfo;

    constructor(private jobService: JobService) {
    }

    get canCancel() {
        return this.jobInstanceInfo.isRunning;
    }

    cancel() {
        this.jobService.cancelJob(this.jobInstanceInfo.id, this.jobInstanceInfo.number);
    }

    get hasSucceeded() {
        return this.jobInstanceInfo.result == JobResult.Succeeded;
    }

    get hasFailed() {
        return this.jobInstanceInfo.result == JobResult.Failed;
    }

    get wasCanceled() {
        return this.jobInstanceInfo.result == JobResult.Canceled;
    }

    get hasSteps() {
        return this.jobInstanceInfo.stepCount > 0;
    }

    get percentageCompleted() {
        if (this.hasSucceeded || !this.hasSteps) {
            return 100;
        }
        const progressRatio = this.jobInstanceInfo.currentStepIndex / this.jobInstanceInfo.stepCount;
        return progressRatio * 100;
    }
}
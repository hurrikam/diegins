import { Pipe, PipeTransform } from '@angular/core';
import { JobStatus } from '../../common/models/jobStatus';

@Pipe({ name: 'jobStatus' })
export class JobStatusPipe implements PipeTransform {

    transform(status: number): string {
        switch (status) {
            case JobStatus.Running:
                return "Running...";
            case JobStatus.Succeeded:
                return "Succeeded";
            case JobStatus.Failed:
                return "Failed";
        }
    }
}

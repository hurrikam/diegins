import { Pipe, PipeTransform } from '@angular/core';
import { JobResult } from '../../common/models/jobResult';

@Pipe({ name: 'jobResult' })
export class JobResultPipe implements PipeTransform {

    transform(result: JobResult): string {
        switch (result) {
            case JobResult.Succeeded:
                return "Succeeded";
            case JobResult.Failed:
                return "Failed";
            case JobResult.Canceled:
                return "Canceled";
        }
    }
}

import { JobRepository, JobInstance } from '.';
import { JobInstanceInfo, JobResult } from '../../common/models';

export class JobRunner {

    private readonly runningJobs: JobInstance[] = [];
    private lastBuildNumber = 0;

    public constructor(private readonly jobRepository: JobRepository) {
    }

    public runJob(id: string): boolean {
        let job = this.jobRepository.getJob(id);
        if (!job) {
            return false;
        }
        this.lastBuildNumber++;
        let jobInstance = new JobInstance(job, this.lastBuildNumber);
        this.runningJobs.push(jobInstance);
        const self = this;
        jobInstance.run().then(() => {
            self.onJobEnded(jobInstance);
        });
        return true;
    }

    public cancelJob(id: string, number: number): boolean {
        let jobInstance = this.runningJobs.find((instance) => {
            return instance.id === id;
        });
        if (!jobInstance) {
            return false;
        }
        jobInstance.cancel();
        this.onJobEnded(jobInstance);
        return true;
    }

    public getRunningJobInfos(): JobInstanceInfo[] {
        return this.runningJobs.map((jobInstance) => {
            return <JobInstanceInfo>{
                id: jobInstance.id,
                currentStepIndex: jobInstance.currentStepIndex,
                displayName: jobInstance.id,
                isRunning: jobInstance.isRunning,
                number: jobInstance.number,
                result: jobInstance.result,
                stepCount: jobInstance.stepCount
            };
        });
    }

    private onJobEnded(jobInstance: JobInstance) {
    }
}

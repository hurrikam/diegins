'use strict';

import { ChildProcess, spawn } from 'child_process';
import JobStep from '../jobs/jobStep';
import JobResult from '../../common/models/jobResult';
import { promises } from 'fs';
import { join } from 'path';

export const ID = 'WindowsShell';

export default class WindowsShellStep implements JobStep {

    public onOutput: (output: string) => void;
    private childProcess: ChildProcess;
    private resolve: (jobResult: JobResult) => void;

    public async execute(script: string): Promise<JobResult> {
        const onExitHandler = this.onExit.bind(this);
        const onStdData = this.onStdout.bind(this);
        const batchFilePath = join(process.env.TEMP, 'windowsShell.bat');
        try {
            await promises.writeFile(batchFilePath, script);
        } catch (error) {
            this.onOutput(error.message);
            return JobResult.Failed;
        }
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.childProcess = spawn(batchFilePath, [], { shell: true });
            this.childProcess.on('error', this.onError.bind(this));
            this.childProcess.on('exit', onExitHandler);
            this.childProcess.on('message', onStdData);
            this.childProcess.stdout.on('data', onStdData);
            this.childProcess.stderr.on('data', onStdData);
        });
    }

    public cancel(): void {
        this.childProcess.kill();
        this.resolve(JobResult.Canceled);
    }

    private onError(error: Error): void {
        this.childProcess.removeAllListeners('exit');
        this.onOutput(error.message);
        this.resolve(JobResult.Failed);
    }

    private onExit(code: number, signal: string): void {
        if (code === 0) {
            this.resolve(JobResult.Succeeded);
            return;
        }
        this.resolve(JobResult.Failed);
    }

    private onStdout(data: any): void {
        if (!data) {
            return;
        }
        this.onOutput(data);
    }
}

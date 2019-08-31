'use strict';

import { exec, ChildProcess } from 'child_process';
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
            onStdData(error.message);
            return Promise.resolve(JobResult.Failed);
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            try {
                this.childProcess = exec(`cmd /c ${batchFilePath}`);
                this.childProcess.on('exit', onExitHandler);
                this.childProcess.on('close', onExitHandler);
                this.childProcess.on('message', onStdData);
                this.childProcess.stdout.on('data', onStdData);
                this.childProcess.stdout.on('readable', onStdData);
                this.childProcess.stderr.on('data', onStdData);
            } catch (error) {
                this.onOutput(error.message);
                resolve(JobResult.Failed);
            }
        });
    }

    public cancel(): void {
        this.childProcess.kill();
        this.resolve(JobResult.Canceled);
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

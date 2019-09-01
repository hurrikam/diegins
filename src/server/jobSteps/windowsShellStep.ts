'use strict';

import { ChildProcess, spawn } from 'child_process';
import { constants, promises } from 'fs';
import { join } from 'path';
import { v1 as uuid } from 'uuid';
import JobStep from '../jobs/jobStep';
import JobResult from '../../common/models/jobResult';

export const ID = 'windows-shell';
const TEMP_SCRIPT_FILENAME_PREFIX = 'diegins-script-';
const TEMP_SCRIPT_FILENAME_EXTENSION = '.bat';

export default class WindowsShellStep implements JobStep {

    public onOutput: (output: string) => void;
    private scriptFilePath: string;
    private childProcess: ChildProcess;
    private resolve: (jobResult: JobResult) => void;

    public async execute(script: string): Promise<JobResult> {
        const onExitHandler = this.onExit.bind(this);
        const onStdData = this.onStdout.bind(this);
        const scriptFileName = TEMP_SCRIPT_FILENAME_PREFIX + uuid() + TEMP_SCRIPT_FILENAME_EXTENSION;
        this.scriptFilePath = join(process.env.TEMP, scriptFileName);
        // tslint:disable-next-line:no-bitwise
        const writeFileFlag = constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY;
        try {
            await promises.writeFile(this.scriptFilePath, script, { flag: writeFileFlag });
        } catch (error) {
            this.onOutput(error.message);
            return JobResult.Failed;
        }
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.childProcess = spawn(this.scriptFilePath, [], { shell: true });
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

    private async deleteScriptFile(): Promise<void> {
        if (!this.scriptFilePath) {
            return;
        }
        try {
            await promises.unlink(this.scriptFilePath);
        // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }

    private onError(error: Error): void {
        this.childProcess.removeAllListeners();
        this.deleteScriptFile();
        this.onOutput(error.message);
        this.resolve(JobResult.Failed);
    }

    private onExit(code: number, signal: string): void {
        this.childProcess.removeAllListeners();
        this.deleteScriptFile();
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

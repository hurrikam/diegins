'use strict';

import { ChildProcess, spawn } from 'child_process';
import { constants, promises } from 'fs';
import { tmpdir } from 'os';
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
        const scriptFileName = TEMP_SCRIPT_FILENAME_PREFIX + uuid() + TEMP_SCRIPT_FILENAME_EXTENSION;
        const tempFolder = process.env.TEMP || tmpdir();
        this.scriptFilePath = join(tempFolder, scriptFileName);
        // tslint:disable-next-line:no-bitwise
        const fileOptions = {
            flag: constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
            mode: constants.S_IRUSR | constants.S_IXUSR
        };
        try {
            await promises.writeFile(this.scriptFilePath, script, fileOptions);
        } catch (error) {
            this.onOutput(error.message);
            return JobResult.Failed;
        }
        const onStdData = this.onStdout.bind(this);
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.childProcess = spawn(this.scriptFilePath, [], { shell: true });
            this.childProcess.on('error', this.onError.bind(this));
            this.childProcess.on('exit', this.onExit.bind(this));
            this.childProcess.on('message', onStdData);
            this.childProcess.stdout.on('data', onStdData);
            this.childProcess.stderr.on('data', onStdData);
        });
    }

    public cancel(): void {
        if (this.childProcess) {
            this.removeAllListeners();
            this.childProcess.kill();
        }
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

    private removeAllListeners(): void {
        this.childProcess.removeAllListeners();
        this.childProcess.stdout.removeAllListeners();
        this.childProcess.stderr.removeAllListeners();
    }

    private onError(error: Error): void {
        this.removeAllListeners();
        this.deleteScriptFile();
        this.onOutput(error.message);
        this.resolve(JobResult.Failed);
    }

    private onExit(code: number, signal: string): void {
        this.removeAllListeners();
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

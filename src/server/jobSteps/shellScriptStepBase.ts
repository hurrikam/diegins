'use strict';

import { ChildProcess, spawn } from 'child_process';
import { constants, promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { v1 as uuid } from 'uuid';
import JobStep from '../jobs/jobStep';
import JobResult from '../../common/models/jobResult';
import JobEnvironmentVariables from '../jobs/jobEnvironmentVariables';
import JobParameterValues from '../../common/models/jobParameterValues';

const TEMP_SCRIPT_FILENAME_PREFIX = 'diegins-script-';
const JOB_NUMBER_ENV_VARIABLE_NAME = 'DIEGINS_JOB_NUMBER';

export default abstract class ShellScriptStepBase implements JobStep {

    public onOutput: (output: string) => void;
    private scriptFilePath: string;
    private childProcess: ChildProcess;
    private resolve: (jobResult: JobResult) => void;

    protected constructor(private readonly scriptFileExtension: string) {
    }

    public async execute(
        script: string,
        jobEnvironmentVariables: JobEnvironmentVariables,
        jobParameterValues: JobParameterValues): Promise<JobResult> {
        try {
            this.validatePlatform();
        } catch (error) {
            this.onOutput(error.message);
            return JobResult.Failed;
        }
        const scriptFileName = TEMP_SCRIPT_FILENAME_PREFIX + uuid() + this.scriptFileExtension;
        const tempFolder = process.env.TEMP || tmpdir();
        this.scriptFilePath = join(tempFolder, scriptFileName);
        // tslint:disable:no-bitwise
        const fileOptions = {
            flag: constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
            mode: constants.S_IRUSR | constants.S_IXUSR
        };
        // tslint:enable:no-bitwise
        try {
            await fs.writeFile(this.scriptFilePath, script, fileOptions);
        } catch (error) {
            this.onOutput(error.message);
            return JobResult.Failed;
        }
        const onStdData = this.onStdout.bind(this);
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.childProcess = spawn(this.scriptFilePath, [], {
                cwd: jobEnvironmentVariables.workingDirectory,
                env: {
                    ...process.env,
                    [JOB_NUMBER_ENV_VARIABLE_NAME]: jobEnvironmentVariables.number.toString(),
                    ...jobParameterValues
                },
                shell: true
            });
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

    protected abstract validatePlatform(): void;

    private async deleteScriptFile(): Promise<void> {
        if (!this.scriptFilePath) {
            return;
        }
        try {
            await fs.unlink(this.scriptFilePath);
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

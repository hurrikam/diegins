import { spawn } from 'child_process';
import { JobStep } from '../jobs';

export class dosShellJobStep implements JobStep {

    public readonly id = 'dosShell';

    execute(): Promise<JobStepResult> {
        const bat = spawn('cmd.exe', ['/c', 'my.bat']);
        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });
    }
}
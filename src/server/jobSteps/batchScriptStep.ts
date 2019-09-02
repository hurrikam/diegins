'use strict';

import ShellScriptStepBase from './shellScriptStepBase';

export const ID = 'batch-script';
const BATCH_SCRIPT_EXTENSION = '.bat';

export default class BatchScriptStep extends ShellScriptStepBase {

    constructor() {
        super(BATCH_SCRIPT_EXTENSION);
    }

    protected validatePlatform(): void {
        if (process.platform !== 'win32') {
            throw new Error('This step can only run on Windows platforms.');
        }
    }
}

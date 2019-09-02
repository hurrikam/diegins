'use strict';

import ShellScriptStepBase from './shellScriptStepBase';

export const ID = 'shell-script';
const SHELL_SCRIPT_EXTENSION = '.sh';

export default class ShellScriptStep extends ShellScriptStepBase {

    constructor() {
        super(SHELL_SCRIPT_EXTENSION);
    }

    protected validatePlatform(): void {
        if (process.platform === 'win32') {
            throw new Error('This step cannot run on Windows platforms.');
        }
    }
}

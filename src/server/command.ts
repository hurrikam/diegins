'use strict';

import { Request, Response } from 'express';

export default interface Command {
    readonly endpoint: string;
    readonly method: string;
    execute(request: Request, response: Response): void;
}

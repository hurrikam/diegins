'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_LOG } from '../../common/api/endpoints';
import { GET } from '../httpMethods';
import JobLogReader from '../jobs/jobLogReader';

export default class GetJobLogCommand implements Command {

    public readonly endpoint = GET_JOB_LOG;
    public readonly method = GET;

    constructor(private readonly jobLogReader: JobLogReader) {
        if (!jobLogReader) {
            throw new Error('jobLogReader not specified');
        }
    }

    public async execute(request: Request, response: Response): Promise<void> {
        const jobNumber = request.params.jobNumber;
        try {
            const logBuffer = await this.jobLogReader.getLog(jobNumber);
            response.send(logBuffer);
        } catch (error) {
            response.status(400);
            response.send(error.message);
        }
    }
}

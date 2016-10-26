import * as dieginsServer from './server/server';
import { getJobRepository, getJobStepRepository } from './server/jobs';

const jobStepRepository = getJobStepRepository();
jobStepRepository.initialize();

const jobRepository = getJobRepository();
jobRepository.initialize();

const port: number = process.env.port || 1337;
const server = new dieginsServer.Server(port);
server.start();

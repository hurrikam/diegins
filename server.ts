import * as dieginsServer from './server/server';
import { getJobRepository } from './server/jobs';

let jobRepository = getJobRepository();
jobRepository.initialize();

let port: number = process.env.port || 1337;
let server = new dieginsServer.Server(port);
server.start();

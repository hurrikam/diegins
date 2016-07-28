import dieginsServer = require('./server/server');

let port: number = process.env.port || 1337;
let server = new dieginsServer.Server(port);
server.start();


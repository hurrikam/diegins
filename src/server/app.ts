'use strict';

import * as express from 'express';
import { join } from 'path';
import { urlencoded } from 'express';
import { createServer } from 'http';
import { initializeServices } from './services';
import CommandManager from './commandManager';
import { createCommands } from './commandFactory';
import { DIST_FOLDER } from './jobs/jobFileConstants';

async function start() {
    await initializeServices();
    const port = 1337;
    const expressApp = express();
    expressApp.use(urlencoded({ extended: true }));
    expressApp.use(express.static(DIST_FOLDER));
    expressApp.get('*', (req, res) => res.sendFile(join(DIST_FOLDER, 'index.html')));
    const server = createServer(expressApp);
    const commandManager = new CommandManager(expressApp);
    const commands = createCommands();
    commands.forEach(command => commandManager.registerCommand(command));
    server.listen(port);
}

start();

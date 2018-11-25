'use strict';

import * as express from 'express';
import { urlencoded } from 'express';
import { createServer } from 'http';
import { initializeServices } from './services';
import CommandManager from './commandManager';
import { createCommands } from './commandFactory';

const DIST_ROOT = 'dist';

async function start() {
    await initializeServices();
    const port = 1337;
    const expressApp = express();
    expressApp.use(urlencoded({ extended: true }));
    expressApp.use(express.static(DIST_ROOT));
    const server = createServer(expressApp);
    const commandManager = new CommandManager(expressApp);
    const commands = createCommands();
    commands.forEach(command => commandManager.registerCommand(command));
    server.listen(port);
}

start();

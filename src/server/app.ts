'use strict';

import * as express from 'express';
import { urlencoded } from 'express';
import { createServer } from 'http';
import { initializeService } from './services';
import CommandManager from './commandManager';
import { createCommands } from './commandFactory';

const DIST_ROOT = 'dist';

initializeService();

const port = 1337;
const expressApp = express();
expressApp.use(urlencoded({ extended: true }));
expressApp.use(express.static(DIST_ROOT));
const server = createServer(expressApp);
const commandManager = new CommandManager(expressApp);
const commands = createCommands();
commands.forEach(command => commandManager.registerCommand(command));
server.listen(port);

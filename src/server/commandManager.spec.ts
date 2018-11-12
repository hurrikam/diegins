'use strict';

import { Application, Request, Response } from 'express';
import Command from './command';
import { DELETE, GET, POST } from './httpMethods';
import CommandManager from './commandManager';

const TEST_COMMAND_ENDPOINT = 'test/endpoint';

function createMockExpressApp(): Application {
    return {
        delete: jest.fn(),
        get: jest.fn(),
        post: jest.fn()
    } as any;
}

function createTestCommand(method: string): Command {
    return  {
        endpoint: TEST_COMMAND_ENDPOINT,
        method,
        execute: jest.fn()
    };
}

describe('CommandManager', () => {

    describe('registerCommand', () => {

        test('should ensure a DELETE command is called for the right endpoint and HTTP method', () => {
            const expressApp = createMockExpressApp();
            const commandManager = new CommandManager(expressApp);
            const command = createTestCommand(DELETE);
            commandManager.registerCommand(command);
            expect(expressApp.get).not.toHaveBeenCalled();
            expect(expressApp.post).not.toHaveBeenCalled();
            expect(expressApp.delete).toHaveBeenCalledTimes(1);
            expect(expressApp.delete).toHaveBeenCalledWith(TEST_COMMAND_ENDPOINT, expect.any(Function));
            const commandHandler = (expressApp.delete as any).mock.calls[0][1];
            const request = {};
            const response = {};
            commandHandler(request, response);
            expect(command.execute).toHaveBeenCalledTimes(1);
            expect(command.execute).toHaveBeenCalledWith(request, response);
        });

        test('should ensure a GET command is called for the right endpoint and HTTP method', () => {
            const expressApp = createMockExpressApp();
            const commandManager = new CommandManager(expressApp);
            const command = createTestCommand(GET);
            commandManager.registerCommand(command);
            expect(expressApp.delete).not.toHaveBeenCalled();
            expect(expressApp.post).not.toHaveBeenCalled();
            expect(expressApp.get).toHaveBeenCalledTimes(1);
            expect(expressApp.get).toHaveBeenCalledWith(TEST_COMMAND_ENDPOINT, expect.any(Function));
            const commandHandler = (expressApp.get as any).mock.calls[0][1];
            const request = {};
            const response = {};
            commandHandler(request, response);
            expect(command.execute).toHaveBeenCalledTimes(1);
            expect(command.execute).toHaveBeenCalledWith(request, response);
        });

        test('should ensure a POST command is called for the right endpoint and HTTP method', () => {
            const expressApp = createMockExpressApp();
            const commandManager = new CommandManager(expressApp);
            const command = createTestCommand(POST);
            commandManager.registerCommand(command);
            expect(expressApp.delete).not.toHaveBeenCalled();
            expect(expressApp.get).not.toHaveBeenCalled();
            expect(expressApp.post).toHaveBeenCalledTimes(1);
            expect(expressApp.post).toHaveBeenCalledWith(TEST_COMMAND_ENDPOINT, expect.any(Function));
            const commandHandler = (expressApp.post as any).mock.calls[0][1];
            const request = {};
            const response = {};
            commandHandler(request, response);
            expect(command.execute).toHaveBeenCalledTimes(1);
            expect(command.execute).toHaveBeenCalledWith(request, response);
        });
    });
});

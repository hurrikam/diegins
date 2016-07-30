import http = require('http');
import * as server from './index';

const MinimumPortNumber = 0;
const MaximumPortNumber = 65535;

export class Server {

    private httpServer: http.Server;
    private fileRequestHandler: server.FileRequestHandler;
    private requestUrlNormalizer: server.RequestUrlNormalizer;

    public constructor(private port: number) {
        if (port < MinimumPortNumber || port > MaximumPortNumber) {
            throw new Error(`The 'port' parameter must be a value in the range (inclusive) ` +
                `${MinimumPortNumber} and ${MaximumPortNumber}`);
        }
        this.fileRequestHandler = new server.FileRequestHandler();
        this.requestUrlNormalizer = new server.RequestUrlNormalizer();
    }

    private handleRequest(request: http.ServerRequest, response: http.ServerResponse): void {
        let url = this.requestUrlNormalizer.normalize(request.url);
        if (this.fileRequestHandler.isFileRequest(url)) {
            this.fileRequestHandler.serveFile(url, response);
        }
    }

    public start(): void {
        this.httpServer = http.createServer((request, response) => {
            this.handleRequest(request, response);
        });
        this.httpServer.listen(this.port);
    }
}
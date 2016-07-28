import fs = require('fs');
import http = require('http');
import * as server from './index';

const PagesRootPath = './client/';
const ResponseStatusOK = 200;
const ContentTypeTextHtml = 'text/html';
const DefaultPage = 'index.html';

export class PageRequestHandler {

    public constructor() {
    }

    private getPageFullPath(pageRelativePath: string) {
        if (!pageRelativePath) {
            pageRelativePath = DefaultPage;
        }
        return PagesRootPath + pageRelativePath;
    }

    public isPageRequest(pageRelativePath: string): boolean {
        let pagePath = this.getPageFullPath(pageRelativePath);
        return fs.existsSync(pagePath);
    }

    public servePage(pageRelativePath: string, response: http.ServerResponse): void {
        let pagePath = this.getPageFullPath(pageRelativePath);
        response.writeHead(ResponseStatusOK, { 'Content-Type': ContentTypeTextHtml });
        response.end(fs.readFileSync(pagePath));
    }
}
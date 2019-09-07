'use strict';

export function appendToServerUrl(path: string): string {
    return window.location.origin + path;
}

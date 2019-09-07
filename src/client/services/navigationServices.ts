'use strict';

import { appendToServerUrl } from './urlServices';

export function navigateTo(path: string): void {
    document.location.href = appendToServerUrl(path);
}

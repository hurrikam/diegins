'use strict';

export function isBlankString(value: string): boolean {
    if (typeof(value) !== 'string') {
        return true;
    }
    if (!value.trim()) {
        return true;
    }
    return false;
}

export function stringContainsSpaces(value: string): boolean {
    return value
        .trim()
        .indexOf(' ') >= 0;
}

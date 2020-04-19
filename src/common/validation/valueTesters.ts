'use strict';

export function isBlankString(value: string): boolean {
    if (!isString(value)) {
        return true;
    }
    if (!value.trim()) {
        return true;
    }
    return false;
}

export function isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

export function isString(value: string): boolean {
    return typeof(value) === 'string';
}

export function isUndefined(value: any): boolean {
    return value === undefined;
}

export function stringContainsSpaces(value: string): boolean {
    return value
        .trim()
        .indexOf(' ') >= 0;
}

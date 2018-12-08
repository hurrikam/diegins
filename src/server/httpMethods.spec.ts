'use strict';

import { DELETE, GET, POST } from './httpMethods';

describe('httpMethods', () => {

    test('defines the expected HTTP methods', () => {
        expect(DELETE).toBe('delete');
        expect(GET).toBe('get');
        expect(POST).toBe('post');
    });
});

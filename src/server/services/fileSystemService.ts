'use strict';

import { PathLike } from 'fs';

export default interface FileSystemService {
    mkdir: (path: PathLike, options: { recursive?: boolean, mode?: {} | number}) => Promise<void>;
    readdir: (path: PathLike, options: { recursive?: boolean, mode?: {} | number}) => Promise<Array<string>>;
    readFile: (path: PathLike, encoding: string) => Promise<string>;
    writeFile: (path: PathLike, encoding: string) => Promise<void>;
}

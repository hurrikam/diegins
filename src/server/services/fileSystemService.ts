'use strict';

import { PathLike } from 'fs';

export default interface FileSystemService {
    mkdir: (path: PathLike, options: { recursive?: boolean, mode?: {} | number}) => Promise<void>;
}

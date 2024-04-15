import fs from 'fs';
import path from 'path';

export const readFileSyncFromPublicStaticFolder = (filePath: string): Uint8Array => {
  return fs.readFileSync(path.join(process.cwd(), 'public/static', filePath));
};

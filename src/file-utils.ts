import * as zlib from 'zlib';
import * as fs from 'fs';
import { promisify } from 'util';

export async function fileSizeInBytes(thePath: string): Promise<number> {
  let stats: fs.Stats = null;
  try {
    stats = await promisify(fs.stat)(thePath);
    return stats.size;
  } catch (err) { }
  return 0;
}

export async function delFileIfExists(thePath: string): Promise<void> {
  try {
    if (await pathExists(thePath)) {
      await promisify(fs.unlink)(thePath);
    }
  } catch (err) {
    throw err;
  }
}

/** Returns true if path exists.  Otherwise, returns false. */
export async function pathExists(thePath: string): Promise<boolean> {
  let stats: fs.Stats = null;
  try {
    stats = await promisify(fs.stat)(thePath);
    return true;
  } catch (err) { }
  return false;
}

/** Number of milliseconds since file or directory was last
 * updated.  If file does not exist, Infinity is returned.
 */
export async function msSinceLastUpdate(thePath: string): Promise<number> {
  let stats: fs.Stats = null;
  try {
    const { mtime } = await promisify(fs.stat)(thePath);
    return Date.now() - mtime.getTime();
  } catch (err) { }
  return Infinity;
}

export const gzToJson = async filePath => {
  const fileStream = fs.createReadStream(filePath);
  const gunzip = zlib.createGunzip();
  async function* chunksToJson(iterable) {
      let buf = '';
      for await (const chunk of iterable) buf += chunk;
      yield JSON.parse(buf);
  }
  const { value } = await chunksToJson(fileStream.pipe(gunzip)).next();
  return value;
}
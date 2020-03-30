/**
 * This module is not meant to be used currently due to a dependency on the gdal package which
 * currently only compiles in node 10.x.  However, it can be used by installing
 * axios and shp2json, uncommenting a few lines below, and compiling against node 10.x
 */

// import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
// import * as shp2json from 'shp2json';
import { fileSizeInBytes, msSinceLastUpdate } from './file-utils';
import Debug from 'debug';
const debug = Debug('nat-earth-geojson-cache');

const finalRegionFilePath = path.resolve(__dirname, '../data/ne_10m_admin_1_states_provinces.json');
const tempRegionFilePath = path.resolve(__dirname, '../data/ne_10m_admin_1_states_provinces.temp.json');
const regionDbUrl = "https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip";
const msPerDay = 1000*60*60*24;
const daysBetweenRegionUpdates = 30;
const msBetweenRegionUpdates = daysBetweenRegionUpdates*msPerDay;  // 30 days between updates

/** Returns true if final GeoJson db file exists and size > 0 bytes. */
async function okRegionFile(): Promise<boolean> {
  return await fileSizeInBytes(finalRegionFilePath) > 0;
}

/** Returns true if the regions GeoJson db file exists, and is
 * greater than 0 bytes and is not older than 30 days old.
 */
async function isRegionFileCurrent(): Promise<boolean> {
  return (
    (await okRegionFile()) &&
    ((await msSinceLastUpdate(finalRegionFilePath)) < msBetweenRegionUpdates)
  ); 
}
export { isRegionFileCurrent as _isRegionFileCurrent }

/** When the regions GeoJson file does not exist, or when when it is
 * more than 30 days since last update, the regions GeoJson file is
 * downloaded to a temporary file and is renamed to the final file
 * if success.  If not successful, the original file remains.
 * Returns true on success.
 */
export async function updateRegionFile(): Promise<boolean> {
  if (await isRegionFileCurrent()) {
    const daysOld = ((await msSinceLastUpdate(finalRegionFilePath))/msPerDay).toFixed(1);
    debug(`Skipping download since ${finalRegionFilePath} already exists ` +
      `and is ${daysOld} < ${daysBetweenRegionUpdates} days old.`);
    return true;
  }
 
  debug(`Downloading\n  ${regionDbUrl}\n  to\n  ${tempRegionFilePath}`);
  const resp = null;
  //const resp = await axios({
  //   method: "get",
  //   url: regionDbUrl,
  //   responseType: "stream"
  // });
  const ws = fs.createWriteStream(tempRegionFilePath);
  // shp2json(resp.data).pipe(ws);
  return new Promise(function (resolve, reject) {
    ws.on('finish', async () => {
      debug(`Finished downloading ${tempRegionFilePath} with status ${resp.status}.`);
      await promisify(fs.rename)(tempRegionFilePath, finalRegionFilePath);
      debug(`Renamed to ${finalRegionFilePath}`);
      resolve(true);
    });
    ws.on('error', (err: Error) => {
      debug(`Download to ${tempRegionFilePath} failed: ${err.toString()}`);
      reject(err);
    });
  });
}

// Exported for unit testing purposes.  Not meant to be used publicly.
export { finalRegionFilePath as _finalRegionFilePath }
export { tempRegionFilePath as _tempRegionFilePath }
export { okRegionFile as _okRegionFile }
/**
 * This testing module is not meant to be used currently due to a dependency on the gdal package which
 * currently only compiles in node 10.x.  However, it can be used by installing
 * axios and shp2json, uncommenting a few lines in region-db-update.ts, and compiling against node 10.x
 */

import { _finalRegionFilePath, _tempRegionFilePath, _okRegionFile, _isRegionFileCurrent,
  updateRegionFile } from '../src/region-db-update';
import { delFileIfExists } from '../src/file-utils';
import 'mocha';
import { expect } from 'chai';

/** Deletes final and temporary GeoJson db files if they exist.  Returns void. */
async function delRegionFiles(): Promise<void> {
  await delFileIfExists(_tempRegionFilePath);
  await delFileIfExists(_finalRegionFilePath);
}

describe ('Region geo database auto-caching', function() {

  it('When no cached regions file exist, region file reported as not current', async function() {
    await delRegionFiles();
    const isCurrent = await _isRegionFileCurrent();
    expect(isCurrent).to.be.false;
  });

  it('When no cached regions file exist, region file reported as not ok', async function () {
    await delRegionFiles();
    const isOk = await _okRegionFile();
    expect(isOk).to.be.false;
  });

  it('Updates are successful when no cached file exists initially.', async function() {
    this.timeout(30000); // allow 30 seconds just for this test
    await delRegionFiles();
    const updateSuccess = await updateRegionFile();
    expect(updateSuccess).to.be.true;
    const isCurrent = await _isRegionFileCurrent();
    expect(isCurrent).to.be.true;
    const isOk = await _okRegionFile();
    expect(isOk).to.be.true;
    const updateSuccess2 = await updateRegionFile();
    expect(updateSuccess2).to.be.true;
    const isCurrent2 = await _isRegionFileCurrent();
    expect(isCurrent2).to.be.true;
    const isOk2 = await _okRegionFile();
    expect(isOk2).to.be.true;
  });

});
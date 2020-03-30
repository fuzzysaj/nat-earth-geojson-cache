import { getAdmin1GeoJson } from '../src/load-geojson';
import 'mocha';
import { expect } from 'chai';

// test that both database files are downloaded automtically when then do not exist
// file names will be hard-coded
// we will assume we can use the /data directory
// need to test use of data directory when this is used as an npm package

describe('load-geojson', function() {

  describe('Load GeoJSON file into memory', function() {
    it('When the cached admin1 GeoJSON file is loaded, it gets loaded', async function() {
      const admin1Geo = await getAdmin1GeoJson();
      expect(admin1Geo).to.not.be.null;
      expect(admin1Geo.features).to.not.be.null;
      expect(admin1Geo.features).to.have.length.greaterThan(0);
    });

  });

});
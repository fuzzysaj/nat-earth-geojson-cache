# @fuzzysaj/nat-earth-geojson-cache

[![npm (scoped)](https://img.shields.io/npm/v/@fuzzysaj/nat-earth-geojson-cache.svg)](https://www.npmjs.com/package/@fuzzysaj/nat-earth-geojson-cache) [![Build Status](https://travis-ci.org/fuzzysaj/nat-earth-geojson-cache.svg?branch=master)](https://travis-ci.org/fuzzysaj/nat-earth-geojson-cache) [![dependencies Status](https://david-dm.org/fuzzysaj/nat-earth-geojson-cache/status.svg)](https://david-dm.org/fuzzysaj/nat-earth-geojson-cache) [![code coverage]( https://img.shields.io/codecov/c/github/fuzzysaj/nat-earth-geojson-cache.svg)](https://codecov.io/gh/fuzzysaj/nat-earth-geojson-cache)

This package stores a copy of
[Admin 1 - States, Provices](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/)
shapefile, but converted to GeoJSON for easy of use.  The data comes from
[Natural Earth](https://www.naturalearthdata.com/) and is distributed as public domain.
Source shapefile is version 4.1.0, last updated 2018-05-21.

This module also includes source code for automatically updating the JSON file by
downloading the latest shapefile from Natural Earth and converting to GeoJSON via
the (shp2json)[https://github.com/substack/shp2json] package.  However, as of April 2020,
this package depends on [gdal](https://www.npmjs.com/package/gdal) which can only
be compiled with Node 10.x.  Therefore, we do not include shp2json in package.json
and do not compile or test this code at this time.

## Install

$ npm install @fuzzysaj/nat-earth-geojson-cache

## Usage

```ts
import { getAdmin1GeoJson } from '@fuzzysaj/nat-earth-geojson-cache'

(async ()=> {
  const admin1Geo = await getAdmin1GeoJson();
  /* ->
  {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [ [ [ 47.668128703000029, 28.533504944000022 ],
                         [ 47.659808797000032, 28.560040792000031 ],
                         ...
                        ] ]
        },
        properties: { name: 'Arizona', iso_a2 : 'US', postal: 'AZ', ... }
      }, ...
    ]
  }
  */
})();
```

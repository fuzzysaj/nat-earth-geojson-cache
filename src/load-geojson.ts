import { FeatColl } from './NatEarthFeature';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

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

export async function getAdmin1GeoJson(): Promise<FeatColl> {
    const filePath = path.join(__dirname, '../data/ne_10m_admin_1_states_provinces.json.gz');
    const obj = await gzToJson(filePath) as FeatColl;
    return obj;
}

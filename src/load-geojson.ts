import { gzToJson } from './file-utils';
import * as path from 'path';
import { FeatColl } from './NatEarthFeature';

export async function getAdmin1GeoJson(): Promise<FeatColl> {
    const filePath = path.join(__dirname, '../data/ne_10m_admin_1_states_provinces.json.gz');
    const obj = await gzToJson(filePath) as FeatColl;
    return obj;
}

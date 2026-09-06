export interface IndustrialFacility {
  id: string;
  name: string;
  type: string;
  category: 'Petrochemical / Refinery' | 'Chemical Processing' | 'Steel & Metallurgical' | 'Thermal Power' | 'Manufacturing / SEZ';
  lon: number;
  lat: number;
  osm_id: string;
  associatedEventId?: string;
  proximity_km?: number;
  status: 'Operational' | 'Continuous Heavy Emitter' | 'High Hazard Tier 1';
}

export const DEMO_FACILITIES: IndustrialFacility[] = [
  // ─── Direct context for EVT-1048 (0.8 km distance) ───
  {
    id: 'FAC-JAM-01',
    name: 'Reliance Jamnagar Complex & Petrochemicals',
    type: 'Petrochemical & Crude Refining Complex',
    category: 'Petrochemical / Refinery',
    lon: 70.076,
    lat: 22.474,
    osm_id: 'osm-node-39281920',
    associatedEventId: 'EVT-1048',
    proximity_km: 0.8,
    status: 'High Hazard Tier 1',
  },
  {
    id: 'FAC-JAM-02',
    name: 'Nayara Energy Refinery Terminal',
    type: 'Crude Storage & Processing',
    category: 'Petrochemical / Refinery',
    lon: 69.830,
    lat: 22.380,
    osm_id: 'osm-node-40192831',
    status: 'Operational',
  },

  // ─── Direct context for EVT-0921 (0.4 km distance) ───
  {
    id: 'FAC-AHM-01',
    name: 'Vatva GIDC Chemical Processing Cluster',
    type: 'Industrial Dye & Intermediate Plant',
    category: 'Chemical Processing',
    lon: 72.543,
    lat: 23.023,
    osm_id: 'osm-node-19283746',
    associatedEventId: 'EVT-0921',
    proximity_km: 0.4,
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-AHM-02',
    name: 'Naroda Industrial Estate',
    type: 'Chemical & Engineering Facility',
    category: 'Chemical Processing',
    lon: 72.665,
    lat: 23.072,
    osm_id: 'osm-node-19283799',
    status: 'Operational',
  },

  // ─── Context near EVT-1182 (8.6 km distance) ───
  {
    id: 'FAC-NGP-01',
    name: 'Butibori Heavy Industrial Estate',
    type: 'Manufacturing & Synthetic Processing',
    category: 'Manufacturing / SEZ',
    lon: 78.985,
    lat: 20.925,
    osm_id: 'osm-node-59281039',
    associatedEventId: 'EVT-1182',
    proximity_km: 8.6,
    status: 'Operational',
  },

  // ─── Strategic National Industrial Corridors ───
  {
    id: 'FAC-DHJ-01',
    name: 'Dahej SEZ Chemical Port & Petrochem Terminal',
    type: 'Petrochemical Cracker & LNG Terminal',
    category: 'Petrochemical / Refinery',
    lon: 72.585,
    lat: 21.715,
    osm_id: 'osm-node-60192841',
    status: 'High Hazard Tier 1',
  },
  {
    id: 'FAC-HZR-01',
    name: 'Hazira Heavy Industrial Complex',
    type: 'Integrated Steel & Gas Processing',
    category: 'Steel & Metallurgical',
    lon: 72.695,
    lat: 21.115,
    osm_id: 'osm-node-60192855',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-MUM-01',
    name: 'Trombay HPCL / BPCL Refinery Complex',
    type: 'Petroleum Refining & Storage',
    category: 'Petrochemical / Refinery',
    lon: 72.915,
    lat: 19.015,
    osm_id: 'osm-node-71029381',
    status: 'High Hazard Tier 1',
  },
  {
    id: 'FAC-BHL-01',
    name: 'SAIL Bhilai Integrated Steel Plant',
    type: 'Blast Furnace & Steel Mill',
    category: 'Steel & Metallurgical',
    lon: 81.385,
    lat: 21.195,
    osm_id: 'osm-node-81029344',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-KRB-01',
    name: 'NTPC Korba Super Thermal Power Plant',
    type: 'Coal-Fired Mega Power Station (2,600 MW)',
    category: 'Thermal Power',
    lon: 82.685,
    lat: 22.355,
    osm_id: 'osm-node-81029399',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-RKL-01',
    name: 'SAIL Rourkela Steel Complex',
    type: 'Integrated Steel Works',
    category: 'Steel & Metallurgical',
    lon: 84.865,
    lat: 22.225,
    osm_id: 'osm-node-91029311',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-JMS-01',
    name: 'Tata Steel Jamshedpur Works',
    type: 'Integrated Steel & Coking Facility',
    category: 'Steel & Metallurgical',
    lon: 86.205,
    lat: 22.805,
    osm_id: 'osm-node-91029355',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-SNG-01',
    name: 'NTPC Singrauli Super Thermal Station',
    type: 'Super Thermal Power (2,000 MW)',
    category: 'Thermal Power',
    lon: 82.675,
    lat: 24.125,
    osm_id: 'osm-node-92019283',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-VZG-01',
    name: 'RINL Visakhapatnam Steel Plant',
    type: 'Shore-Based Integrated Steel Works',
    category: 'Steel & Metallurgical',
    lon: 83.185,
    lat: 17.655,
    osm_id: 'osm-node-93019284',
    status: 'Continuous Heavy Emitter',
  },
  {
    id: 'FAC-CHN-01',
    name: 'CPCL Manali Petrochemical Complex',
    type: 'Refinery & Aromatic Processing',
    category: 'Petrochemical / Refinery',
    lon: 80.265,
    lat: 13.165,
    osm_id: 'osm-node-94019285',
    status: 'High Hazard Tier 1',
  },
  {
    id: 'FAC-PNP-01',
    name: 'IOCL Panipat Mega Refinery',
    type: 'Crude Refining & Petrochem Cracker',
    category: 'Petrochemical / Refinery',
    lon: 76.975,
    lat: 29.395,
    osm_id: 'osm-node-95019286',
    status: 'High Hazard Tier 1',
  },
];

export function getFacilitiesGeoJson(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: DEMO_FACILITIES.map((fac) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [fac.lon, fac.lat],
      },
      properties: {
        id: fac.id,
        name: fac.name,
        type: fac.type,
        category: fac.category,
        osm_id: fac.osm_id,
        associatedEventId: fac.associatedEventId || null,
        proximity_km: fac.proximity_km || null,
        status: fac.status,
      },
    })),
  };
}

/**
 * Returns GeoJSON LineString between an event and its nearby industrial facility
 * Used to visualize the 0.8 km context link for EVT-1048
 */
export function getContextualLinkGeoJson(
  eventCoord: [number, number],
  facilityCoord: [number, number],
  properties: Record<string, any> = {}
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [eventCoord, facilityCoord],
        },
        properties,
      },
    ],
  };
}

/**
 * Tactical GeoJSON boundary vectors for India & Major Industrial State Zones
 * Provides military-grade / tactical GIS styling on top of the dark CARTO basemap
 */

export const INDIA_TACTICAL_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Outer India boundary approximation
    {
      type: 'Feature',
      properties: { name: 'India National Operational Area', type: 'national' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.8, 37.0], [77.2, 35.8], [78.6, 35.5], [80.3, 31.0], [81.0, 30.2],
            [88.0, 27.5], [88.8, 27.3], [91.5, 27.8], [93.5, 28.5], [96.0, 28.3],
            [97.4, 28.0], [97.0, 26.5], [95.2, 25.8], [94.5, 24.0], [93.0, 24.0],
            [92.5, 22.0], [91.5, 23.5], [89.0, 21.6], [87.0, 21.5], [85.0, 19.5],
            [83.0, 18.0], [80.3, 16.0], [80.2, 13.0], [79.8, 10.5], [78.0, 8.1],
            [77.5, 8.1], [76.5, 9.5], [75.0, 12.0], [73.5, 16.0], [72.8, 19.0],
            [72.6, 21.0], [70.0, 21.0], [69.0, 22.0], [68.5, 23.8], [70.5, 24.5],
            [71.0, 26.0], [70.0, 27.5], [72.0, 29.5], [74.0, 31.5], [74.5, 33.0],
            [74.8, 37.0]
          ]
        ]
      }
    },
    // Strategic Regional State Tactical Division Lines
    {
      type: 'Feature',
      properties: { name: 'Gujarat Industrial Belt', code: 'GJ' },
      geometry: {
        type: 'LineString',
        coordinates: [[68.5, 23.8], [71.0, 24.5], [72.5, 24.0], [74.0, 22.0], [73.0, 21.0], [72.6, 21.0]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Maharashtra Industrial Corridor', code: 'MH' },
      geometry: {
        type: 'LineString',
        coordinates: [[72.8, 19.0], [74.0, 22.0], [78.0, 21.5], [80.0, 21.0], [80.5, 19.0], [77.5, 16.0], [73.5, 16.0]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Rajasthan Energy & Mining', code: 'RJ' },
      geometry: {
        type: 'LineString',
        coordinates: [[71.0, 26.0], [72.5, 24.0], [76.0, 24.0], [77.5, 27.5], [74.0, 30.0], [72.0, 29.5]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Madhya Pradesh Central Hub', code: 'MP' },
      geometry: {
        type: 'LineString',
        coordinates: [[74.0, 22.0], [76.0, 24.0], [78.5, 25.5], [82.0, 24.5], [82.8, 23.8], [80.0, 21.0], [78.0, 21.5]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Chhattisgarh Steel & Power Corridor', code: 'CG' },
      geometry: {
        type: 'LineString',
        coordinates: [[80.0, 21.0], [82.8, 23.8], [84.0, 23.0], [83.5, 19.0], [81.5, 18.0], [80.5, 19.0]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Odisha Eastern Industrial Sector', code: 'OD' },
      geometry: {
        type: 'LineString',
        coordinates: [[84.0, 23.0], [86.5, 22.0], [87.0, 21.5], [85.0, 19.5], [83.0, 18.0], [83.5, 19.0]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Jharkhand Metallurgical Belt', code: 'JH' },
      geometry: {
        type: 'LineString',
        coordinates: [[83.5, 24.0], [87.5, 24.5], [86.8, 22.2], [84.0, 23.0]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Telangana & Andhra Industrial Belt', code: 'TS-AP' },
      geometry: {
        type: 'LineString',
        coordinates: [[77.5, 16.0], [80.5, 19.0], [83.0, 18.0], [80.3, 16.0], [80.2, 13.5], [78.0, 13.5]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Tamil Nadu Southern Corridor', code: 'TN' },
      geometry: {
        type: 'LineString',
        coordinates: [[80.2, 13.5], [78.0, 13.5], [76.5, 11.5], [77.5, 8.1], [78.0, 8.1], [79.8, 10.5]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Punjab & Haryana Agro-Industrial Belt', code: 'PB-HR' },
      geometry: {
        type: 'LineString',
        coordinates: [[74.0, 30.0], [77.5, 30.5], [77.5, 27.5], [76.0, 28.0]]
      }
    }
  ]
};

// Strategic Geographic Region Annotations for tactical map labels
export const INDIA_REGION_LABELS = [
  { name: 'GUJARAT INDUSTRIAL SECTOR', coord: [70.8, 22.2], code: 'SEC-GJ' },
  { name: 'MAHARASHTRA INDUSTRIAL CORRIDOR', coord: [74.5, 19.2], code: 'SEC-MH' },
  { name: 'CHHATTISGARH THERMAL & STEEL', coord: [82.2, 21.8], code: 'SEC-CG' },
  { name: 'ODISHA METALS & MINING', coord: [84.8, 21.0], code: 'SEC-OD' },
  { name: 'JHARKHAND COAL & STEEL', coord: [85.8, 23.4], code: 'SEC-JH' },
  { name: 'TELANGANA PHARMA HUB', coord: [78.5, 17.8], code: 'SEC-TS' },
  { name: 'ANDHRA COASTAL PORT & STEEL', coord: [82.8, 16.8], code: 'SEC-AP' },
  { name: 'TAMIL NADU INDUSTRIAL CORRIDOR', coord: [78.8, 11.2], code: 'SEC-TN' },
  { name: 'NORTHERN AGRO-INDUSTRIAL BELT', coord: [75.8, 29.8], code: 'SEC-NR' },
  { name: 'RAJASTHAN ENERGY & MINING', coord: [73.5, 26.2], code: 'SEC-RJ' },
];

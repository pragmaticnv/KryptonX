export interface ThermalObservation {
  id: string;
  lon: number;
  lat: number;
  frp: number; // Fire Radiative Power (MW)
  brightness: number; // Kelvin
  confidence: number;
  cluster: string;
  sensor: 'VIIRS-SNPP' | 'VIIRS-NOAA20' | 'MODIS';
  timestamp: string;
  associatedEventId?: string;
}

export const DEMO_THERMAL_OBSERVATIONS: ThermalObservation[] = [
  // ─── 1. GUJARAT / JAMNAGAR INDUSTRIAL BELT (HERO EVT-1048 CLUSTER) ───
  { id: 'OBS-1048-01', lon: 70.070, lat: 22.470, frp: 48.2, brightness: 358.4, confidence: 0.91, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:35:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-02', lon: 70.062, lat: 22.465, frp: 39.7, brightness: 351.2, confidence: 0.90, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T20:20:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-03', lon: 70.074, lat: 22.478, frp: 42.1, brightness: 354.0, confidence: 0.89, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T19:10:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-04', lon: 70.081, lat: 22.461, frp: 31.0, brightness: 345.8, confidence: 0.87, cluster: 'Jamnagar Petrochem', sensor: 'MODIS', timestamp: '2026-09-06T18:00:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-05', lon: 70.055, lat: 22.475, frp: 25.4, brightness: 341.2, confidence: 0.85, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T17:05:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-06', lon: 70.090, lat: 22.455, frp: 18.2, brightness: 334.6, confidence: 0.83, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T16:20:00Z', associatedEventId: 'EVT-1048' },
  { id: 'OBS-1048-07', lon: 70.038, lat: 22.492, frp: 14.5, brightness: 328.0, confidence: 0.78, cluster: 'Jamnagar Petrochem', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T15:40:00Z' },

  // ─── 2. GUJARAT / DAHEJ & HAZIRA CHEMICAL/PETROCHEMICAL CORRIDOR ───
  { id: 'OBS-DHJ-01', lon: 72.580, lat: 21.710, frp: 34.5, brightness: 348.0, confidence: 0.88, cluster: 'Dahej SEZ', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:10:00Z' },
  { id: 'OBS-DHJ-02', lon: 72.610, lat: 21.745, frp: 28.0, brightness: 342.3, confidence: 0.84, cluster: 'Dahej SEZ', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:50:00Z' },
  { id: 'OBS-HZR-01', lon: 72.690, lat: 21.110, frp: 38.2, brightness: 350.5, confidence: 0.90, cluster: 'Hazira Heavy Industry', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:30:00Z' },
  { id: 'OBS-HZR-02', lon: 72.720, lat: 21.080, frp: 22.4, brightness: 336.8, confidence: 0.82, cluster: 'Hazira Heavy Industry', sensor: 'MODIS', timestamp: '2026-09-06T18:15:00Z' },
  { id: 'OBS-ANK-01', lon: 73.010, lat: 21.630, frp: 19.5, brightness: 332.0, confidence: 0.80, cluster: 'Ankleshwar Chemical Hub', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T17:45:00Z' },

  // ─── 3. GUJARAT / AHMEDABAD CLUSTER (PERSISTENT EMITTER EVT-0921) ───
  { id: 'OBS-0921-01', lon: 72.540, lat: 23.020, frp: 19.8, brightness: 335.2, confidence: 0.88, cluster: 'Ahmedabad GIDC', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:15:00Z', associatedEventId: 'EVT-0921' },
  { id: 'OBS-0921-02', lon: 72.630, lat: 22.960, frp: 17.8, brightness: 331.0, confidence: 0.85, cluster: 'Vatva Chemical Hub', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T16:30:00Z', associatedEventId: 'EVT-0921' },
  { id: 'OBS-0921-03', lon: 72.660, lat: 23.070, frp: 18.4, brightness: 333.4, confidence: 0.86, cluster: 'Naroda Industrial', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T13:00:00Z', associatedEventId: 'EVT-0921' },
  { id: 'OBS-0921-04', lon: 72.380, lat: 22.990, frp: 14.2, brightness: 326.8, confidence: 0.79, cluster: 'Sanand Industrial', sensor: 'MODIS', timestamp: '2026-09-06T10:15:00Z' },

  // ─── 4. MAHARASHTRA / VIDARBHA (AGRICULTURAL BURN EVT-1182 & CENTRAL BELT) ───
  { id: 'OBS-1182-01', lon: 79.080, lat: 21.140, frp: 22.6, brightness: 338.0, confidence: 0.79, cluster: 'Nagpur Agricultural Belt', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T15:05:00Z', associatedEventId: 'EVT-1182' },
  { id: 'OBS-1182-02', lon: 78.600, lat: 20.740, frp: 14.5, brightness: 327.5, confidence: 0.76, cluster: 'Wardha Agro Field', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T14:20:00Z', associatedEventId: 'EVT-1182' },
  { id: 'OBS-CHP-01', lon: 79.290, lat: 19.950, frp: 32.0, brightness: 346.0, confidence: 0.87, cluster: 'Chandrapur Thermal & Paper', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T18:40:00Z' },
  { id: 'OBS-BTB-01', lon: 78.980, lat: 20.920, frp: 16.8, brightness: 329.8, confidence: 0.81, cluster: 'Butibori Industrial', sensor: 'MODIS', timestamp: '2026-09-06T16:10:00Z' },

  // ─── 5. MAHARASHTRA / MUMBAI-THANE-RAIGAD PETROCHEMICAL & MANUFACTURING ───
  { id: 'OBS-MUM-01', lon: 72.910, lat: 19.010, frp: 26.8, brightness: 341.5, confidence: 0.86, cluster: 'Trombay Refineries', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:50:00Z' },
  { id: 'OBS-MUM-02', lon: 72.890, lat: 19.000, frp: 24.1, brightness: 338.2, confidence: 0.84, cluster: 'Mahul Chemical Port', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:25:00Z' },
  { id: 'OBS-TLJ-01', lon: 73.110, lat: 19.070, frp: 17.5, brightness: 331.0, confidence: 0.80, cluster: 'Taloja MIDC', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T18:05:00Z' },
  { id: 'OBS-TRP-01', lon: 72.680, lat: 19.830, frp: 21.0, brightness: 335.4, confidence: 0.82, cluster: 'Tarapur Heavy Industry', sensor: 'MODIS', timestamp: '2026-09-06T17:15:00Z' },

  // ─── 6. CHHATTISGARH / CENTRAL STEEL & SUPER THERMAL CLUSTER ───
  { id: 'OBS-KRB-01', lon: 82.680, lat: 22.350, frp: 36.4, brightness: 349.0, confidence: 0.90, cluster: 'Korba Super Thermal Hub', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:00:00Z' },
  { id: 'OBS-KRB-02', lon: 82.740, lat: 22.380, frp: 29.1, brightness: 343.8, confidence: 0.86, cluster: 'Korba Super Thermal Hub', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:40:00Z' },
  { id: 'OBS-BHL-01', lon: 81.380, lat: 21.190, frp: 35.8, brightness: 348.5, confidence: 0.89, cluster: 'Bhilai Steel Corridor', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:15:00Z' },
  { id: 'OBS-RPR-01', lon: 81.610, lat: 21.320, frp: 20.4, brightness: 334.8, confidence: 0.82, cluster: 'Raipur Urla Industrial', sensor: 'MODIS', timestamp: '2026-09-06T17:30:00Z' },

  // ─── 7. ODISHA / MINING, ALUMINUM & STEEL ZONE ───
  { id: 'OBS-RKL-01', lon: 84.860, lat: 22.220, frp: 33.2, brightness: 346.2, confidence: 0.88, cluster: 'Rourkela Steel Plant', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:45:00Z' },
  { id: 'OBS-JHR-01', lon: 84.010, lat: 21.850, frp: 27.5, brightness: 341.0, confidence: 0.85, cluster: 'Jharsuguda Aluminum Belt', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:15:00Z' },
  { id: 'OBS-ANG-01', lon: 85.100, lat: 20.840, frp: 31.9, brightness: 345.1, confidence: 0.87, cluster: 'Angul Jindal Steel Complex', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T18:50:00Z' },

  // ─── 8. JHARKHAND / COAL & METALLURGICAL CORRIDOR ───
  { id: 'OBS-JMS-01', lon: 86.200, lat: 22.800, frp: 38.0, brightness: 350.2, confidence: 0.90, cluster: 'Jamshedpur Tata Steel Works', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:20:00Z' },
  { id: 'OBS-BKR-01', lon: 86.150, lat: 23.660, frp: 32.5, brightness: 345.5, confidence: 0.87, cluster: 'Bokaro Steel City', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:35:00Z' },
  { id: 'OBS-DNB-01', lon: 86.420, lat: 23.750, frp: 41.2, brightness: 353.0, confidence: 0.92, cluster: 'Jharia Coalfield Thermal Anomaly', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:55:00Z' },
  { id: 'OBS-RMG-01', lon: 85.510, lat: 23.630, frp: 21.8, brightness: 336.0, confidence: 0.82, cluster: 'Ramgarh Industrial Belt', sensor: 'MODIS', timestamp: '2026-09-06T16:50:00Z' },

  // ─── 9. TELANGANA & ANDHRA PRADESH / PHARMA & PORT INDUSTRIAL CLUSTERS ───
  { id: 'OBS-HYD-01', lon: 78.190, lat: 17.530, frp: 16.2, brightness: 330.1, confidence: 0.80, cluster: 'Hyderabad Pashamylaram Pharma', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T18:25:00Z' },
  { id: 'OBS-HYD-02', lon: 78.460, lat: 17.520, frp: 14.8, brightness: 328.5, confidence: 0.78, cluster: 'Jeedimetla Industrial Area', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T17:10:00Z' },
  { id: 'OBS-VZG-01', lon: 83.180, lat: 17.650, frp: 37.4, brightness: 349.8, confidence: 0.89, cluster: 'Visakhapatnam Steel & Port', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:05:00Z' },
  { id: 'OBS-KKN-01', lon: 82.240, lat: 16.980, frp: 23.5, brightness: 337.5, confidence: 0.83, cluster: 'Kakinada Fertilizer Hub', sensor: 'MODIS', timestamp: '2026-09-06T16:40:00Z' },

  // ─── 10. TAMIL NADU / PETROCHEM, AUTOMOTIVE & COASTAL ENERGY ───
  { id: 'OBS-CHN-01', lon: 80.260, lat: 13.160, frp: 29.8, brightness: 343.0, confidence: 0.86, cluster: 'Chennai Manali Petrochem', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:10:00Z' },
  { id: 'OBS-ENN-01', lon: 80.320, lat: 13.210, frp: 33.1, brightness: 346.0, confidence: 0.88, cluster: 'Ennore Thermal Station', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:00:00Z' },
  { id: 'OBS-RNP-01', lon: 79.330, lat: 12.930, frp: 15.6, brightness: 329.2, confidence: 0.79, cluster: 'Ranipet SIPCOT Industrial', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T17:20:00Z' },
  { id: 'OBS-TUT-01', lon: 78.130, lat: 8.760, frp: 27.0, brightness: 340.5, confidence: 0.84, cluster: 'Tuticorin Port & Smelter', sensor: 'MODIS', timestamp: '2026-09-06T18:30:00Z' },

  // ─── 11. PUNJAB & HARYANA / AGRO-INDUSTRIAL & REFINERY BELT ───
  { id: 'OBS-PNP-01', lon: 76.970, lat: 29.390, frp: 34.0, brightness: 347.0, confidence: 0.88, cluster: 'IOCL Panipat Refinery', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:40:00Z' },
  { id: 'OBS-LDH-01', lon: 75.850, lat: 30.900, frp: 18.4, brightness: 333.0, confidence: 0.81, cluster: 'Ludhiana Industrial Cluster', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T18:15:00Z' },
  { id: 'OBS-SNG-01', lon: 75.840, lat: 30.240, frp: 25.1, brightness: 339.5, confidence: 0.83, cluster: 'Sangrur Agricultural Residue', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T16:05:00Z' },
  { id: 'OBS-BTI-01', lon: 74.950, lat: 30.210, frp: 22.8, brightness: 336.8, confidence: 0.82, cluster: 'Bathinda Thermal Complex', sensor: 'MODIS', timestamp: '2026-09-06T15:20:00Z' },

  // ─── 12. RAJASTHAN / ENERGY, MINING & CEMENT BELT ───
  { id: 'OBS-BRM-01', lon: 71.410, lat: 25.750, frp: 29.4, brightness: 342.8, confidence: 0.86, cluster: 'Barmer Mangala Oilfield', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:25:00Z' },
  { id: 'OBS-KTA-01', lon: 75.830, lat: 25.180, frp: 26.5, brightness: 340.0, confidence: 0.84, cluster: 'Kota Thermal Plant', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:10:00Z' },
  { id: 'OBS-NMB-01', lon: 74.680, lat: 24.620, frp: 19.2, brightness: 333.2, confidence: 0.81, cluster: 'Nimbahera Cement Corridor', sensor: 'MODIS', timestamp: '2026-09-06T17:00:00Z' },

  // ─── 13. MADHYA PRADESH / CENTRAL HEAVY ENERGY HUB ───
  { id: 'OBS-SNG-02', lon: 82.670, lat: 24.120, frp: 44.5, brightness: 355.2, confidence: 0.92, cluster: 'Singrauli Super Thermal Complex', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T21:15:00Z' },
  { id: 'OBS-PTH-01', lon: 75.690, lat: 22.610, frp: 17.3, brightness: 331.5, confidence: 0.80, cluster: 'Pithampur Heavy Auto Hub', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T18:45:00Z' },

  // ─── 14. WEST BENGAL / EASTERN INDUSTRIAL & PORT CORRIDOR ───
  { id: 'OBS-HLD-01', lon: 88.080, lat: 22.030, frp: 31.4, brightness: 344.8, confidence: 0.87, cluster: 'Haldia Petrochem & Refinery', sensor: 'VIIRS-SNPP', timestamp: '2026-09-06T20:35:00Z' },
  { id: 'OBS-DUR-01', lon: 87.310, lat: 23.530, frp: 28.6, brightness: 342.1, confidence: 0.85, cluster: 'Durgapur Steel Hub', sensor: 'VIIRS-NOAA20', timestamp: '2026-09-06T19:05:00Z' },
];

export function getThermalObservationsGeoJson(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: DEMO_THERMAL_OBSERVATIONS.map((obs) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [obs.lon, obs.lat],
      },
      properties: {
        id: obs.id,
        frp: obs.frp,
        brightness: obs.brightness,
        confidence: obs.confidence,
        cluster: obs.cluster,
        sensor: obs.sensor,
        timestamp: obs.timestamp,
        associatedEventId: obs.associatedEventId || null,
        // Normalized intensity weight for heatmap (0.1 to 1.0)
        weight: Math.min(1.0, Math.max(0.15, obs.frp / 50.0)),
      },
    })),
  };
}

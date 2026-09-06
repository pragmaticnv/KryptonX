import math
from datetime import datetime
from typing import List, Dict, Any

def parse_iso(time_str: str) -> datetime:
    try:
        return datetime.fromisoformat(time_str.replace("Z", "+00:00"))
    except Exception:
        return datetime.utcnow()

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    return round(R * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a)), 3)

class EventFormationEngine:
    """
    Groups raw thermal observations into spatiotemporal events.
    Prototype parameters:
      - Spatial proximity: 2.5 km
      - Temporal window: 8.0 hours
    Transforms point-in-time satellite detections into unified spatiotemporal events.
    """

    @staticmethod
    def form_events(
        observations: List[Dict[str, Any]],
        spatial_radius_km: float = 2.5,
        temporal_window_hours: float = 8.0
    ) -> List[Dict[str, Any]]:
        if not observations:
            return []

        # Sort observations by timestamp
        sorted_obs = sorted(observations, key=lambda x: x.get("observed_at", ""))
        clusters: List[List[Dict[str, Any]]] = []

        for obs in sorted_obs:
            obs_lat = obs.get("lat", 0.0)
            obs_lon = obs.get("lon", 0.0)
            obs_time = parse_iso(obs.get("observed_at", ""))
            
            matched_cluster = None
            for cluster in clusters:
                # Compare against centroid or latest obs in cluster
                c_lat = sum(o["lat"] for o in cluster) / len(cluster)
                c_lon = sum(o["lon"] for o in cluster) / len(cluster)
                last_time = parse_iso(cluster[-1].get("observed_at", ""))
                
                dist_km = haversine_km(obs_lat, obs_lon, c_lat, c_lon)
                time_diff_hours = abs((obs_time - last_time).total_seconds()) / 3600.0

                if dist_km <= spatial_radius_km and time_diff_hours <= temporal_window_hours:
                    matched_cluster = cluster
                    break

            if matched_cluster is not None:
                matched_cluster.append(obs)
            else:
                clusters.append([obs])

        events = []
        for i, cluster in enumerate(clusters):
            event_id = f"EVT-L{1000 + i}"
            frp_values = [o.get("frp", 10.0) for o in cluster]
            peak_frp = max(frp_values)
            mean_frp = round(sum(frp_values) / len(frp_values), 1)
            
            c_lat = round(sum(o["lat"] for o in cluster) / len(cluster), 4)
            c_lon = round(sum(o["lon"] for o in cluster) / len(cluster), 4)
            
            first_time = cluster[0].get("observed_at", "2026-09-06T16:00:00Z")
            last_time = cluster[-1].get("observed_at", "2026-09-06T20:00:00Z")
            
            t0 = parse_iso(first_time)
            t1 = parse_iso(last_time)
            persistence_hours = max(0.5, round(abs((t1 - t0).total_seconds()) / 3600.0, 2))
            
            # Trend calculation
            if len(frp_values) >= 3:
                if frp_values[-1] > frp_values[0] * 1.3:
                    frp_trend = "rising"
                elif frp_values[-1] < frp_values[0] * 0.7:
                    frp_trend = "falling"
                else:
                    frp_trend = "stable"
            else:
                frp_trend = "stable"

            events.append({
                "id": event_id,
                "lat": c_lat,
                "lon": c_lon,
                "first_seen": first_time,
                "last_seen": last_time,
                "observation_count": len(cluster),
                "peak_frp": peak_frp,
                "mean_frp": mean_frp,
                "persistence_hours": persistence_hours,
                "frp_trend": frp_trend,
                "observations": cluster
            })

        return events

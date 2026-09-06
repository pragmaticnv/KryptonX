import math
import httpx
from typing import Dict, Any, Optional

class OSMAdapter:
    """
    Adapter for querying OpenStreetMap via Overpass API.
    Identifies proximate industrial facilities and computes Haversine distance.
    Gracefully falls back to demo context if Overpass is unavailable.
    """

    def __init__(self, overpass_url: str = "https://overpass-api.de/api/interpreter"):
        self.overpass_url = overpass_url
        self.mode = "demo"
        self.healthy = True

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Computes distance in km between two coordinates."""
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2.0) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(R * c, 2)

    async def query_nearby_facility(self, lat: float, lon: float, radius_m: int = 5000) -> Dict[str, Any]:
        """
        Attempts to query Overpass for industrial nodes/ways within radius.
        Falls back safely to local contextual metadata.
        """
        overpass_query = f"""
        [out:json][timeout:5];
        (
          node["landuse"="industrial"](around:{radius_m},{lat},{lon});
          way["landuse"="industrial"](around:{radius_m},{lat},{lon});
          node["man_made"="works"](around:{radius_m},{lat},{lon});
          way["man_made"="works"](around:{radius_m},{lat},{lon});
        );
        out center 3;
        """
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.post(self.overpass_url, data={"data": overpass_query})
                if resp.status_code == 200:
                    data = resp.json()
                    elements = data.get("elements", [])
                    if elements:
                        closest_elem = None
                        min_dist = float("inf")
                        for el in elements:
                            e_lat = el.get("lat") or el.get("center", {}).get("lat")
                            e_lon = el.get("lon") or el.get("center", {}).get("lon")
                            if e_lat and e_lon:
                                dist = self.haversine_distance(lat, lon, e_lat, e_lon)
                                if dist < min_dist:
                                    min_dist = dist
                                    closest_elem = el
                        if closest_elem:
                            name = closest_elem.get("tags", {}).get("name", "Industrial Complex")
                            f_type = closest_elem.get("tags", {}).get("landuse") or closest_elem.get("tags", {}).get("man_made", "Industrial")
                            self.mode = "live"
                            return {
                                "nearest_facility": name,
                                "facility_type": f_type.capitalize(),
                                "facility_distance_km": min_dist,
                                "source": "OSM Overpass Live"
                            }
        except Exception:
            pass  # Expected prototype fallback

        # Fallback to demo context
        return {
            "nearest_facility": "Demo Industrial Facility",
            "facility_type": "Industrial Complex",
            "facility_distance_km": 0.8,
            "source": "OSM Context (Cached/Demo)"
        }

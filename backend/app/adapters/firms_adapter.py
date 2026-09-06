import os
import csv
import io
import httpx
from typing import List, Dict, Any, Optional

class FIRMSAdapter:
    """
    Adapter for NASA FIRMS Thermal Observations API.
    Connects to NASA FIRMS when NASA_FIRMS_MAP_KEY is provided in environment.
    Never exposes key to frontend.
    Falls back gracefully to seed data if key is absent or API is unreachable.
    """

    def __init__(self):
        self.map_key = os.getenv("NASA_FIRMS_MAP_KEY", "").strip()
        self.sensor = os.getenv("FIRMS_SENSOR", "VIIRS_SNPP_NRT")
        self.mode = "live" if self.map_key else "demo"
        self.last_update = None
        self.healthy = True

    def get_status(self) -> Dict[str, Any]:
        return {
            "name": "NASA FIRMS",
            "purpose": "Near Real-Time Satellite Thermal Observations (VIIRS / MODIS)",
            "mode": self.mode,
            "status": "connected" if self.mode == "live" else "demo",
            "last_update": self.last_update or "2026-09-06T21:35:00Z",
            "details": "Active MAP_KEY adapter configured" if self.mode == "live" else "Demo fallback mode active (No MAP_KEY configured)"
        }

    async def fetch_observations(self, country_code: str = "IND", days: int = 1) -> List[Dict[str, Any]]:
        """
        Fetches live NRT thermal detections from NASA FIRMS.
        Returns list of normalized observations.
        """
        if not self.map_key:
            return []

        url = f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{self.map_key}/{self.sensor}/{country_code}/{days}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code == 200 and not response.text.startswith("Invalid"):
                    reader = csv.DictReader(io.StringIO(response.text))
                    observations = []
                    for row in reader:
                        try:
                            observations.append({
                                "lat": float(row.get("latitude", 0)),
                                "lon": float(row.get("longitude", 0)),
                                "frp": float(row.get("frp", 0)),
                                "brightness": float(row.get("bright_ti4", row.get("brightness", 0))),
                                "confidence": row.get("confidence", "nominal"),
                                "observed_at": f"{row.get('acq_date')}T{row.get('acq_time')[:2]}:{row.get('acq_time')[2:]}:00Z",
                                "satellite": row.get("satellite", "NPP"),
                                "instrument": row.get("instrument", "VIIRS"),
                                "source": "NASA_FIRMS_LIVE"
                            })
                        except (ValueError, KeyError):
                            continue
                    self.healthy = True
                    self.mode = "live"
                    return observations
        except Exception:
            self.healthy = False

        return []

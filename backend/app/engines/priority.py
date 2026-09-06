from typing import Dict, Tuple
from ..models.event import PriorityBreakdown

class PriorityEngine:
    """
    Computes priority score (0-100) and priority level from 5 weighted factors:
      - Thermal Severity (30%)
      - Anomaly Score (25%)
      - Persistence (20%)
      - Exposure / Context (15%)
      - Industrial Relevance (10%)
    Strictly separates PRIORITY from CLASSIFICATION CONFIDENCE.
    """

    @staticmethod
    def calculate_priority(
        peak_frp: float,
        anomaly_score: float,
        persistence_hours: float,
        exposure_score: float,
        industrial_relevance: float
    ) -> Tuple[float, str, PriorityBreakdown]:
        # Normalize thermal severity (0-100, where 50 MW ~ 100)
        thermal_severity = min(100.0, max(0.0, (peak_frp / 50.0) * 100.0))
        
        # Normalize persistence (0-100, where 10h ~ 100)
        persistence_score = min(100.0, max(0.0, (persistence_hours / 10.0) * 100.0))
        
        # Weighted calculation
        raw_score = (
            0.30 * thermal_severity +
            0.25 * anomaly_score +
            0.20 * persistence_score +
            0.15 * exposure_score +
            0.10 * industrial_relevance
        )
        
        score = round(min(100.0, max(0.0, raw_score)), 1)
        
        if score >= 75.0:
            level = "CRITICAL"
        elif score >= 50.0:
            level = "HIGH"
        elif score >= 25.0:
            level = "MODERATE"
        else:
            level = "LOW"
            
        breakdown = PriorityBreakdown(
            thermal_severity=round(thermal_severity, 1),
            anomaly_score=round(anomaly_score, 1),
            persistence_score=round(persistence_score, 1),
            exposure_score=round(exposure_score, 1),
            industrial_relevance=round(industrial_relevance, 1)
        )
        
        return score, level, breakdown

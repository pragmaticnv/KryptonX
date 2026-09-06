from typing import Tuple, Dict, Any

class BaselineEngine:
    """
    Computes site baseline FRP, anomaly ratio, and anomaly score.
    Follows KryptonX PRD Section 8 & UI Spec.
    """
    
    @staticmethod
    def calculate_anomaly(peak_frp: float, baseline_frp: float) -> Tuple[float, float, str, str]:
        """
        Returns:
            anomaly_ratio: float (e.g. 3.71)
            anomaly_score: float 0-100
            anomaly_level: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL'
            explanation: str
        """
        epsilon = 0.5
        effective_baseline = max(baseline_frp, epsilon)
        ratio = round(peak_frp / effective_baseline, 2)
        
        # Prototype heuristic thresholding
        if ratio < 1.5:
            level = "NORMAL"
            score = min(25.0, round(ratio / 1.5 * 25.0, 1))
            explanation = "Current thermal intensity remains close to expected historical site baseline."
        elif ratio < 2.5:
            level = "ELEVATED"
            score = min(50.0, round(25.0 + ((ratio - 1.5) / 1.0) * 25.0, 1))
            explanation = "Thermal activity shows elevated intensity above typical operations."
        elif ratio < 4.0:
            level = "HIGH"
            score = min(80.0, round(50.0 + ((ratio - 2.5) / 1.5) * 30.0, 1))
            explanation = "Current thermal intensity is substantially above historical site behavior."
        else:
            level = "CRITICAL"
            score = min(100.0, round(80.0 + min(20.0, (ratio - 4.0) * 5.0), 1))
            explanation = "Thermal intensity exhibits extreme deviation from historical baseline (critical anomaly)."
            
        return ratio, score, level, explanation

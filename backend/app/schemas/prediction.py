from pydantic import BaseModel
from typing import Dict, List

class PredictionResult(BaseModel):
    class_index: int
    confidence: float
    all_probs: List[float]  

class PredictionResponse(BaseModel):
    results: Dict[str, PredictionResult]

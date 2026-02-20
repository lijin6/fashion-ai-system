export interface PredictionResult {
  attr: string;
  label: string;
  score: number;
}

export interface PredictResponse {
  results: PredictionResult[];
}
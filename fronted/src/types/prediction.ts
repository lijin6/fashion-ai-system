// src/types/prediction.ts
export interface PredictionItem {
    confidence: number;      // 最佳类别置信度
    class_index: number;     // 最佳类别索引
    all_probs: number[];     // 所有类别概率
  }
  
  export interface PredictionResponse {
    results: Record<string, PredictionItem>;
  }
  
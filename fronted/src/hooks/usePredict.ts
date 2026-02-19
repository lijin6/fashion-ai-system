import { useState } from "react";
import type { PredictionResponse } from "../types/prediction";

export function usePredict() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 新增进度状态

  const predict = async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 模拟上传 / 推理进度
      for (let i = 1; i <= 100; i++) {
        await new Promise(r => setTimeout(r, 15)); // 15ms 模拟进度
        setProgress(i);
      }

      // 模拟返回数据
      const data: PredictionResponse = {
        results: {
          coat_length: { class_index: 2, confidence: 0.85 },
          sleeve_length: { class_index: 5, confidence: 0.92 },
        },
      };
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, predict, progress };
}

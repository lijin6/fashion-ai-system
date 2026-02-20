import { useState } from 'react';
import type { PredictionResult, PredictResponse } from '../types/prediction';

export const usePredict = () => {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (file: File) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('服务器响应错误');
      const data: PredictResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      setError('模型推理失败，请检查后端连接');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { predict, results, loading, error, setResults };
};
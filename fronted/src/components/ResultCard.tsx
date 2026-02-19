import type { PredictionResponse } from "../types/prediction";

interface Props {
  data: PredictionResponse;
}

export default function ResultCard({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
        识别结果
      </h2>

      <div className="space-y-4">
        {Object.entries(data.results).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
              <span className="text-gray-600">{(value.confidence * 100).toFixed(2)}%</span>
            </div>
            {/* 置信度进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500
                  ${value.confidence > 0.75 ? 'bg-green-500' :
                    value.confidence > 0.5 ? 'bg-yellow-400' :
                    'bg-red-500'}`}
                style={{ width: `${value.confidence * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

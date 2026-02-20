import React from 'react';
import type { PredictionResult } from '../types/prediction';
import { ATTR_NAME_MAP } from '../constants/classMapping';

export const ResultCard: React.FC<{ data: PredictionResult }> = ({ data }) => {
  const percentage = Math.round(data.score * 100);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-500">
          {ATTR_NAME_MAP[data.attr] || data.attr}
        </span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {percentage}%
        </span>
      </div>
      <div className="text-lg font-semibold text-slate-800 mb-3">{data.label}</div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
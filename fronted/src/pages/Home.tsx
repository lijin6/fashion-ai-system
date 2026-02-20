import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredict } from '../hooks/usePredict';
import { useAuth } from '../context/AuthContext'; // 引入 Auth 钩子
import { ResultCard } from '../components/ResultCard';
import { TechnicalDetails } from '../components/TechnicalDetails';
import { DatasetInfo } from '../components/DatasetInfo';

const Home: React.FC = () => {
  const { predict, results, loading, error, setResults } = usePredict();
  const { isAuthenticated } = useAuth(); // 获取登录状态
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [showLoginHint, setShowLoginHint] = useState(false);

  // 当识别结果生成时，轻微滚动以确保结果可见
  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  }, [results]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 安全检查：未登录拦截
    if (!isAuthenticated) {
      setShowLoginHint(true);
      // 3秒后自动跳转登录页，或让用户手动点击
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      // 2. 清理旧数据
      setResults([]);
      // 3. 预览展示
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      // 4. 执行预测
      predict(file);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-700">
      {/* 识别功能板块 */}
      <section id="predict" className="pt-28 pb-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          
          {/* 登录提示浮层 (未登录点击时显示) */}
          {showLoginHint && (
            <div className="mb-6 p-4 bg-blue-600 text-white rounded-2xl text-center font-bold animate-bounce shadow-lg shadow-blue-200">
              请先登录！正在为您跳转至登录页面...
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* 左侧：上传卡片 */}
            <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all duration-500 flex flex-col min-h-[580px] ${loading ? 'ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">服饰图像上传</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Layer</span>
              </div>
              
              <div className="flex-1 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 flex items-center justify-center relative overflow-hidden group">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                  onChange={handleFileChange} 
                  accept="image/*"
                  disabled={loading}
                />
                
                {!preview ? (
                  <div className="text-center p-10 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-4xl mx-auto mb-4">
                      📸
                    </div>
                    <p className="text-slate-500 font-bold">点击或拖拽图片</p>
                    <p className="text-slate-400 text-xs mt-2">支持 JPG, PNG, WEBP 格式</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img src={preview} alt="Preview" className="max-h-[440px] w-auto object-contain rounded-2xl shadow-2xl" />
                    {loading && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                         <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <span className="text-blue-700 font-bold text-sm">特征提取中...</span>
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：结果卡片 */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col min-h-[580px]">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-slate-800">识别详情</h2>
                  {results.length > 0 && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-md uppercase">Analysis Complete</span>
                  )}
                </div>
                {loading && <div className="text-xs font-mono text-blue-500 animate-pulse font-bold">Computing Gradients...</div>}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                    ⚠️ 识别失败: {error}
                  </div>
                )}

                {results.length > 0 ? (
                  <div className="grid gap-4">
                    {results.map((res, i) => (
                      <div key={i} className="animate-in slide-in-from-right-4 duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                        <ResultCard data={res} />
                      </div>
                    ))}
                  </div>
                ) : (
                  !error && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl">
                        {loading ? "⚡" : "🔍"}
                      </div>
                      <p className="italic text-sm">
                        {loading ? "InceptionV4 正在扫描图像属性..." : "等待上传服饰照片进行多任务分析"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技术与数据集介绍 */}
      <div className="space-y-0">
        <TechnicalDetails />
        <DatasetInfo />
      </div>
    </div>
  );
};

export default Home;
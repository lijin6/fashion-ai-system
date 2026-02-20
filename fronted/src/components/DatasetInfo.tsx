import React from 'react';
import hierarchyChartImg from '../assets/hierarchy-chart.png';

export const DatasetInfo: React.FC = () => {
  return (
    <section id="dataset" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* 左侧：可视化分类标准 */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Standardized Labeling System</span>
              </div>
              
              <img 
                src={hierarchyChartImg} 
                alt="Hierarchy" 
                className="w-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">8</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">主维度</div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-2xl font-bold text-emerald-400">80+</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">子分类标签</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">100%</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">专家级审核</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：数据集深度说明 */}
          <div className="flex-1 space-y-8 order-1 lg:order-2">
            <h2 className="text-4xl font-extrabold leading-tight">
              Ali-FashionAI <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                属性标注体系
              </span>
            </h2>
            
            <p className="text-slate-400 leading-relaxed text-lg">
              数据集不仅是规模宏大，更重要的是其定义了服装行业的“数字标准”。
              通过对 10 万+ 张高质量图像的像素级理解，我们将模糊的时尚感知转化为精准的数学分类。
            </p>

            <div className="space-y-6">
              {[
                { title: "抗遮挡识别", desc: "专门针对背包、手臂交叉、长发覆盖等真实场景进行了强化训练。", icon: "🛡️" },
                { title: "多尺度适配", desc: "无论是全身街拍还是局部细节特写，模型均能保持极高的识别准确度。", icon: "📐" },
                { title: "行业标准对齐", desc: "参考《服装分类与代码》国标，确保结果可直接对接供应链与仓储系统。", icon: "📋" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:bg-blue-600/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-100 font-bold mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
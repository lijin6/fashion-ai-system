import React from 'react';
import modelStructureImg from '../assets/model-structure.png'; 

export const TechnicalDetails: React.FC = () => {
  return (
    <section id="model-info" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 顶部标题与背景 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">InceptionV4 多任务深度学习架构</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            针对复杂服饰场景设计的端到端识别网络，通过共享特征提取层实现对 8 大维度属性的联合预测。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* 左侧：模型核心逻辑说明 */}
          <div className="space-y-10">
            <div className="relative pl-8 border-l-2 border-blue-600">
              <h3 className="text-xl font-bold text-slate-800 mb-3">循环交替多任务训练 (CAMT)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                为了解决 FashionAI 数据集中的<b>标签缺失问题</b>，我们摒弃了传统的全任务反向传播。
                系统采用“循环交替”方案：在每个训练步骤中，仅激活有标注属性的分类头，通过 Masked-Loss 机制锁定无效梯度，确保模型在海量缺失数据中依然能够稳定收敛。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "共享主干网络", desc: "采用 InceptionV4 提取全局视觉语义，捕捉面料纹理与剪裁特征。" },
                { title: "自适应 Softmax", desc: "每个属性拥有独立的非对称输出层，适配不同维度的分类需求。" },
                { title: "全局池化策略", desc: "保留空间位置信息，精准定位领口、袖口等关键细节点。" },
                { title: "梯度隔离技术", desc: "防止不同属性间的矛盾梯度干扰主干参数的稳定性。" }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
                  <h4 className="font-bold text-blue-700 text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：模型架构图 */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest">Network Architecture</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
              </div>
              
              <img 
                src={modelStructureImg} 
                alt="Architecture" 
                className="w-full rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
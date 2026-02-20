import tensorflow.compat.v1 as tf
import os
import numpy as np

# 必须禁用 Eager Execution 以兼容 TF 1.x 静态图模型
tf.disable_eager_execution()

class FashionModelLoader:
    def __init__(self, model_path):
        self.model_path = model_path
        self.graph = None
        self.sess = None
        self.input_tensor = None
        self.output_tensors = []
        
        # 严格按照 Poemix 项目定义的 8 大属性顺序，确保与 Softmax 节点一一对应
        self.attr_keys = [
            "coat_length", "collar_design", "lapel_design", "neck_design",
            "neckline_design", "pant_length", "skirt_length", "sleeve_length"
        ]
        
        # 映射表：根据模型输出维度补全了“未检出/不适用”位，使前端不再显示“分类-11”等硬编码
        self.label_config = {
            "coat_length": ["极短", "短款", "常规", "中长", "长款", "超长", "不确定", "其他", "识别中", "识别中", "识别中", "不适用/未检出"],
            "collar_design": ["衬衫领", "彼得潘领", "清教徒领", "罗纹领", "其他"],
            "lapel_design": ["缺角领", "无领", "披肩领", "加大披肩领", "其他"],
            "neck_design": ["高领", "荷叶边半高领", "低高领", "垂领", "其他"],
            "neckline_design": ["抹胸", "深V领", "直领", "V领", "方领", "圆领", "心形领", "单肩领", "不确定", "其他"],
            "pant_length": ["短裤", "中裤", "3/4裤", "七分裤", "九分裤", "长裤", "不适用/未检出"],
            "skirt_length": ["短裙", "及膝裙", "中长裙", "中裙", "长裙", "超长裙", "不确定", "其他", "迷你裙"],
            "sleeve_length": ["无袖", "杯袖", "短袖", "肘袖", "3/4袖", "手腕袖", "长袖", "超长袖", "其他", "识别中", "识别中", "识别中", "识别中", "识别中", "识别中", "不适用/未检出"]
        }

    def load(self):
        """初始化并加载 TensorFlow 静态图"""
        tf.reset_default_graph()
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True  # 防止一次性占满显存
        self.sess = tf.Session(config=config)
        
        # 加载 .meta 结构和 weights
        saver = tf.train.import_meta_graph(self.model_path + '.meta')
        saver.restore(self.sess, self.model_path)
        self.graph = tf.get_default_graph()

        # 核心输入节点
        self.input_tensor = self.graph.get_tensor_by_name("Placeholder:0")
        
        # 按照 key 顺序加载 8 个多任务输出头
        self.output_tensors = [
            self.graph.get_tensor_by_name(f"MyInceptionV4/logits/{k}_labels_1/Softmax:0") 
            for k in self.attr_keys
        ]

    def predict(self, image_input):
        """执行推理并处理结果语义"""
        feed_dict = {self.input_tensor: image_input}

        # 核心修复：自动补全图中所有的 Placeholder（包含训练开关和任务 Mask）
        for op in self.graph.get_operations():
            if op.type == "Placeholder" and op.outputs[0] != self.input_tensor:
                t = op.outputs[0]
                # 处理布尔型（is_training）和浮点型（keep_prob）
                val = False if t.dtype.name == "bool" else 1.0
                try:
                    shape = t.get_shape()
                    # 修复：防止 unknown shape 调用 as_list() 导致的 ValueError
                    if shape.ndims is not None and len(shape.as_list()) >= 2:
                        val = [[val]]
                except: pass
                feed_dict[t] = val

        try:
            # 批量获取 8 个属性的 Softmax 概率分布
            raw_outputs = self.sess.run(self.output_tensors, feed_dict=feed_dict)
            
            results = []
            for i, probs in enumerate(raw_outputs):
                p = probs[0]
                top_idx = int(np.argmax(p))
                attr_name = self.attr_keys[i]
                
                labels = self.label_config.get(attr_name, [])
                label_text = labels[top_idx] if top_idx < len(labels) else "未检出"
                
                # 语义化过滤：只向前端返回有效的识别结果
                # 如果模型判断该部位“不适用/未检出”，则直接不返回该项
                if "不适用" in label_text or "识别中" in label_text:
                    continue

                results.append({
                    "attr": attr_name,
                    "label": label_text,
                    "score": round(float(p[top_idx]), 4)
                })
            
            return results
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e
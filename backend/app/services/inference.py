import tensorflow.compat.v1 as tf
import numpy as np
import cv2
import base64
from app.services.visualizer import GradCAM

class FashionInference:
    def __init__(self, model_path: str):
        tf.disable_eager_execution()
        self.graph = tf.Graph()
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        self.sess = tf.Session(graph=self.graph, config=config)
        
        with self.graph.as_default():
            saver = tf.train.import_meta_graph(f"{model_path}.meta")
            saver.restore(self.sess, model_path)
            
            all_ops = self.graph.get_operations()
            self.input_x = next(t.outputs[0] for t in all_ops if t.type == "Placeholder")
            # 自动抓取最后一个卷积层
            conv_tensors = [op.outputs[0] for op in all_ops if "Conv2D" in op.type]
            self.conv_layer = conv_tensors[-1]
            self.output_nodes = [op.outputs[0] for op in all_ops if "Softmax" in op.name]
            
            self.visualizer = GradCAM(self.sess, self.graph, self.conv_layer)
            self._init_feed_extras(all_ops)

    def _init_feed_extras(self, all_ops):
        self.feed_extras = {op.outputs[0]: (False if "bool" in op.outputs[0].dtype.name else 1.0)
                            for op in all_ops if op.type == "Placeholder" and op.outputs[0] != self.input_x}

    def run_two_stage_predict(self, img_bytes: bytes):
        nparr = np.frombuffer(img_bytes, np.uint8)
        raw_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # 第一阶段：获取热力图
        img_in = cv2.resize(raw_img, (331, 331))
        img_pre = (cv2.cvtColor(img_in, cv2.COLOR_BGR2RGB).astype(np.float32) / 127.5) - 1.0
        
        with self.graph.as_default():
            feed = {self.input_x: [img_pre], **self.feed_extras}
            heatmap = self.visualizer.compute_heatmap(feed, self.output_nodes[0])
            
            # 第二阶段：ROI 裁剪再推理 (基于 Threshold 64)
            _, thresh = cv2.threshold(heatmap, 64, 255, cv2.THRESH_BINARY)
            cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            target_img = img_in
            if cnts:
                x, y, w, h = cv2.boundingRect(max(cnts, key=cv2.contourArea))
                roi = raw_img[max(0,y):y+h, max(0,x):x+w]
                if roi.size > 0: target_img = cv2.resize(roi, (331, 331))
            
            final_pre = (cv2.cvtColor(target_img, cv2.COLOR_BGR2RGB).astype(np.float32) / 127.5) - 1.0
            final_res = self.sess.run(self.output_nodes, feed_dict={self.input_x: [final_pre], **self.feed_extras})

        # 结果封装
        AK = ['coat_length', 'collar_design', 'lapel_design', 'neck_design', 
              'neckline_design', 'pant_length', 'skirt_length', 'sleeve_length']
        results = [{"attr": AK[i], "index": int(np.argmax(p[0])), "score": float(np.max(p[0]))} 
                   for i, p in enumerate(final_res)]
        
        # 热力图叠加展示
        vis = cv2.addWeighted(img_in, 0.6, cv2.applyColorMap(heatmap, cv2.COLORMAP_JET), 0.4, 0)
        heatmap_b64 = base64.b64encode(cv2.imencode('.jpg', vis)[1]).decode('utf-8')
        
        return results, heatmap_b64
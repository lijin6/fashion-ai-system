import tensorflow.compat.v1 as tf
import numpy as np
import cv2

class GradCAM:
    def __init__(self, sess, graph, last_conv_layer):
        self.sess = sess
        self.graph = graph
        self.last_conv = last_conv_layer

    def compute_heatmap(self, feed_dict, target_tensor):
        with self.graph.as_default():
            # 获取预测分值最高的类别梯度
            loss = tf.reduce_max(target_tensor)
            grads_node = tf.gradients(loss, self.last_conv)[0]
            
            if grads_node is None:
                return np.zeros((331, 331), dtype=np.uint8)

            conv_val, grads_val = self.sess.run([self.last_conv, grads_node], feed_dict=feed_dict)
            
            # 权重全局平均池化 (GAP)
            weights = np.mean(grads_val, axis=(1, 2))
            cam = np.dot(conv_val[0], weights[0])
            
            # ReLU 激活与归一化
            cam = np.maximum(cam, 0)
            cam = cv2.resize(cam, (331, 331))
            norm_cam = (cam - np.min(cam)) / (np.max(cam) - np.min(cam) + 1e-10)
            return (norm_cam * 255).astype(np.uint8)
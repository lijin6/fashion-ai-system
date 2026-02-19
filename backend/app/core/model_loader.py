import tensorflow.compat.v1 as tf
import os

tf.disable_eager_execution()

class FashionModelLoader:
    def __init__(self, model_path):
        self.model_path = model_path
        self.graph = None
        self.sess = None
        self.input_tensor = None
        self.output_tensors = {}

    def load(self):
        tf.reset_default_graph()
        self.sess = tf.Session()
        saver = tf.train.import_meta_graph(self.model_path + '.meta')
        saver.restore(self.sess, self.model_path)

        self.graph = tf.get_default_graph()

        self.input_tensor = self.graph.get_tensor_by_name("Placeholder:0")

        self.output_tensors = {
            "coat_length": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/coat_length_labels_1/Softmax:0"
            ),
            "collar_design": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/collar_design_labels_1/Softmax:0"
            ),
            "lapel_design": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/lapel_design_labels_1/Softmax:0"
            ),
            "neck_design": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/neck_design_labels_1/Softmax:0"
            ),
            "neckline_design": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/neckline_design_labels_1/Softmax:0"
            ),
            "pant_length": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/pant_length_labels_1/Softmax:0"
            ),
            "skirt_length": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/skirt_length_labels_1/Softmax:0"
            ),
            "sleeve_length": self.graph.get_tensor_by_name(
                "MyInceptionV4/logits/sleeve_length_labels_1/Softmax:0"
            ),
        }

    def predict(self, image_input):
        feed_dict = {self.input_tensor: image_input}

        # 自动填充 is_training / keep_prob
        for op in self.graph.get_operations():
            if op.type == "Placeholder":
                t = op.outputs[0]
                if t != self.input_tensor:
                    if t.dtype.name == "bool":
                        feed_dict[t] = False
                    elif "float" in t.dtype.name:
                        feed_dict[t] = 1.0

        outputs = self.sess.run(list(self.output_tensors.values()), feed_dict=feed_dict)

        results = {}
        for key, probs in zip(self.output_tensors.keys(), outputs):
            probs = probs[0]  # 取 batch=1 的结果
            top_idx = int(probs.argmax())
            confidence = float(probs[top_idx])
            results[key] = {
                "class_index": top_idx,
                "confidence": confidence,
                "all_probs": probs.tolist()  
            }

        print(results)
        return results

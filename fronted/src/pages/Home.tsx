import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ImagePreview from "../components/ImagePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultCard from "../components/ResultCard";
import { usePredict } from "../hooks/usePredict";

export default function Home() {
  const { result, loading, error, predict } = usePredict();
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center text-blue-700">
          服装属性识别系统
        </h1>

        <ImageUploader onUpload={predict} setPreview={setPreview} />
        <ImagePreview imageUrl={preview} />

        {loading && <LoadingSpinner />}

        {error && (
          <div className="text-red-500 text-center my-4 font-medium">{error}</div>
        )}

        {result && <ResultCard data={result} />}
      </div>
    </div>
  );
}

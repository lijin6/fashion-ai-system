interface Props {
    imageUrl: string | null;
  }
  
  export default function ImagePreview({ imageUrl }: Props) {
    if (!imageUrl) return null;
  
    return (
      <div className="mb-6 flex justify-center">
        <img
          src={imageUrl}
          alt="preview"
          className="max-h-96 object-contain rounded-2xl shadow-lg border border-gray-200"
        />
      </div>
    );
  }
  
interface Props {
    progress: number; // 0 ~ 100
  }
  
  export default function ProgressBar({ progress }: Props) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }
  
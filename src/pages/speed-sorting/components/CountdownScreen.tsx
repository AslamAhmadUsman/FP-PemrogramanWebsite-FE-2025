interface CountdownScreenProps {
  countdown: number;
}

export function CountdownScreen({ countdown }: CountdownScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">Get Ready!</h2>
      <div className="text-8xl font-bold text-blue-600 animate-pulse">
        {countdown}
      </div>
    </div>
  );
}

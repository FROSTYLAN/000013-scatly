interface LoadingSpinnerProps {
  title: string;
  message?: string;
}

export function LoadingSpinner({ title, message = "Cargando campos..." }: LoadingSpinnerProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span className="ml-2">{message}</span>
      </div>
    </div>
  );
}
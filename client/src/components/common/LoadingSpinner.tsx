export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-2 border-brand-yellow/20 border-t-brand-yellow rounded-full animate-spin`} />
    </div>
  );
}

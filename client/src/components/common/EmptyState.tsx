interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-brand-yellow/50">{icon}</div>}
      <h3 className="heading-sm text-brand-cream mb-2">{title}</h3>
      {description && <p className="text-brand-cream/50 max-w-md">{description}</p>}
    </div>
  );
}

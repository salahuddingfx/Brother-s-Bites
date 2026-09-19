import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  eyebrow,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 sm:mb-12',
        centered ? 'text-center mx-auto' : 'text-left',
        'content-intro',
        className
      )}
    >
      {eyebrow && (
        <p className="eyebrow-bb mb-2 sm:mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'heading-section tracking-tight',
          light ? 'text-brand-black' : 'text-brand-cream'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-sm sm:text-base leading-relaxed mt-2 sm:mt-3',
            light ? 'text-brand-black/65' : 'text-brand-cream/60'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

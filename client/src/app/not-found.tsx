import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="heading-xl text-brand-yellow mb-4">404</h1>
        <p className="heading-md text-brand-cream mb-2">Page Not Found</p>
        <p className="text-brand-cream/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}

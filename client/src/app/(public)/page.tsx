import dynamic from 'next/dynamic';
import HeroSection from '@/components/hero/HeroSection';

const GrandOpeningSection = dynamic(() => import('@/features/home/GrandOpeningSection'), { ssr: false });
const SignatureBitesSection = dynamic(() => import('@/features/home/SignatureBitesSection'), { ssr: false });
const MenuPreviewSection = dynamic(() => import('@/features/home/MenuPreviewSection'), { ssr: false });
const DrinksSection = dynamic(() => import('@/features/home/DrinksSection'), { ssr: false });
const OffersSection = dynamic(() => import('@/features/home/OffersSection'), { ssr: false });
const WhyUsSection = dynamic(() => import('@/features/home/WhyUsSection'), { ssr: false });
const BrotherhoodSection = dynamic(() => import('@/features/home/BrotherhoodSection'), { ssr: false });
const ReviewsSection = dynamic(() => import('@/features/home/ReviewsSection'), { ssr: false });
const GalleryPreviewSection = dynamic(() => import('@/features/home/GalleryPreviewSection'), { ssr: false });
const LocationSection = dynamic(() => import('@/features/home/LocationSection'), { ssr: false });
const ContactCTASection = dynamic(() => import('@/features/home/ContactCTASection'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <GrandOpeningSection />
      <SignatureBitesSection />
      <MenuPreviewSection />
      <DrinksSection />
      <OffersSection />
      <WhyUsSection />
      <BrotherhoodSection />
      <ReviewsSection />
      <GalleryPreviewSection />
      <LocationSection />
      <ContactCTASection />
    </>
  );
}

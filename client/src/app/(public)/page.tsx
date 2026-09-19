import HeroSection from '@/components/hero/HeroSection';
import GrandOpeningSection from '@/features/home/GrandOpeningSection';
import SignatureBitesSection from '@/features/home/SignatureBitesSection';
import MenuPreviewSection from '@/features/home/MenuPreviewSection';
import DrinksSection from '@/features/home/DrinksSection';
import OffersSection from '@/features/home/OffersSection';
import WhyUsSection from '@/features/home/WhyUsSection';
import BrotherhoodSection from '@/features/home/BrotherhoodSection';
import GalleryPreviewSection from '@/features/home/GalleryPreviewSection';
import LocationSection from '@/features/home/LocationSection';
import ReviewsSection from '@/features/home/ReviewsSection';
import ContactCTASection from '@/features/home/ContactCTASection';

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

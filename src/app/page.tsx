import LandingFooter from "@/domains/home/components/LandingFooter";
import LandingHeader from "@/domains/home/components/LandingHeader";
import LandingCapabilitiesSection from "@/domains/home/components/LandingCapabilitiesSection";
import LandingHeroSection from "@/domains/home/components/LandingHeroSection";
import LandingLaunchSection from "@/domains/home/components/LandingLaunchSection";
import LandingProductPreview from "@/domains/home/components/LandingProductPreview";
import LandingTrustBar from "@/domains/home/components/LandingTrustBar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-prism-body">
      <LandingHeader />
      <main className="flex-1">
        <LandingHeroSection />
        <LandingTrustBar />
        <LandingCapabilitiesSection />
        <LandingProductPreview />
        <LandingLaunchSection />
      </main>
      <LandingFooter />
    </div>
  );
}

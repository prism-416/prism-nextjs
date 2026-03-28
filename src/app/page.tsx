import Container from "@/atomics/atoms/Container";
import LandingFooter from "@/domains/home/components/LandingFooter";
import LandingHeader from "@/domains/home/components/LandingHeader";
import LandingCapabilitiesSection from "@/domains/home/components/LandingCapabilitiesSection";
import LandingHeroSection from "@/domains/home/components/LandingHeroSection";
import LandingLaunchSection from "@/domains/home/components/LandingLaunchSection";
import LandingWorkflowSection from "@/domains/home/components/LandingWorkflowSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-prism-body">
      <LandingHeader />
      <main className="flex-1">
        <LandingHeroSection />
        <LandingCapabilitiesSection />
        <LandingWorkflowSection />
        <section
          id="launch"
          aria-labelledby="launch-heading"
          className="scroll-mt-20 bg-(image:--gradient-launch-surface) py-20 md:py-24"
        >
          <Container>
            <LandingLaunchSection />
          </Container>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

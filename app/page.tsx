import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { QuoteModalProvider } from "@/components/QuoteModalProvider";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";

export default function Home() {
  return (
    <QuoteModalProvider>
      <main className="relative min-h-screen overflow-hidden">
        <Navbar />
        <Hero />
        <Stats />
        <Services />
        <Projects />
        <CTA />
        <Footer />
      </main>
    </QuoteModalProvider>
  );
}

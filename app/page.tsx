import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { QuoteModalProvider } from "@/components/QuoteModalProvider";
import { SavingsCalculatorProvider } from "@/components/SavingsCalculatorProvider";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";

export default function Home() {
  return (
    <QuoteModalProvider>
      <SavingsCalculatorProvider>
        <main className="relative min-h-screen overflow-hidden">
          <Navbar />
          <Hero />
          <Stats />
          <Services />
          <Projects />
          <About />
          <FAQ />
          <CTA />
          <Footer />
        </main>
      </SavingsCalculatorProvider>
    </QuoteModalProvider>
  );
}

"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Advantages from "./Advantages";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import LeadForm from "./LeadForm";
import Footer from "./Footer";
import Assistant from "./Assistant";

export default function HomePage() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  const openAssistant = () => setAssistantOpen(true);

  return (
    <>
      <Header onOpenAssistant={openAssistant} />
      <main>
        <Hero onOpenAssistant={openAssistant} />
        <Advantages />
        <Testimonials />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
      <Assistant open={assistantOpen} onOpenChange={setAssistantOpen} />
    </>
  );
}

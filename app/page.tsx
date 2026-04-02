'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { Console } from '@/components/Console';
import { NetworkMonitor } from '@/components/NetworkMonitor';
import { SystemHealthWidget } from '@/components/SystemHealthWidget';
import { CustomCursor } from '@/components/CustomCursor';
import { IntroScreen } from '@/components/IntroScreen';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HomePage() {
  const [hasIntroCompleted, setHasIntroCompleted] = useState(false);

  useScrollAnimation();

  useEffect(() => {
    const introCompleted = sessionStorage.getItem('introCompleted');
    if (introCompleted === 'true') {
      setHasIntroCompleted(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introCompleted', 'true');
    setHasIntroCompleted(true);
  };

  return (
    <main style={{ minHeight: '100vh' }}>
      {!hasIntroCompleted && <IntroScreen onEnter={handleIntroComplete} />}
      <CustomCursor />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <Console />
      <NetworkMonitor />
      <SystemHealthWidget />
    </main>
  );
}

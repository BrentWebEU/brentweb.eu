import { useEffect, useState } from "react";

/**
 * Hook for scroll-based animations on sections
 * Adds data-in-view attribute for CSS animations
 */
export function useScrollAnimation() {
  const [inViewSections, setInViewSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          (entry.target as HTMLElement).dataset.inView = "true";
          setInViewSections((prev) => new Set(prev).add(sectionId));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px",
    });

    const initObserver = () => {
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        element.dataset.inView = isVisible ? "true" : "false";
        observer.observe(element);
      });
    };

    const timeoutId = setTimeout(initObserver, 50);

    return () => {
      clearTimeout(timeoutId);
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return inViewSections;
}

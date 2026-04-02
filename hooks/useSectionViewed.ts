import { useState, useEffect, useRef } from "react";

export interface SectionViewState {
  id: string;
  viewed: boolean;
  viewedAt?: number;
}

const SECTION_IDS = [
  "about",
  "experience",
  "services",
  "projects",
  "contact",
] as const;

export type SectionId = typeof SECTION_IDS[number];

const STORAGE_KEY = "sectionViews";

/**
 * Hook to track which sections have been viewed using IntersectionObserver
 * Persists viewed state in localStorage
 */
export function useSectionViewed() {
  const [viewedSections, setViewedSections] = useState<Set<SectionId>>(new Set());
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SectionViewState[];
        const viewed = new Set<SectionId>();
        parsed.forEach((state) => {
          if (state.viewed && SECTION_IDS.includes(state.id as SectionId)) {
            viewed.add(state.id as SectionId);
          }
        });
        setViewedSections(viewed);
      }
    } catch (error) {
      console.warn("Failed to load section views from localStorage", error);
    }
  }, []);

  // Set up IntersectionObserver for each section
  useEffect(() => {
    const newObservers = new Map<string, IntersectionObserver>();

    SECTION_IDS.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      // Skip if already viewed
      if (viewedSections.has(sectionId)) return;

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Mark as viewed
            setViewedSections((prev) => {
              const updated = new Set(prev);
              updated.add(sectionId);
              
              // Persist to localStorage
              try {
                const stored = localStorage.getItem(STORAGE_KEY);
                const existing = stored ? (JSON.parse(stored) as SectionViewState[]) : [];
                const updatedStates: SectionViewState[] = existing.filter(
                  (s) => s.id !== sectionId
                );
                updatedStates.push({
                  id: sectionId,
                  viewed: true,
                  viewedAt: Date.now(),
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStates));
              } catch (error) {
                console.warn("Failed to save section view to localStorage", error);
              }
              
              return updated;
            });

            // Disconnect observer after viewing
            observer.disconnect();
          }
        });
      };

      const observer = new IntersectionObserver(
        handleIntersection,
        {
          threshold: 0.3, // Trigger when 30% of section is visible
          rootMargin: "-50px 0px", // Account for fixed nav
        }
      );

      observer.observe(element);
      newObservers.set(sectionId, observer);
    });

    observersRef.current = newObservers;

    // Cleanup
    return () => {
      newObservers.forEach((observer) => observer.disconnect());
    };
  }, [viewedSections]);

  const getViewedCount = () => {
    // Hero is always considered viewed
    return viewedSections.size + 1;
  };

  const getTotalCount = () => {
    return SECTION_IDS.length + 1; // +1 for hero
  };

  const isViewed = (sectionId: SectionId) => {
    return viewedSections.has(sectionId);
  };

  return {
    viewedSections,
    getViewedCount,
    getTotalCount,
    isViewed,
    sectionIds: SECTION_IDS,
  };
}

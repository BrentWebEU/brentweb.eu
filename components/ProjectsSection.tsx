'use client';

import { useRef, useState, memo, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { ProjectDialog } from "./ProjectDialog";
import { ProjectMarqueeRow } from "./ProjectMarqueeRow";
import { useTranslations } from "@/hooks/useTranslations";

const IMAGE_MAP: Record<string, string> = {
  carrosserieKris: "/carrosseriekris.png",
  provilion: "/provilion.png",
  hetsmaakpand: "/hetsmaakpand.png",
};

export const ProjectsSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslations();
  
  const projects = useMemo(() => {
    const projectItems = t('projects.items') as any[];
    return projectItems.map((item: any) => ({
      ...item,
      image: IMAGE_MAP[item.image] || item.image,
    }));
  }, [t]);

  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  const handleProjectClick = useCallback(
    (project: (typeof projects)[0]) => setSelectedProject(project),
    []
  );
  const handleCloseDialog = useCallback(() => setSelectedProject(null), []);

  return (
    <section id="projects" ref={ref} className="section section--tight">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: "center", marginBottom: "var(--space-12)", position: "relative" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              display: "inline-block",
              padding: "var(--space-1) var(--space-3)",
              border: "1px solid hsl(var(--primary) / 0.3)",
              color: "var(--color-primary)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-mono)",
              marginBottom: "var(--space-4)"
            }}
          >
            {t('projects.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "clamp(1.875rem, 4vw, 3rem)",
              fontWeight: "var(--font-weight-bold)",
              marginBottom: "var(--space-4)"
            }}
          >
            {t('projects.title')}
          </motion.h2>
          <span className="projects__annotation">{t('projects.annotation')}</span>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-muted-foreground)",
              maxWidth: "36rem",
              marginInline: "auto"
            }}
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        <div>
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + (index * 0.1),
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <ProjectMarqueeRow
                project={project}
                onClick={() => handleProjectClick(project)}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectDialog
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseDialog}
      />
    </section>
  );
});

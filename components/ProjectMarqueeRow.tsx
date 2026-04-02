import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectMarqueeRowProps {
  project: {
    title: string;
    category: string;
    tags: string[];
    color?: string;
  };
  onClick: () => void;
  index: number;
}

export const ProjectMarqueeRow = memo(({ project, onClick, index }: ProjectMarqueeRowProps) => {
  // Duplicate project name for seamless marquee
  const marqueeItems = Array(8).fill(project.title);

  return (
    <div className="project-row">
      <div 
        className="project-row__content"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="project-row__track">
          <motion.div
            className="project-row__marquee"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20 + index * 2,
                ease: "linear",
              }
            }}
          >
            {marqueeItems.map((item, i) => (
              <div key={i} className="project-row__item-wrapper">
                <span className="project-row__name">{item}</span>
                <span className="project-row__separator">•</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="project-row__view">
          <span className="project-row__view-text">View</span>
          <ExternalLink className="project-row__view-icon" />
        </div>
      </div>

      <div className="project-row__tags">
        <span className="project-row__category">{project.category}</span>
        <span className="project-row__tags-separator">•</span>
        {project.tags.slice(0, 3).map((tag, i) => (
          <span key={tag} className="project-row__tag">
            {tag}
            {i < Math.min(2, project.tags.length - 1) && <span className="project-row__tag-sep"> •</span>}
          </span>
        ))}
      </div>
    </div>
  );
});

ProjectMarqueeRow.displayName = "ProjectMarqueeRow";

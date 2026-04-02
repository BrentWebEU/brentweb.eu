'use client';

import {
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  Monitor,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

interface Project {
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  color: string;
  longDescription?: string;
  features?: string[];
  liveUrl?: string;
  githubUrl?: string;
  type?: "website" | "mobile" | "desktop" | "other";
}

interface ProjectDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const TypeIcon = ({ type }: { type: Project["type"] }) => {
  const iconStyle = { width: "0.875rem", height: "0.875rem" };
  switch (type) {
    case "website":
      return <Globe style={iconStyle} />;
    case "mobile":
      return <Smartphone style={iconStyle} />;
    case "desktop":
      return <Monitor style={iconStyle} />;
    default:
      return <Globe style={iconStyle} />;
  }
};

const getTypeLabels = (t: ReturnType<typeof useTranslations>['t']): Record<NonNullable<Project["type"]>, string> => {
  return {
  website: t('projects.type.web'),
  mobile: t('projects.type.mobile'),
  desktop: t('projects.type.desktop'),
  other: t('projects.type.other'),
  };
};

export const ProjectDialog = ({
  project,
  isOpen,
  onClose,
}: ProjectDialogProps) => {
  const { t } = useTranslations();
  const typeLabels = getTypeLabels(t);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    setIframeError(false);
  }, [project]);

  if (!project) return null;

  const projectType = project.type || "website";
  const hasLivePreview =
    projectType === "website" &&
    project.liveUrl &&
    project.liveUrl !== "#" &&
    !iframeError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("project-dialog-content", "dialog-content")}>
        <DialogTitle className="sr-only">{project.title}</DialogTitle>

        <div className="project-dialog__layout">
          <div className="project-dialog__preview">
            <div className="project-dialog__preview-inner">
              <img
                src={project.image}
                alt={project.title}
                className="project-dialog__image"
              />
              <div className="project-dialog__gradient" />
              
              {hasLivePreview && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-dialog__live-button"
                >
                  <ExternalLink style={{ width: "1rem", height: "1rem" }} />
                  {t('projects.viewProject')}
                </a>
              )}

              {projectType !== "website" && (
                <div className="project-dialog__type-badge">
                  <TypeIcon type={projectType} />
                  {typeLabels[projectType]}
                </div>
              )}
            </div>
          </div>

          <div className="project-dialog__content">
            <div className="project-dialog__header">
              <div className="project-dialog__badges">
                <span
                  className="project-dialog__category-badge"
                  style={{
                    backgroundColor: project.color + "15",
                    color: project.color,
                    borderColor: project.color + "30",
                  }}
                >
                  {project.category}
                </span>
                <span className="project-dialog__type-badge-small">
                  <TypeIcon type={projectType} />
                  {typeLabels[projectType]}
                </span>
              </div>
              <h2 className="project-dialog__title">
                {project.title}
              </h2>
            </div>

            <p className="project-dialog__description">
              {project.longDescription || project.description}
            </p>

            {project.features && project.features.length > 0 && (
              <div className="project-dialog__section">
                <h4 className="project-dialog__section-title">
                  {t('projects.whatItDoes')}
                </h4>
                <ul className="project-dialog__features">
                  {project.features.map((feature, i) => (
                    <li key={i} className="project-dialog__feature">
                      <span className="project-dialog__feature-bullet">•</span>
                      <span className="project-dialog__feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.tags.length > 0 && (
              <div className="project-dialog__section">
                <h4 className="project-dialog__section-title">
                  {t('projects.techStack')}
                </h4>
                <div className="project-dialog__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-dialog__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="project-dialog__actions">
              {project.liveUrl && project.liveUrl !== "#" && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-dialog__action-button"
                >
                  <ExternalLink className="project-dialog__action-icon" />
                  {t('projects.viewProject')}
                </a>
              )}
              {project.githubUrl && project.githubUrl !== "#" && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("project-dialog__action-button", "project-dialog__action-button--secondary")}
                >
                  <Github className="project-dialog__action-icon" />
                  {t('projects.viewCode')}
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

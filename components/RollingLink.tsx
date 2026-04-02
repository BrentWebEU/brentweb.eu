import { memo } from "react";

interface RollingLinkProps {
  href?: string;
  children: string;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  as?: "a" | "span" | "button";
}

export const RollingLink = memo(({ 
  href, 
  children, 
  className = "", 
  onClick,
  target,
  rel,
  as: Component = "a"
}: RollingLinkProps) => {
  const letters = children.split("");
  
  const props = Component === "a" ? { href, target, rel } : {};
  
  return (
    <Component
      {...props}
      onClick={onClick}
      className={`rolling-link hoverable ${className}`}
    >
      <span className="rolling-link-inner">
        <span className="rolling-link-text rolling-link-initial" aria-hidden="true">
          {letters.map((letter, i) => (
            <span
              key={`initial-${i}`}
              className="rolling-letter"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
        
        <span className="rolling-link-text rolling-link-text-active" aria-hidden="true">
          {letters.map((letter, i) => (
            <span
              key={`active-${i}`}
              className="rolling-letter"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>
      
      <span className="sr-only">{children}</span>
    </Component>
  );
});

RollingLink.displayName = "RollingLink";

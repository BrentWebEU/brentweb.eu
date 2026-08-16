import type { ReactNode } from 'react';

function Callout({ children }: { children: ReactNode }) {
  return <div className="case-study__callout">{children}</div>;
}

function MetricGrid({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <dl className="case-study__metric-grid">
      {metrics.map((metric) => (
        <div key={metric.label} className="case-study__metric">
          <dd className="case-study__metric-value">{metric.value}</dd>
          <dt className="case-study__metric-label">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * Deliberately a plain <img>, not next/image: case-study diagrams live in
 * content/case-studies/ (outside the app's build-time image pipeline), and
 * this keeps the MDX pipeline free of a static-path allowlist to maintain.
 */
function ArchitectureDiagram({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="case-study__diagram">
      <img src={src} alt={alt} className="case-study__diagram-image" loading="lazy" />
      {caption && <figcaption className="case-study__diagram-caption">{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="case-study__h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="case-study__h3" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="case-study__p" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="case-study__ul" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="case-study__link" {...props} />,
  Callout,
  MetricGrid,
  ArchitectureDiagram,
};

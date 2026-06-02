/** Skeleton de carregamento com aria-busy — melhora o estado "carregando" (Unidade 2). */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando produtos…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i} aria-hidden="true">
          <div className="skeleton skeleton-thumb" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

import type { ScopeKey, TimelineKey, BudgetKey } from '@/lib/schemas/lead';

/**
 * The computable brackets: every budget the form offers except 'not-sure',
 * which is a visitor's answer rather than an estimator output. Derived from
 * BUDGET_KEYS so the two lists cannot drift — widening this type turns
 * BRACKET_LABELS below into a compile error rather than a silent gap.
 */
export type BudgetBracket = Exclude<BudgetKey, 'not-sure'>;

export interface EstimatorInput {
  scope: ScopeKey[];
  timeline: TimelineKey;
}

export interface EstimatorResult {
  bracket: BudgetBracket;
  estimatedWeeks: [number, number];
  /** Echoed back so callers can look up per-scope copy in the message bundle. */
  scope: ScopeKey[];
  /** The caller renders `calculator.result.rushNote` when this is true. */
  isRush: boolean;
}

export interface ScopeDefinition {
  minCost: number;
  maxCost: number;
  minWeeks: number;
  maxWeeks: number;
}

/**
 * Deterministic rule table — no AI, no database. Each scope item contributes
 * a cost/duration range; a selection sums the ranges of every item picked.
 *
 * Priced for a student-zelfstandige working alongside study, not an agency:
 * the week ranges assume part-time hours, and the costs sit well below
 * agency rates by design.
 *
 * Numbers only. Every user-facing string that used to live here — item
 * labels, "what's included" bullets, the rush note — moved to the message
 * bundle, because they were rendered verbatim to Dutch visitors in both the
 * estimator and the generated PDF.
 */
export const SCOPE_DEFINITIONS: Record<ScopeKey, ScopeDefinition> = {
  // ⚠ TODO(brent): confirm these two bands.
  //
  // `web_app` used to cover "a new site, app, or admin panel" at 600-2000 /
  // 3-6 weeks. Splitting sites out of it means neither band is verified any
  // more: `website` is currently a copy of the old combined number, and
  // `web_app` now covers only the heavier app work, so its floor is probably
  // too low. Both are placeholders until you give me the real figures.
  website: {
    minCost: 600,
    maxCost: 2000,
    minWeeks: 2,
    maxWeeks: 6,
  },
  web_app: {
    minCost: 800,
    maxCost: 2500,
    minWeeks: 3,
    maxWeeks: 8,
  },
  api_integration: {
    minCost: 300,
    maxCost: 900,
    minWeeks: 1,
    maxWeeks: 3,
  },
  automation: {
    minCost: 250,
    maxCost: 800,
    minWeeks: 1,
    maxWeeks: 2,
  },
};

function bracketFor(cost: number): BudgetBracket {
  if (cost < 500) return '<500';
  if (cost < 1500) return '500-1500';
  if (cost < 3000) return '1500-3000';
  return '3000+';
}

/**
 * Bracket bounds as numbers, not pre-formatted strings.
 *
 * These used to be English-formatted literals ("€1,500 – €3,000"), which put a
 * comma thousands separator in front of Dutch-speaking visitors in both the
 * estimator and the PDF. `null` marks an open end.
 */
const BRACKET_BOUNDS: Record<BudgetBracket, [number | null, number | null]> = {
  '<500': [null, 500],
  '500-1500': [500, 1500],
  '1500-3000': [1500, 3000],
  '3000+': [3000, null],
};

/** Locale-aware budget range, e.g. "€500 - €1,500" / "€500 - €1.500". */
export function formatBracket(bracket: BudgetBracket, locale: string): string {
  const money = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
  const [min, max] = BRACKET_BOUNDS[bracket];
  if (min === null) return `< ${money.format(max as number)}`;
  if (max === null) return `${money.format(min)}+`;
  return `${money.format(min)} - ${money.format(max)}`;
}

export function estimate({ scope, timeline }: EstimatorInput): EstimatorResult {
  const defs = scope.map((key) => SCOPE_DEFINITIONS[key]);

  const minCost = defs.reduce((sum, def) => sum + def.minCost, 0);
  const maxCost = defs.reduce((sum, def) => sum + def.maxCost, 0);
  const minWeeks = defs.reduce((sum, def) => sum + def.minWeeks, 0);
  const maxWeeks = defs.reduce((sum, def) => sum + def.maxWeeks, 0);

  // Bracket the midpoint so a wide min/max split doesn't land on a
  // misleadingly optimistic (or pessimistic) bracket.
  const bracket = bracketFor((minCost + maxCost) / 2);


  return {
    bracket,
    estimatedWeeks: [minWeeks, maxWeeks],
    scope,
    isRush: timeline === 'asap',
  };
}

import { z } from 'zod';
import { locales } from '@/i18n';
import { AUDIENCES } from '@/lib/audience';

/**
 * Shared by both the contact form and the calculator. Kept in a plain module
 * (no 'use server') because it's imported client-side for zodResolver too.
 */

export const SCOPE_KEYS = ['website', 'web_app', 'api_integration', 'automation'] as const;
export type ScopeKey = (typeof SCOPE_KEYS)[number];

export const TIMELINE_KEYS = ['asap', '1-3m', '3-6m', '6m-plus', 'not-sure'] as const;
export type TimelineKey = (typeof TIMELINE_KEYS)[number];

/**
 * Budget brackets offered on the contact form, scaled to what a
 * student-zelfstandige actually charges — small sites and fixes at the bottom,
 * a full application at the top. The first four are the same brackets the
 * calculator computes: `lib/calculator/pricing.ts` derives its `BudgetBracket`
 * from this list via Exclude<>, so the two cannot drift. They live here rather
 * than in pricing.ts because pricing.ts already imports from this module.
 */
export const BUDGET_KEYS = ['<500', '500-1500', '1500-3000', '3000+', 'not-sure'] as const;
export type BudgetKey = (typeof BUDGET_KEYS)[number];

const baseLeadFields = {
  name: z.string().trim().min(2, 'Name is too short').max(100),
  email: z.string().trim().email('Enter a valid email address').max(200),
  // Honeypot: real visitors never see or fill this field. Any non-empty value
  // means a bot filled every field it could find — see submitLead's handling.
  honeypot: z.string().max(0).optional().default(''),
  // boolean (not z.literal(true)) so react-hook-form's checkbox state — which
  // is a plain boolean while unchecked — type-checks; refine enforces truthy.
  gdprConsent: z.boolean().refine((v) => v === true, { message: 'Consent is required to submit this form' }),
  locale: z.enum(locales),
};

export const contactLeadSchema = z.object({
  source: z.literal('contact'),
  ...baseLeadFields,
  audience: z.enum(AUDIENCES),
  message: z.string().trim().min(10, 'Tell me a bit more').max(5000),
  // Qualification fields, collected on the business path only. Optional here
  // so this stays a bare ZodObject: z.discriminatedUnion below rejects the
  // ZodEffects that .superRefine() would produce. The business-audience
  // requirement is enforced by contactLeadFormSchema on the client and by an
  // explicit check in app/actions/submit-lead.ts on the server.
  budget: z.enum(BUDGET_KEYS).optional(),
  timeline: z.enum(TIMELINE_KEYS).optional(),
});
export type ContactLead = z.infer<typeof contactLeadSchema>;

/** Client-side resolver schema — adds the business-only field requirement. */
export const contactLeadFormSchema = contactLeadSchema.superRefine((value, ctx) => {
  if (value.audience !== 'business') return;
  if (!value.budget) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['budget'], message: 'Select a budget range' });
  }
  if (!value.timeline) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['timeline'], message: 'Select a timeline' });
  }
});

export const calculatorLeadSchema = z.object({
  source: z.literal('calculator'),
  ...baseLeadFields,
  company: z.string().trim().max(200).optional(),
  scope: z.array(z.enum(SCOPE_KEYS)).min(1, 'Pick at least one scope item'),
  timeline: z.enum(TIMELINE_KEYS),
  // Deliberately no budgetBracket field here: the server always recomputes
  // the estimate from scope+timeline via lib/calculator/pricing.ts rather
  // than trusting a client-supplied figure in the lead email.
  notes: z.string().trim().max(2000).optional(),
});
export type CalculatorLead = z.infer<typeof calculatorLeadSchema>;

export const leadSubmissionSchema = z.discriminatedUnion('source', [
  contactLeadSchema,
  calculatorLeadSchema,
]);
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

// Chair earnings calculator — open decisions, in one place.
// Flip a value here. Do not scatter these choices through the page.

/**
 * Where the button under the unlocked result points.
 * PLACEHOLDER: the owner has not chosen a course, membership pricing, or a free resource.
 * Default is the programmes page.
 */
const resultCta = {
  placeholder: true,
  to: "/courses",
  labelKey: "calc.cta.label",
} as const;

export const calculatorConfig = {
  /**
   * 1. Kit confirmation.
   * false (default): calculator signups go straight onto the list, the same way the footer does.
   * Kit then treats a new subscriber as active, and this code does not ask for a confirmation email.
   * true: create the subscriber as inactive so a double opt-in Kit form can send the confirmation.
   */
  requireEmailConfirmation: false,

  /**
   * 2. Weekly number before signup.
   * true (default): the weekly estimate is visible before the visitor joins.
   * false: hide that number until signup, together with the yearly total.
   */
  showWeeklyBeforeSignup: true,

  /**
   * 3. After-result button. PLACEHOLDER destination — see `resultCta` above.
   */
  resultCta,

  /**
   * Main navigation link. The header reads this flag.
   * A /calc short link and a sitemap entry are still not added.
   */
  showInMainNav: true,
};

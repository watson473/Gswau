// Pure chair-earnings math for stylists. No React, no network.
// One calculator, one set of defaults. Every signup is recorded as a stylist.

export const CALCULATOR_SERVICE_TYPE = "stylist" as const;

export type PayModel = "keep100" | "boothRent" | "commission";

export type ChairEarningsInput = {
  /** US dollars per service. */
  price: number;
  clientsPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
  tipsOn: boolean;
  /** Percent of service revenue, kept in full by the stylist. */
  tipPct: number;
  payModel: PayModel;
  /** US dollars per week. Deducted for all 52 weeks when booth rent is the pay model. */
  boothRentPerWeek: number;
  /** Percent of service revenue the stylist keeps when pay is commission. */
  commissionPct: number;
};

export const CHAIR_EARNINGS_LIMITS = {
  price: { min: 5, max: 500 },
  clientsPerDay: { min: 1, max: 30 },
  daysPerWeek: { min: 1, max: 7 },
  weeksPerYear: { min: 1, max: 52 },
  tipPct: { min: 0, max: 50 },
  boothRentPerWeek: { min: 0, max: 2000 },
  commissionPct: { min: 10, max: 100 },
} as const;

export const CHAIR_EARNINGS_DEFAULTS: ChairEarningsInput = {
  price: 35,
  clientsPerDay: 8,
  daysPerWeek: 5,
  weeksPerYear: 48,
  tipsOn: false,
  tipPct: 15,
  payModel: "keep100",
  boothRentPerWeek: 250,
  commissionPct: 60,
};

export type ChairEarningsResult = ChairEarningsInput & {
  servicesPerYear: number;
  serviceRevenue: number;
  tips: number;
  /** Booth rent × 52. Zero unless that pay model is selected. */
  rentDeduction: number;
  /** Service revenue after commission or booth rent, before tips. */
  serviceTakeHome: number;
  yearly: number;
  monthly: number;
  weekly: number;
  /** Extra pre-tax yearly amount from charging $5 more per service. */
  priceLever: number;
};

function clamp(value: number, fallback: number, min: number, max: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function clampInt(value: number, fallback: number, min: number, max: number) {
  return Math.round(clamp(value, fallback, min, max));
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export function clampChairInput(input: Partial<ChairEarningsInput> = {}): ChairEarningsInput {
  const d = CHAIR_EARNINGS_DEFAULTS;
  const limits = CHAIR_EARNINGS_LIMITS;
  const payModel: PayModel =
    input.payModel === "boothRent" || input.payModel === "commission" ? input.payModel : "keep100";
  return {
    price: money(clamp(input.price ?? d.price, d.price, limits.price.min, limits.price.max)),
    clientsPerDay: clampInt(
      input.clientsPerDay ?? d.clientsPerDay,
      d.clientsPerDay,
      limits.clientsPerDay.min,
      limits.clientsPerDay.max,
    ),
    daysPerWeek: clampInt(
      input.daysPerWeek ?? d.daysPerWeek,
      d.daysPerWeek,
      limits.daysPerWeek.min,
      limits.daysPerWeek.max,
    ),
    weeksPerYear: clampInt(
      input.weeksPerYear ?? d.weeksPerYear,
      d.weeksPerYear,
      limits.weeksPerYear.min,
      limits.weeksPerYear.max,
    ),
    tipsOn: input.tipsOn ?? d.tipsOn,
    tipPct: money(clamp(input.tipPct ?? d.tipPct, d.tipPct, limits.tipPct.min, limits.tipPct.max)),
    payModel,
    boothRentPerWeek: money(
      clamp(
        input.boothRentPerWeek ?? d.boothRentPerWeek,
        d.boothRentPerWeek,
        limits.boothRentPerWeek.min,
        limits.boothRentPerWeek.max,
      ),
    ),
    commissionPct: money(
      clamp(
        input.commissionPct ?? d.commissionPct,
        d.commissionPct,
        limits.commissionPct.min,
        limits.commissionPct.max,
      ),
    ),
  };
}

function earningsFrom(input: ChairEarningsInput): Omit<ChairEarningsResult, "priceLever"> {
  const servicesPerYear = input.clientsPerDay * input.daysPerWeek * input.weeksPerYear;
  const serviceRevenue = money(servicesPerYear * input.price);
  const tips = input.tipsOn ? money(serviceRevenue * (input.tipPct / 100)) : 0;
  const rentDeduction = input.payModel === "boothRent" ? money(input.boothRentPerWeek * 52) : 0;
  const serviceTakeHome =
    input.payModel === "commission"
      ? money(serviceRevenue * (input.commissionPct / 100))
      : money(serviceRevenue - rentDeduction);
  const yearly = money(serviceTakeHome + tips);
  return {
    ...input,
    servicesPerYear,
    serviceRevenue,
    tips,
    rentDeduction,
    serviceTakeHome,
    yearly,
    monthly: money(yearly / 12),
    weekly: input.weeksPerYear > 0 ? money(yearly / input.weeksPerYear) : 0,
  };
}

export function calculateChairEarnings(
  input: Partial<ChairEarningsInput> = {},
): ChairEarningsResult {
  const clamped = clampChairInput(input);
  const current = earningsFrom(clamped);
  const raised = earningsFrom({ ...clamped, price: money(clamped.price + 5) });
  return { ...current, priceLever: money(raised.yearly - current.yearly) };
}

/** Kit custom fields. Unknown fields are the caller's problem to drop, not this function's. */
export function kitFieldsForEstimate(result: ChairEarningsResult): Record<string, string> {
  return {
    service_type: CALCULATOR_SERVICE_TYPE,
    chair_rate: String(result.price),
    yearly_estimate: String(Math.round(result.yearly)),
  };
}

export function formatUsd(amount: number, fractionDigits: 0 | 2 = 0): string {
  const value = fractionDigits === 0 ? Math.round(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Price in the visible equation: $35, or $35.50 when there are cents. */
export function formatUsdPrice(amount: number): string {
  return formatUsd(amount, Number.isInteger(amount) ? 0 : 2);
}

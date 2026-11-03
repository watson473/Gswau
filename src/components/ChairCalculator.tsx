import { useEffect, useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { calculatorConfig } from "@/lib/calculator.config";
import {
  CHAIR_EARNINGS_DEFAULTS,
  CHAIR_EARNINGS_LIMITS,
  type ChairEarningsInput,
  type ChairEarningsResult,
  calculateChairEarnings,
  clampChairInput,
  formatUsd,
  formatUsdPrice,
} from "@/lib/chairEarnings";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n";

const UNLOCK_KEY = "gswau_calc_unlocked";

const assumptionKeys = [
  "calc.assume.pretax",
  "calc.assume.rent",
  "calc.assume.tips",
  "calc.assume.commission",
  "calc.assume.price",
  "calc.assume.usd",
] as const;

export function ChairCalculator() {
  const { t } = useT();
  const [input, setInput] = useState<ChairEarningsInput>({ ...CHAIR_EARNINGS_DEFAULTS });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const result = calculateChairEarnings(input);
  const weeklyVisible = unlocked || calculatorConfig.showWeeklyBeforeSignup;
  const adjusted = result.tipsOn || result.payModel !== "keep100";
  const weeksOff = 52 - result.weeksPerYear;

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      // Private mode can block storage. The gate still works for this visit.
    }
  }, []);

  useEffect(() => {
    if (!celebrate) return;
    const id = window.setTimeout(() => setCelebrate(false), 900);
    return () => window.clearTimeout(id);
  }, [celebrate]);

  function patch(partial: Partial<ChairEarningsInput>, commit = false) {
    setInput((prev) =>
      commit ? clampChairInput({ ...prev, ...partial }) : { ...prev, ...partial },
    );
  }

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const snapshot = clampChairInput(input);
      const estimate = calculateChairEarnings(snapshot);
      await subscribeNewsletter({
        data: {
          email,
          name,
          source: "calculator",
          honeypot,
          pageUrl: window.location.href.slice(0, 1000),
          calculator: snapshot,
        },
      });
      track("newsletter_signup", {
        source: "calculator",
        service_type: "stylist",
        chair_rate: estimate.price,
        yearly_estimate: Math.round(estimate.yearly),
      });
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        // The results still show for this visit.
      }
      setUnlocked(true);
      setJustJoined(true);
      setCelebrate(true);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <section className="bg-navy-gradient text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
          <div className="eyebrow text-gold">{t("calc.eyebrow")}</div>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            {t("calc.title")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            {t("calc.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
          <div className="order-2 lg:order-1">
            <div className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
              <div className="grid gap-6">
                <MoneyField
                  label={t("calc.price")}
                  hint={t("calc.priceHint")}
                  value={input.price}
                  min={CHAIR_EARNINGS_LIMITS.price.min}
                  max={CHAIR_EARNINGS_LIMITS.price.max}
                  onChange={(price) => patch({ price })}
                  onCommit={(price) => patch({ price }, true)}
                />
                <Stepper
                  label={t("calc.clients")}
                  value={input.clientsPerDay}
                  min={CHAIR_EARNINGS_LIMITS.clientsPerDay.min}
                  max={CHAIR_EARNINGS_LIMITS.clientsPerDay.max}
                  onChange={(clientsPerDay) => patch({ clientsPerDay }, true)}
                />
                <Stepper
                  label={t("calc.days")}
                  value={input.daysPerWeek}
                  min={CHAIR_EARNINGS_LIMITS.daysPerWeek.min}
                  max={CHAIR_EARNINGS_LIMITS.daysPerWeek.max}
                  onChange={(daysPerWeek) => patch({ daysPerWeek }, true)}
                />
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="calc-weeks" className="text-sm font-semibold">
                      {t("calc.weeks")}
                    </label>
                    <span className="text-sm font-semibold tabular-nums">
                      {result.weeksPerYear}
                    </span>
                  </div>
                  <input
                    id="calc-weeks"
                    type="range"
                    min={CHAIR_EARNINGS_LIMITS.weeksPerYear.min}
                    max={CHAIR_EARNINGS_LIMITS.weeksPerYear.max}
                    value={input.weeksPerYear}
                    onChange={(e) => patch({ weeksPerYear: Number(e.target.value) }, true)}
                    className="mt-3 h-11 w-full cursor-pointer accent-gold"
                  />
                  <p className="text-xs text-muted-foreground">
                    {weeksOff === 0 ? t("calc.weeksAll") : t("calc.weeksOff", { count: weeksOff })}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <button
                  type="button"
                  aria-expanded={optionsOpen}
                  aria-controls="calc-options"
                  onClick={() => setOptionsOpen((open) => !open)}
                  className="min-h-11 text-left text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {optionsOpen ? t("calc.optionalHide") : t("calc.optionalShow")}
                </button>
                <p className="mt-1 text-xs text-muted-foreground">{t("calc.optionalHint")}</p>
                {optionsOpen && (
                  <div id="calc-options" className="mt-5 grid gap-5">
                    <div>
                      <label className="flex min-h-11 items-center justify-between gap-3 text-sm font-semibold">
                        {t("calc.tips")}
                        <input
                          type="checkbox"
                          checked={input.tipsOn}
                          onChange={(e) => patch({ tipsOn: e.target.checked })}
                          className="h-5 w-5 accent-gold"
                        />
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">{t("calc.tipsHint")}</p>
                      {input.tipsOn && (
                        <PercentField
                          className="mt-3"
                          label={t("calc.tipPct")}
                          value={input.tipPct}
                          min={CHAIR_EARNINGS_LIMITS.tipPct.min}
                          max={CHAIR_EARNINGS_LIMITS.tipPct.max}
                          onChange={(tipPct) => patch({ tipPct })}
                          onCommit={(tipPct) => patch({ tipPct }, true)}
                        />
                      )}
                    </div>

                    <fieldset>
                      <legend className="text-sm font-semibold">{t("calc.payModel")}</legend>
                      <div className="mt-3 grid gap-2">
                        <PayOption
                          name="pay-model"
                          checked={input.payModel === "keep100"}
                          onSelect={() => patch({ payModel: "keep100" })}
                          label={t("calc.pay.keep100")}
                          hint={t("calc.pay.keep100Hint")}
                        />
                        <PayOption
                          name="pay-model"
                          checked={input.payModel === "boothRent"}
                          onSelect={() => patch({ payModel: "boothRent" })}
                          label={t("calc.pay.booth")}
                          hint={t("calc.pay.boothHint")}
                        />
                        <PayOption
                          name="pay-model"
                          checked={input.payModel === "commission"}
                          onSelect={() => patch({ payModel: "commission" })}
                          label={t("calc.pay.commission")}
                          hint={t("calc.pay.commissionHint")}
                        />
                      </div>
                    </fieldset>

                    {input.payModel === "boothRent" && (
                      <MoneyField
                        label={t("calc.rent")}
                        hint={t("calc.rentHint")}
                        value={input.boothRentPerWeek}
                        min={CHAIR_EARNINGS_LIMITS.boothRentPerWeek.min}
                        max={CHAIR_EARNINGS_LIMITS.boothRentPerWeek.max}
                        onChange={(boothRentPerWeek) => patch({ boothRentPerWeek })}
                        onCommit={(boothRentPerWeek) => patch({ boothRentPerWeek }, true)}
                      />
                    )}
                    {input.payModel === "commission" && (
                      <PercentField
                        label={t("calc.commission")}
                        value={input.commissionPct}
                        min={CHAIR_EARNINGS_LIMITS.commissionPct.min}
                        max={CHAIR_EARNINGS_LIMITS.commissionPct.max}
                        onChange={(commissionPct) => patch({ commissionPct })}
                        onCommit={(commissionPct) => patch({ commissionPct }, true)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <ResultCard
              result={result}
              weeklyVisible={weeklyVisible}
              adjusted={adjusted}
              unlocked={unlocked}
              celebrate={celebrate}
              gateOpen={gateOpen}
              justJoined={justJoined}
              onShowGate={() => setGateOpen(true)}
              name={name}
              email={email}
              honeypot={honeypot}
              status={status}
              onName={setName}
              onEmail={setEmail}
              onHoneypot={setHoneypot}
              onUnlock={unlock}
            />
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">{t("calc.assumptionsTitle")}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {assumptionKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-foreground">{t("calc.disclaimer")}</p>
        </div>
      </section>
    </div>
  );
}

function ResultCard({
  result,
  weeklyVisible,
  adjusted,
  unlocked,
  justJoined,
  celebrate,
  gateOpen,
  onShowGate,
  name,
  email,
  honeypot,
  status,
  onName,
  onEmail,
  onHoneypot,
  onUnlock,
}: {
  result: ChairEarningsResult;
  weeklyVisible: boolean;
  adjusted: boolean;
  unlocked: boolean;
  justJoined: boolean;
  celebrate: boolean;
  gateOpen: boolean;
  onShowGate: () => void;
  name: string;
  email: string;
  honeypot: string;
  status: "idle" | "sending" | "error";
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onHoneypot: (value: string) => void;
  onUnlock: (e: FormEvent) => void;
}) {
  const { t } = useT();
  const emailId = useId();
  const nameId = useId();
  const factors = {
    clients: result.clientsPerDay,
    price: formatUsdPrice(result.price),
    days: result.daysPerWeek,
    weeks: result.weeksPerYear,
  };
  const equation = t("calc.math", factors);
  const weekEquation = t("calc.weekMath", factors);

  return (
    <div className="rounded-lg border border-gold bg-navy-deep p-5 text-primary-foreground shadow-card sm:p-6">
      {weeklyVisible ? (
        <div aria-live="polite">
          <p className="eyebrow text-gold">{t("calc.weeklyEyebrow")}</p>
          <p className="mt-2 font-display text-5xl leading-none text-gold sm:text-6xl">
            {formatUsd(result.weekly)}
          </p>
          {!adjusted && <p className="mt-3 text-sm font-semibold tabular-nums">{weekEquation}</p>}
          <p className="mt-2 text-sm text-primary-foreground/75">
            {adjusted ? t("calc.weeklyAdjusted") : t("calc.weeklyCaption")}
          </p>
        </div>
      ) : (
        !unlocked && <p className="text-sm text-primary-foreground/80">{t("calc.weeklyLocked")}</p>
      )}

      <div className={weeklyVisible || !unlocked ? "mt-5 border-t border-gold/30 pt-5" : ""}>
        <p className="eyebrow text-gold">{t("calc.mathLabel")}</p>
        <p className="mt-2 text-lg font-semibold tabular-nums">{equation}</p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          {adjusted ? t("calc.mathCaptionAdjusted") : t("calc.mathCaption")}
        </p>
      </div>

      {unlocked ? (
        <div aria-live="polite" className="mt-6">
          {justJoined && (
            <p className="text-sm text-gold">
              {calculatorConfig.requireEmailConfirmation
                ? t("calc.confirmInbox")
                : t("calc.unlockedNote")}
            </p>
          )}
          <p className={`eyebrow text-gold ${justJoined ? "mt-5" : ""}`}>{t("calc.yearEyebrow")}</p>
          <p className="mt-2 font-display text-5xl leading-none text-gold sm:text-6xl">
            <MoneyFigure amount={result.yearly} animate={celebrate} />
          </p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            {t("calc.perMonth", { amount: formatUsd(result.monthly) })}
            {" · "}
            {t("calc.perWeek", { amount: formatUsd(result.weekly) })}
          </p>

          <h2 className="eyebrow mt-6 text-gold">{t("calc.breakdown")}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label={t("calc.line.services")} value={formatUsd(result.serviceRevenue)} />
            {result.payModel === "commission" && (
              <Row
                label={t("calc.line.commission", { percent: result.commissionPct })}
                value={formatUsd(result.serviceTakeHome)}
              />
            )}
            {result.payModel === "boothRent" && (
              <Row label={t("calc.line.rent")} value={`−${formatUsd(result.rentDeduction)}`} />
            )}
            <Row
              label={t("calc.line.tips")}
              value={result.tipsOn ? formatUsd(result.tips) : t("calc.line.tipsOff")}
            />
            <Row label={t("calc.line.yearly")} value={formatUsd(result.yearly)} strong />
          </dl>

          <div className="mt-6 rounded-md border border-gold/40 bg-white/5 p-4">
            <p className="eyebrow text-gold">{t("calc.leverEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold">{t("calc.leverTitle")}</h2>
            <p className="mt-1 font-display text-3xl text-gold">
              {t("calc.leverAmount", { amount: formatUsd(result.priceLever) })}
            </p>
            <p className="mt-2 text-sm text-primary-foreground/75">
              {result.payModel === "commission"
                ? t("calc.leverCommission", { percent: result.commissionPct })
                : t("calc.leverBody")}
            </p>
          </div>

          <Link to={calculatorConfig.resultCta.to} className="btn-gold mt-6 w-full">
            {t(calculatorConfig.resultCta.labelKey)}
          </Link>
          <p className="mt-2 text-xs text-primary-foreground/60">{t("calc.cta.note")}</p>
          <p className="mt-4 text-xs text-primary-foreground/60">{t("calc.unlockedLive")}</p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-primary-foreground/80">{t("calc.yearlyHidden")}</p>
          <div className="mt-4" aria-hidden="true">
            <p className="eyebrow text-gold/70">{t("calc.yearEyebrow")}</p>
            <p className="mt-2 select-none font-display text-5xl text-gold blur-md">$••,•••</p>
          </div>
          {gateOpen ? (
            <form className="relative mt-5 grid gap-3" onSubmit={onUnlock}>
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => onHoneypot(e.target.value)}
                  />
                </label>
              </div>
              <label htmlFor={nameId} className="text-sm font-semibold">
                {t("footer.news.name")}
                <input
                  id={nameId}
                  type="text"
                  autoComplete="given-name"
                  maxLength={100}
                  value={name}
                  onChange={(e) => onName(e.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-md border border-gold/30 bg-white/5 px-3 text-base focus:border-gold focus:outline-none"
                />
              </label>
              <label htmlFor={emailId} className="text-sm font-semibold">
                {t("subscribe.placeholder")}
                <input
                  id={emailId}
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  onChange={(e) => onEmail(e.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-md border border-gold/30 bg-white/5 px-3 text-base focus:border-gold focus:outline-none"
                />
              </label>
              <p className="text-xs leading-relaxed text-primary-foreground/70">
                {t("calc.gate.micro")}{" "}
                <Link to="/privacy" className="underline">
                  {t("footer.co.privacy")}
                </Link>
              </p>
              <button
                className="btn-gold w-full disabled:opacity-60"
                disabled={status === "sending"}
              >
                {status === "sending" ? t("subscribe.sending") : t("calc.gate.unlock")}
              </button>
              {status === "error" && (
                <p role="alert" className="text-sm text-gold">
                  {t("subscribe.error")}
                </p>
              )}
            </form>
          ) : (
            <button type="button" className="btn-gold mt-5 w-full" onClick={onShowGate}>
              {t("calc.showYearly")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${strong ? "border-t border-gold/30 pt-2 font-semibold" : ""}`}
    >
      <dt className="min-w-0 text-primary-foreground/75">{label}</dt>
      <dd className="shrink-0 text-right tabular-nums">{value}</dd>
    </div>
  );
}

function MoneyFigure({ amount, animate }: { amount: number; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : amount);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduce) {
      setShown(amount);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 800);
      const eased = 1 - (1 - progress) ** 3;
      setShown(amount * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [amount, animate]);
  return <>{formatUsd(shown)}</>;
}

function MoneyField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
  onCommit,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
}) {
  const id = useId();
  const [text, setText] = useState(() => String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [focused, value]);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative mt-2">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          $
        </span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          min={min}
          max={max}
          value={text}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const next = e.target.value;
            if (!/^\d*\.?\d{0,2}$/.test(next)) return;
            setText(next);
            const n = Number(next);
            if (next !== "" && next !== "." && Number.isFinite(n)) onChange(n);
          }}
          onBlur={() => {
            setFocused(false);
            const n = Number(text);
            onCommit(Number.isFinite(n) ? n : value);
          }}
          className="min-h-11 w-full rounded-md border border-border bg-card pl-7 pr-3 text-base focus:border-gold focus:outline-none"
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PercentField({
  label,
  value,
  min,
  max,
  onChange,
  onCommit,
  className = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  className?: string;
}) {
  const id = useId();
  const [text, setText] = useState(() => String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [focused, value]);

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          min={min}
          max={max}
          value={text}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const next = e.target.value;
            if (!/^\d*\.?\d{0,2}$/.test(next)) return;
            setText(next);
            const n = Number(next);
            if (next !== "" && next !== "." && Number.isFinite(n)) onChange(n);
          }}
          onBlur={() => {
            setFocused(false);
            const n = Number(text);
            onCommit(Number.isFinite(n) ? n : value);
          }}
          className="min-h-11 w-full rounded-md border border-border bg-card px-3 pr-8 text-base focus:border-gold focus:outline-none"
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          %
        </span>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const { t } = useT();
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="flex items-center">
        <button
          type="button"
          aria-label={t("calc.decrease", { label })}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-11 w-11 place-items-center rounded-md border border-border disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (e.target.value === "") return;
            if (Number.isFinite(n)) onChange(Math.round(n));
          }}
          className="w-12 bg-transparent text-center text-base font-semibold focus:outline-none"
        />
        <button
          type="button"
          aria-label={t("calc.increase", { label })}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid h-11 w-11 place-items-center rounded-md border border-border disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PayOption({
  name,
  checked,
  onSelect,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2 has-[:checked]:border-gold">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="mt-1 h-4 w-4 accent-gold"
      />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  );
}

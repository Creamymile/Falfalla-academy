import { Check, CreditCard, Zap } from "lucide-react";
import { go } from "../router";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "one-time",
    tagline: "Perfect for beginners",
    description: "Get started with the foundations of espresso and milk craft.",
    features: [
      "Barista Foundations course",
      "HD video lessons",
      "Downloadable resources",
      "Community gallery access",
      "Certificate of completion",
    ],
    cta: "Get Starter",
    featured: false,
  },
  {
    name: "Academy",
    price: "$79",
    period: "one-time",
    tagline: "Most popular",
    description: "Full access to all three courses — the complete latte art journey.",
    features: [
      "All 3 courses included",
      "HD video lessons",
      "Downloadable resources",
      "Community gallery access",
      "Certificates for every course",
      "Priority support",
    ],
    cta: "Get Full Access",
    featured: true,
  },
  {
    name: "Cafe Team",
    price: "$249",
    period: "one-time",
    tagline: "For cafes & teams",
    description: "Train multiple staff members with full access to all courses.",
    features: [
      "Up to 5 team members",
      "All 3 courses included",
      "HD video lessons",
      "Downloadable resources",
      "Team progress tracking",
      "Certificates for every member",
    ],
    cta: "Train Your Team",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="page">
      <div className="section-heading pricing-heading">
        <p className="eyebrow">Pricing</p>
        <h1>Simple, transparent pricing.</h1>
        <p className="pricing-sub">One-time payment. No subscriptions. Lifetime access to your course.</p>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <article key={plan.name} className={`pricing-card ${plan.featured ? "pricing-featured" : ""}`}>
            {plan.featured && (
              <div className="pricing-popular-badge">
                <Zap size={12} /> Most Popular
              </div>
            )}
            <div className="pricing-top">
              <p className="eyebrow" style={{ color: plan.featured ? "var(--golden-crema)" : undefined }}>{plan.name}</p>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>
              <p className="pricing-tagline">{plan.tagline}</p>
              <p className="pricing-desc">{plan.description}</p>
            </div>

            <ul className="pricing-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <span className={`pricing-check ${plan.featured ? "pricing-check-featured" : ""}`}>
                    <Check size={13} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={plan.featured ? "primary pricing-btn" : "secondary pricing-btn"}
              onClick={() => go({ name: "checkout" })}
            >
              <CreditCard size={16} /> {plan.cta}
            </button>
          </article>
        ))}
      </div>

      <div className="pricing-footer-note">
        <p>Have an access code? <button className="inline-link" onClick={() => go({ name: "redeem" })}>Redeem it here →</button></p>
      </div>
    </section>
  );
}

export function Checkout() {
  return (
    <section className="gate checkout-page">
      <CreditCard size={42} />
      <h1>Checkout</h1>
      <p>
        Payment processing is being set up. In the meantime, please use an
        access code to unlock your course. Contact support if you need help.
      </p>
      <button className="secondary" onClick={() => go({ name: "redeem" })}>Redeem access code</button>
      <button className="primary" onClick={() => go({ name: "courses" })} style={{ marginTop: "0.75rem" }}>Browse courses</button>
    </section>
  );
}

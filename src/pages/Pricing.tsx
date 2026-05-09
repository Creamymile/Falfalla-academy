import { CreditCard } from "lucide-react";
import { go } from "../router";

export function Pricing() {
  return (
    <section className="page">
      <div className="section-heading">
        <p className="eyebrow">Pricing</p>
        <h1>Choose how students access the academy.</h1>
      </div>
      <div className="pricing-grid">
        {[
          ["Starter", "$29", "One course access", "Good for Barista Foundations"],
          ["Academy", "$79", "All courses access", "Best for serious learners"],
          ["Cafe Team", "$249", "Team training", "For cafes training multiple staff"],
        ].map(([name, price, title, text]) => (
          <article className="pricing-card" key={name}>
            <p className="eyebrow">{name}</p>
            <h2>{price}</h2>
            <h3>{title}</h3>
            <p>{text}</p>
            <button className="primary" onClick={() => go({ name: "checkout" })}>
              <CreditCard size={17} /> Choose plan
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Checkout() {
  return (
    <section className="gate checkout-page">
      <CreditCard size={42} />
      <h1>Stripe-ready checkout</h1>
      <p>
        This mock checkout is ready for production integration. Later, Stripe will
        create the payment session and unlock course access after payment succeeds.
      </p>
      <button className="primary" onClick={() => go({ name: "dashboard" })}>Continue to dashboard</button>
    </section>
  );
}


import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  WhopElements,
  Payments,
  PaymentElement,
  ExpressCheckoutElement,
  BrandingElement
} from '@whop/elements-react';
import { loadWhop } from '@whop/elements';
import './styles.css';

const services = [
  {
    icon: '↗',
    name: 'Roof Repair',
    text: 'Targeted repairs for leaks, storm damage, and worn roofing details.',
    tag: 'FAST RESPONSE'
  },
  {
    icon: '⌂',
    name: 'Roof Replacement',
    text: 'A fresh roofing system selected for your property, budget, and climate.',
    tag: 'BUILT FOR THE LONG RUN'
  },
  {
    icon: '◎',
    name: 'Roof Inspection',
    text: 'A clear assessment of your roof’s condition and the next steps to take.',
    tag: 'STARTING AT $149'
  }
];

const plans = [
  {
    id: 'inspection',
    price: '$149',
    name: 'Roof Inspection',
    description: 'A professional roof condition assessment.',
    planEnv: 'VITE_WHOP_INSPECTION_PLAN_ID',
    amount: 14900,
    featured: false
  },
  {
    id: 'deposit',
    price: '$500',
    name: 'Project Deposit',
    description: 'Reserve your approved roofing project.',
    planEnv: 'VITE_WHOP_DEPOSIT_PLAN_ID',
    amount: 50000,
    featured: true
  },
  {
    id: 'flat-rate',
    price: 'Flat rate',
    name: 'Roofing Service',
    description: 'Pay for a defined service at its agreed flat rate.',
    planEnv: 'VITE_WHOP_FLAT_RATE_PLAN_ID',
    amount: null,
    featured: false
  }
];

function track(eventName, properties = {}) {
  try {
    if (
      window.whop &&
      typeof window.whop.track === 'function'
    ) {
      window.whop.track(eventName, properties);
    }
  } catch (error) {
    console.warn('Whop tracking unavailable', error);
  }
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <a
        className="brand"
        href="#home"
        aria-label="Cliplock Roofing home"
      >
        <span className="brand-mark">
          C<span>+</span>
        </span>
        <span>
          CLIPLOCK <b>ROOFING</b>
        </span>
      </a>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <nav className={open ? 'nav nav-open' : 'nav'}>
        {[
          ['Services', '#services'],
          ['Our approach', '#about'],
          ['Service area', '#area'],
          ['Reviews', '#reviews']
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}

        <a
          className="button button-small"
          href="#estimate"
          onClick={() => setOpen(false)}
        >
          Request an estimate <span>↗</span>
        </a>
      </nav>
    </header>
  );
}

function CheckoutPanel({ plan, onClose }) {
  const accountId = import.meta.env.VITE_WHOP_ACCOUNT_ID;
  const planId = import.meta.env[plan.planEnv];

  const environment =
    import.meta.env.VITE_WHOP_ENVIRONMENT === 'production'
      ? 'production'
      : 'sandbox';

  if (!accountId || !planId || !plan.amount) {
    return (
      <div
        className="modal-backdrop"
        onClick={onClose}
      >
        <div
          className="checkout-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <p className="eyebrow">WHOP CHECKOUT SETUP</p>
          <h2>{plan.name}</h2>

          <p className="muted">
            {plan.price} · {plan.description}
          </p>

          <div className="setup-note">
            <strong>Almost ready.</strong>
            <p>
              Add your Whop account ID and this plan’s ID
              to the <code>.env</code> file after creating
              the products in your Whop dashboard. The
              payment form will appear here once the
              required settings are configured.
            </p>
          </div>

          <p className="tiny">
            This starter does not collect or store card
            details itself.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="checkout-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <p className="eyebrow">
          SECURE CHECKOUT · {environment.toUpperCase()}
        </p>

        <h2>{plan.name}</h2>

        <p className="muted">
          {plan.price} · {plan.description}
        </p>

        <WhopElements
          elements={loadWhop()}
          environment={environment}
        >
          <Payments
            accountId={accountId}
            currency="usd"
            amount={plan.amount}
          >
            <ExpressCheckoutElement />
            <PaymentElement />
            <BrandingElement />
          </Payments>
        </WhopElements>

        <p className="tiny">
          Payments are handled by Whop. Express wallet
          availability depends on the browser, device,
          and environment.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    service: 'Roof Inspection',
    details: ''
  });

  const [formState, setFormState] = useState('idle');

  const change = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const chooseService = (name) => {
    track('service_viewed', {
      service_name: name
    });

    setForm((current) => ({
      ...current,
      service: name
    }));

    document
      .querySelector('#estimate')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  async function submitEstimate(event) {
    event.preventDefault();
    setFormState('sending');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          source: 'cliplock-roofing-website'
        })
      });

      if (!response.ok) {
        throw new Error(
          'The estimate form endpoint is not configured yet.'
        );
      }

      track('estimate_requested', {
        service_name: form.service
      });

      setFormState('success');

      setForm({
        name: '',
        email: '',
        phone: '',
        zip: '',
        service: 'Roof Inspection',
        details: ''
      });
    } catch (error) {
      setFormState('error');
    }
  }

  function startDeposit() {
    track('deposit_started', {
      amount: 500,
      currency: 'USD'
    });

    setSelectedPlan(plans[1]);
  }

  return (
    <>
      <Header />

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot"></span>
              ROOFING DONE WITH PURPOSE
            </div>

            <h1>
              Protect what
              <br />
              matters <span>most.</span>
            </h1>

            <p className="hero-text">
              Dependable roofing, straight answers, and
              workmanship built to stand up to the weather.
              Let’s make your next roof decision a confident
              one.
            </p>

            <div className="hero-actions">
              <a className="button" href="#estimate">
                Get a free estimate <span>↗</span>
              </a>

              <a className="text-link" href="#services">
                Explore services <span>↓</span>
              </a>
            </div>

            <div className="hero-proof">
              <div className="proof-icon">✓</div>
              <div>
                <strong>Clear scope. No guesswork.</strong>
                <small>
                  Know the next step before work begins.
                </small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1635424710928-9fff2a4a6d6e?auto=format&fit=crop&w=1400&q=85"
              alt="Modern home with a dark, pitched roof"
              onError={(event) => {
                event.currentTarget.src =
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85';
              }}
            />

            <div className="image-shade"></div>

            <div className="hero-image-caption">
              <span className="caption-mark">C+</span>

              <div>
                <strong>Built to protect.</strong>
                <small>
                  Roofing that works as hard as you do.
                </small>
              </div>

              <span className="caption-arrow">↗</span>
            </div>

            <div className="vertical-label">
              CLIPLOCK ROOFING · BUILT FOR THE LONG RUN
            </div>
          </div>

          <div className="hero-bottom">
            <span>01 / A BETTER ROOFING EXPERIENCE</span>
            <span>
              REPAIRS · REPLACEMENTS · INSPECTIONS
            </span>
          </div>
        </section>

        <section className="trust-strip">
          <div>
            <span className="trust-symbol">✳</span>
            <span>STRAIGHTFORWARD ESTIMATES</span>
          </div>
          <div>
            <span className="trust-symbol">⌁</span>
            <span>QUALITY-FIRST WORK</span>
          </div>
          <div>
            <span className="trust-symbol">◈</span>
            <span>RESPECT FOR YOUR PROPERTY</span>
          </div>
          <div>
            <span className="trust-symbol">↗</span>
            <span>COMMUNICATION THAT'S CLEAR</span>
          </div>
        </section>

        <section
          className="section-wrap section-block"
          id="services"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 — WHAT WE DO</p>
              <h2>
                Roofing solutions.
                <br />
                <span>Real peace of mind.</span>
              </h2>
            </div>

            <p className="section-intro">
              From a small leak to a full replacement, we
              help you understand the condition of your roof
              and choose a practical path forward.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service, index) => (
              <article
                className="service-card"
                key={service.name}
              >
                <div className="service-top">
                  <span className="service-icon">
                    {service.icon}
                  </span>
                  <span className="service-number">
                    0{index + 1}
                  </span>
                </div>

                <p className="card-tag">{service.tag}</p>
                <h3>{service.name}</h3>
                <p>{service.text}</p>

                <button
                  className="card-link"
                  onClick={() => chooseService(service.name)}
                >
                  Discuss this service <span>↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-wrap about-grid">
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=85"
                alt="Roofing professional working on a residential roof"
                onError={(event) => {
                  event.currentTarget.src =
                    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=85';
                }}
              />

              <div className="image-stamp">
                <span>THE CLIPLOCK</span>
                <strong>STANDARD</strong>
                <span>CARE IN EVERY DETAIL</span>
              </div>
            </div>

            <div className="about-copy">
              <p className="eyebrow">02 — OUR APPROACH</p>

              <h2>
                Good work starts
                <br />
                with <span>good people.</span>
              </h2>

              <p>
                Roofing can feel complicated. Our job is to
                make it clearer: listen to your concerns,
                explain the options, outline the work, and
                keep you informed along the way.
              </p>

              <div className="approach-list">
                <div>
                  <span>01</span>
                  <div>
                    <strong>Assess before we advise</strong>
                    <p>
                      Understand the issue before recommending
                      a solution.
                    </p>
                  </div>
                </div>

                <div>
                  <span>02</span>
                  <div>
                    <strong>Keep the details clear</strong>
                    <p>
                      Know what’s included, what it costs,
                      and what happens next.
                    </p>
                  </div>
                </div>

                <div>
                  <span>03</span>
                  <div>
                    <strong>Respect your home</strong>
                    <p>
                      Thoughtful planning and a clean,
                      professional work area.
                    </p>
                  </div>
                </div>
              </div>

              <a className="button button-outline" href="#estimate">
                Talk to our team <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="pricing-section section-wrap"
          id="pricing"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 — SIMPLE STARTING POINTS</p>
              <h2>
                Know your <span>next step.</span>
              </h2>
            </div>

            <p className="section-intro">
              Choose a starting point below. Final project
              pricing should be confirmed in writing after
              the scope is reviewed.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={
                  'price-card ' +
                  (plan.featured ? 'price-featured' : '')
                }
                key={plan.id}
              >
                {plan.featured && (
                  <div className="popular-tag">
                    PROJECT START
                  </div>
                )}

                <p className="card-tag">
                  {plan.id === 'inspection'
                    ? 'ASSESSMENT'
                    : plan.id === 'deposit'
                      ? 'PROJECT RESERVATION'
                      : 'DEFINED SERVICE'}
                </p>

                <h3>{plan.name}</h3>

                <div className="price">
                  {plan.price}
                  {plan.id === 'inspection' && (
                    <small> / visit</small>
                  )}
                </div>

                <p>{plan.description}</p>

                <button
                  className={
                    plan.featured
                      ? 'button'
                      : 'button button-outline'
                  }
                  onClick={() => {
                    if (plan.id === 'deposit') {
                      startDeposit();
                    } else {
                      track('service_viewed', {
                        service_name: plan.name
                      });
                      setSelectedPlan(plan);
                    }
                  }}
                >
                  {plan.id === 'inspection'
                    ? 'Book inspection'
                    : plan.id === 'deposit'
                      ? 'Start a deposit'
                      : 'View flat-rate option'}
                  <span>↗</span>
                </button>

                <small className="price-footnote">
                  {plan.id === 'deposit'
                    ? 'Applied to your approved project according to your agreement.'
                    : plan.id === 'inspection'
                      ? 'Inspection scope and any exclusions will be confirmed before payment.'
                      : 'Rate and scope must be configured before checkout.'}
                </small>
              </article>
            ))}
          </div>

          <div className="finance-callout">
            <div className="finance-icon">↗</div>

            <div>
              <p className="eyebrow">FINANCING OPTIONS</p>
              <h3>Explore ways to plan your project.</h3>
              <p>
                Ask us about available payment options.
                Financing is subject to eligibility, provider
                availability, and final approval.
              </p>
            </div>

            <a className="text-link" href="#estimate">
              Ask about options <span>↗</span>
            </a>
          </div>
        </section>

        <section className="area-section" id="area">
          <div className="section-wrap area-grid">
            <div>
              <p className="eyebrow">04 — WHERE WE WORK</p>

              <h2>
                Local knowledge.
                <br />
                <span>Reliable coverage.</span>
              </h2>

              <p>
                Tell us where your property is located and
                we’ll confirm whether your address is within
                our service area before scheduling an
                inspection.
              </p>

              <a href="#estimate" className="button">
                Check my area <span>↗</span>
              </a>
            </div>

            <div className="area-panel">
              <div className="area-grid-lines"></div>
              <div className="area-pin">⌖</div>

              <div className="area-panel-copy">
                <strong>Is your property in range?</strong>
                <span>
                  Share your ZIP code in the estimate form.
                </span>
              </div>

              <div className="area-status">
                <span className="live-dot"></span>
                SERVICE AREA CONFIRMATION
              </div>
            </div>
          </div>
        </section>

        <section
          className="section-wrap section-block reviews-section"
          id="reviews"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 — TRUST IS EARNED</p>
              <h2>
                Proof comes from
                <br />
                <span>the work itself.</span>
              </h2>
            </div>

            <p className="section-intro">
              We’re building our reputation one property and
              one customer conversation at a time.
            </p>
          </div>

          <div className="review-note">
            <div className="review-stars">★★★★★</div>
            <h3>Real reviews. Real customers.</h3>

            <p>
              Verified customer feedback will be added here
              once Cliplock Roofing has reviews approved for
              publication. We don’t publish placeholder
              testimonials.
            </p>

            <a className="text-link" href="#estimate">
              Be one of our first customers <span>↗</span>
            </a>
          </div>
        </section>

        <section className="estimate-section" id="estimate">
          <div className="section-wrap estimate-grid">
            <div className="estimate-copy">
              <p className="eyebrow">06 — LET’S GET STARTED</p>

              <h2>
                Tell us what’s
                <br />
                happening <span>up top.</span>
              </h2>

              <p>
                Share a few details and our team can follow up
                about your roof, location, and the right next
                step.
              </p>

              <div className="estimate-promise">
                <span>✓</span>
                <div>
                  <strong>No-pressure conversation</strong>
                  <small>
                    Start with the issue. We’ll help you
                    understand your options.
                  </small>
                </div>
              </div>

              <div className="estimate-promise">
                <span>✓</span>
                <div>
                  <strong>Clear follow-up</strong>
                  <small>
                    We’ll use your details to respond about
                    your request.
                  </small>
                </div>
              </div>
            </div>

            <form
              className="estimate-form"
              onSubmit={submitEstimate}
            >
              <div className="form-heading">
                <span>REQUEST AN ESTIMATE</span>
                <span>01 — 06</span>
              </div>

              <div className="field-row">
                <label>
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    required
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>

                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={change}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="field-row">
                <label>
                  Phone number
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    placeholder="(555) 000-0000"
                    autoComplete="tel"
                  />
                </label>

                <label>
                  Property ZIP code
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={change}
                    required
                    placeholder="ZIP code"
                    autoComplete="postal-code"
                  />
                </label>
              </div>

              <label>
                What do you need help with?
                <select
                  name="service"
                  value={form.service}
                  onChange={change}
                >
                  <option>Roof Inspection</option>
                  <option>Roof Repair</option>
                  <option>Roof Replacement</option>
                  <option>Flat-rate roofing service</option>
                  <option>Not sure yet</option>
                </select>
              </label>

              <label>
                Tell us a little more
                <textarea
                  name="details"
                  value={form.details}
                  onChange={change}
                  rows="3"
                  placeholder="Leaks, storm damage, age of roof, or questions…"
                />
              </label>

              <button
                className="button form-submit"
                type="submit"
                disabled={formState === 'sending'}
              >
                {formState === 'sending'
                  ? 'Sending…'
                  : 'Send estimate request'}
                <span>↗</span>
              </button>

              {formState === 'success' && (
                <p className="form-message success">
                  Your request was received.
                </p>
              )}

              {formState === 'error' && (
                <p className="form-message error">
                  The lead service is not configured yet.
                  Your details were not submitted. Set up
                  the Whop API on the server before going
                  live.
                </p>
              )}

              <p className="privacy-note">
                By submitting, you agree that Cliplock
                Roofing may contact you about this request.
                Do not submit sensitive payment information
                here.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer-main">
          <a className="brand" href="#home">
            <span className="brand-mark">
              C<span>+</span>
            </span>
            <span>
              CLIPLOCK <b>ROOFING</b>
            </span>
          </a>

          <p>Built to protect what matters.</p>

          <a href="#home" className="back-top">
            BACK TO TOP ↑
          </a>
        </div>

        <div className="section-wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} CLIPLOCK ROOFING
          </span>
          <span>
            REPAIRS · REPLACEMENTS · INSPECTIONS
          </span>
          <span>QUALITY IN EVERY DETAIL.</span>
        </div>
      </footer>

      {selectedPlan && (
        <CheckoutPanel
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

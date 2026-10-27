import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const services = [
  {
    number: '01',
    icon: '↗',
    title: 'Roof Repair',
    tag: 'REPAIR & RESTORE',
    description:
      'Address leaks, storm damage, and worn roofing details with a practical repair plan.'
  },
  {
    number: '02',
    icon: '⌂',
    title: 'Roof Replacement',
    tag: 'BUILT FOR THE LONG RUN',
    description:
      'Explore replacement options suited to your property, project requirements, and budget.'
  },
  {
    number: '03',
    icon: '◎',
    title: 'Roof Inspection',
    tag: 'START WITH CLARITY',
    description:
      'Understand your roof’s condition and identify sensible next steps before committing.'
  }
];

const plans = [
  {
    name: 'Roof Inspection',
    price: '$149',
    description: 'A starting price for a roof condition assessment.',
    featured: false
  },
  {
    name: 'Project Deposit',
    price: '$500',
    description: 'A sample deposit for an approved roofing project.',
    featured: true
  },
  {
    name: 'Roofing Service',
    price: 'Custom',
    description: 'Pricing based on the agreed project scope.',
    featured: false
  }
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <a className="brand" href="#home" aria-label="Cliplock Roofing home">
        <span className="brand-mark">C<span>+</span></span>
        <span className="brand-name">
          CLIPLOCK <b>ROOFING</b>
        </span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? '×' : '☰'}
      </button>

      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#about" onClick={closeMenu}>Our approach</a>
        <a href="#area" onClick={closeMenu}>Service area</a>
        <a href="#reviews" onClick={closeMenu}>Reviews</a>
        <a className="button button-small" href="#estimate" onClick={closeMenu}>
          Get an estimate <span>↗</span>
        </a>
      </nav>
    </header>
  );
}

function CheckoutDialog({ plan, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>

        <p className="eyebrow">PAYMENT OPTIONS</p>
        <h2 id="checkout-title">{plan.name}</h2>
        <p className="checkout-price">{plan.price}</p>
        <p className="muted">{plan.description}</p>

        <div className="setup-note">
          <strong>Confirm your project details first.</strong>
          <p>
            Please confirm the final service, amount, currency, and payment
            terms before making a payment.
          </p>
        </div>

        <a
          className="button full-width"
          href="#estimate"
          onClick={onClose}
        >
          Discuss this option <span>↗</span>
        </a>

        <p className="tiny">
          This dialog is a front-end placeholder. Connect your existing Whop
          checkout integration before accepting payments.
        </p>
      </section>
    </div>
  );
}

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    service: 'Roof Inspection',
    details: ''
  });
  const [formStatus, setFormStatus] = useState('idle');

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  }

  function selectService(serviceName) {
    setForm((previous) => ({
      ...previous,
      service: serviceName
    }));

    document.querySelector('#estimate')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus('sending');

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
        throw new Error('Unable to submit the estimate request.');
      }

      setFormStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        postalCode: '',
        service: 'Roof Inspection',
        details: ''
      });
    } catch {
      setFormStatus('error');
    }
  }

  return (
    <>
      <Header />

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" />
              ROOFING DONE WITH PURPOSE
            </p>

            <h1>
              Protection that
              <br />
              starts <span>at the top.</span>
            </h1>

            <p className="hero-text">
              Dependable roofing, straightforward advice, and a clear plan
              for protecting your property. Get to know your options before
              making your next move.
            </p>

            <div className="hero-actions">
              <a className="button" href="#estimate">
                Request an estimate <span>↗</span>
              </a>
              <a className="text-link" href="#services">
                Explore services <span>↓</span>
              </a>
            </div>

            <div className="hero-proof">
              <span className="proof-icon">✓</span>
              <div>
                <strong>Clear scope. No guesswork.</strong>
                <small>Understand the next step before work begins.</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
              alt="Contemporary home with refined architectural details"
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
              }}
            />
            <div className="image-shade" />
            <div className="hero-image-caption">
              <span className="caption-mark">C+</span>
              <div>
                <strong>Cliplock Roofing</strong>
                <small>Built to protect. Made to last.</small>
              </div>
              <span className="caption-arrow">↗</span>
            </div>
            <span className="vertical-label">CRAFT · CARE · CONFIDENCE</span>
          </div>

          <div className="hero-bottom">
            <span>RESIDENTIAL ROOFING SOLUTIONS</span>
            <span>QUALITY IN EVERY DETAIL</span>
          </div>
        </section>

        <section className="trust-strip">
          <div><span>✳</span> CLEAR COMMUNICATION</div>
          <div><span>⌂</span> PRACTICAL SOLUTIONS</div>
          <div><span>✓</span> DETAIL-FOCUSED SERVICE</div>
        </section>

        <section className="section-wrap section-block" id="services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT WE DO</p>
              <h2>
                Roofing solutions,
                <br />
                <span>made straightforward.</span>
              </h2>
            </div>
            <p className="section-intro">
              From a small repair to a full replacement, start with a clear
              understanding of your roof and the options available.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-top">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-number">{service.number}</span>
                </div>
                <p className="card-tag">{service.tag}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button
                  className="card-link"
                  type="button"
                  onClick={() => selectService(service.title)}
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
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85"
                alt="Construction professionals working on a building project"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85';
                }}
              />
            </div>

            <div className="about-copy">
              <p className="eyebrow">OUR APPROACH</p>
              <h2>
                Good work begins
                <br />
                with <span>a clear plan.</span>
              </h2>
              <p>
                Roofing decisions should feel informed, not overwhelming.
                Our approach focuses on understanding the problem, explaining
                available options, and helping you make a confident decision.
              </p>

              <div className="approach-list">
                <div>
                  <span>01</span>
                  <p>
                    <strong>Understand the roof</strong>
                    <small>Identify the condition and project priorities.</small>
                  </p>
                </div>
                <div>
                  <span>02</span>
                  <p>
                    <strong>Explain the options</strong>
                    <small>Discuss practical solutions and the estimate.</small>
                  </p>
                </div>
                <div>
                  <span>03</span>
                  <p>
                    <strong>Plan the next step</strong>
                    <small>Keep expectations and communication clear.</small>
                  </p>
                </div>
              </div>

              <a className="button button-dark" href="#estimate">
                Talk about your project <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section-wrap section-block" id="area">
          <div className="area-grid">
            <div>
              <p className="eyebrow">SERVICE AREA</p>
              <h2>
                Local service.
                <br />
                <span>Clear communication.</span>
              </h2>
            </div>
            <div className="area-copy">
              <p>
                Tell us where your property is located and what kind of roofing
                help you need. We can then confirm whether the project falls
                within the service area.
              </p>
              <a className="text-link" href="#estimate">
                Check service availability <span>↗</span>
              </a>
              <p className="tiny">
                Update this section with your confirmed cities and service
                locations before publishing.
              </p>
            </div>
          </div>
        </section>

        <section className="reviews-section" id="reviews">
          <div className="section-wrap section-block">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CUSTOMER EXPERIENCE</p>
                <h2>
                  Trust is built
                  <br />
                  <span>one project at a time.</span>
                </h2>
              </div>
              <p className="section-intro">
                A professional roofing experience should be clear, respectful,
                and focused on the details that matter.
              </p>
            </div>

            <div className="review-note">
              <span className="review-quote">“</span>
              <div>
                <h3>Your project deserves clear answers.</h3>
                <p>
                  Add verified customer testimonials here when they are
                  available. This design avoids presenting invented reviews
                  as real customer feedback.
                </p>
              </div>
              <a className="text-link" href="#estimate">
                Start a conversation <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section-wrap section-block" id="pricing">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PAYMENT OPTIONS</p>
              <h2>
                Simple starting points.
                <br />
                <span>Clear expectations.</span>
              </h2>
            </div>
            <p className="section-intro">
              Review the starting options below. Confirm the actual scope,
              price, currency, and payment terms before purchasing.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={plan.featured ? 'price-card price-featured' : 'price-card'}
                key={plan.name}
              >
                {plan.featured && (
                  <span className="popular-tag">PROJECT START</span>
                )}
                <p className="card-tag">
                  {plan.featured ? 'RESERVATION' : 'ROOFING SERVICE'}
                </p>
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <p>{plan.description}</p>
                <button
                  className={plan.featured ? 'button' : 'button button-outline'}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                >
                  View payment options <span>↗</span>
                </button>
              </article>
            ))}
          </div>

          <p className="tiny pricing-disclaimer">
            These are example prices. Confirm your real pricing and payment
            configuration before accepting orders.
          </p>
        </section>

        <section className="estimate-section" id="estimate">
          <div className="section-wrap estimate-grid">
            <div className="estimate-copy">
              <p className="eyebrow">LET’S GET STARTED</p>
              <h2>
                Tell us about
                <br />
                <span>your roof.</span>
              </h2>
              <p>
                Share a few details about your project. We can use this
                information to understand the work you need and determine
                the next steps.
              </p>

              <div className="estimate-promise">
                <span>✓</span>
                <div>
                  <strong>A clear first step</strong>
                  <small>
                    Discuss the project before confirming scope and price.
                  </small>
                </div>
              </div>
            </div>

            <form className="estimate-form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <h3>Request an estimate</h3>
                <p>Fields marked with * are required.</p>
              </div>

              <div className="form-row">
                <label>
                  Full name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  Email address *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Phone number
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </label>
                <label>
                  ZIP / postal code
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                  />
                </label>
              </div>

              <label>
                Service needed *
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  {services.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                  <option value="Other Roofing Service">
                    Other roofing service
                  </option>
                </select>
              </label>

              <label>
                Project details
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about the roof, issue, or project timeline."
                />
              </label>

              <button
                className="button form-submit"
                type="submit"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending'
                  ? 'Sending request…'
                  : 'Send estimate request'}
                <span>↗</span>
              </button>

              {formStatus === 'success' && (
                <p className="form-message success" role="status">
                  Your request was submitted successfully.
                </p>
              )}

              {formStatus === 'error' && (
                <p className="form-message error" role="alert">
                  The request could not be sent. The /api/leads backend must
                  be configured and accessible for this deployment.
                </p>
              )}

              <p className="tiny form-privacy">
                Do not include payment card details or other sensitive
                information in this form.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer-main">
          <a className="brand" href="#home">
            <span className="brand-mark">C<span>+</span></span>
            <span className="brand-name">
              CLIPLOCK <b>ROOFING</b>
            </span>
          </a>
          <p>Built to protect. Made to last.</p>
          <a className="text-link" href="#home">
            Back to top <span>↑</span>
          </a>
        </div>

        <div className="section-wrap footer-bottom">
          <span>© {new Date().getFullYear()} Cliplock Roofing</span>
          <span>Roofing solutions with clarity and care.</span>
        </div>
      </footer>

      {selectedPlan && (
        <CheckoutDialog
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

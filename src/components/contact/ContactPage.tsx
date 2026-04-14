'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './ContactPage.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const clipVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  visible: (i: number) => ({
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 15%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ],
    transition: { duration: 1.8, ease: EASE_OUT, times: [0, 0.4, 1], delay: i * 0.12 },
  }),
};

const slideVariants: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

const socialLinks = [
  { name: 'Behance',   href: 'https://www.behance.net/crtvmoon' },
  { name: 'Instagram', href: 'https://www.instagram.com/creative_____moon/' },
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/creative-moon/' },
  { name: 'GitHub',    href: 'https://github.com/Touch-Moon' },
];

// ── Style-guide form state management hook ────────────────────────
// Applies .is-focused / .has-content classes to .form-group via JS
function useFormFieldStates(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    type FormInput = HTMLInputElement | HTMLTextAreaElement;

    const inputs = Array.from(
      container.querySelectorAll<FormInput>(
        '.form-group .form-input, .form-group .form-textarea'
      )
    );

    const handlers: Array<{
      el: FormInput;
      onFocus: () => void;
      onBlur: () => void;
      onInput: () => void;
      onResize?: () => void;
    }> = [];

    inputs.forEach((el) => {
      const group = el.closest<HTMLElement>('.form-group');
      if (!group) return;

      if (el.value?.trim()) group.classList.add('has-content');

      const onFocus = () => group.classList.add('is-focused');
      const onBlur = () => {
        group.classList.remove('is-focused');
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };
      const onInput = () => {
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };

      el.addEventListener('focus', onFocus);
      el.addEventListener('blur', onBlur);
      el.addEventListener('input', onInput);

      // Auto-resize textarea height
      let onResize: (() => void) | undefined;
      if (el.tagName.toLowerCase() === 'textarea') {
        const formControl = el.parentElement;
        onResize = () => {
          el.style.height = 'auto';
          const minH = formControl
            ? parseFloat(getComputedStyle(formControl).minHeight) || 0
            : 0;
          el.style.height = Math.max(el.scrollHeight, minH) + 'px';
        };
        el.addEventListener('input', onResize);
        onResize();
      }

      handlers.push({ el, onFocus, onBlur, onInput, onResize });
    });

    return () => {
      handlers.forEach(({ el, onFocus, onBlur, onInput, onResize }) => {
        el.removeEventListener('focus', onFocus);
        el.removeEventListener('blur', onBlur);
        el.removeEventListener('input', onInput);
        if (onResize) el.removeEventListener('input', onResize);
      });
    };
  }, [containerRef]);
}

// ── Actual form component (uses useGoogleReCaptcha) ───────────
function ContactPageInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    privacy: false,
    honeypot: '', // bot trap — invisible to real users
  });
  const [sending, setSending] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [formAnimKey, setFormAnimKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: '0px 0px -10% 0px' });
  const descInView = useInView(descRef, { once: true, margin: '0px 0px -10% 0px' });
  const leftInView = useInView(leftRef, { once: true, margin: '0px 0px -10% 0px' });
  const socialInView = useInView(socialRef, { once: true, margin: '0px 0px -10% 0px' });

  useFormFieldStates(formRef);

  // Per-field validation
  const validateFields = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formState.name.trim()) {
      errors.name = 'This field is required.';
    }
    if (!formState.email.trim()) {
      errors.email = 'This field is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formState.message.trim()) {
      errors.message = 'This field is required.';
    }
    if (!formState.privacy) {
      errors.privacy = 'Please accept the Privacy Policy.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        setFormState(prev => ({
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        }));
      } else {
        setFormState(prev => ({ ...prev, [name]: value }));
      }
      // Clear the error for the changed field on input
      setFieldErrors(prev => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!executeRecaptcha) return;

    // Per-field validation
    if (!validateFields()) return;

    setSending(true);
    setError(null);

    try {
      // Issue reCAPTCHA v3 token (action name is visible in Google Console)
      const token = await executeRecaptcha('contact_form');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          token,
          honeypot: formState.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setToastVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page" data-theme="dark">
      {/* ── Main Contact section ── */}
      <section className="contact-section">
        <div className="wrapper">
          <div className="contact-section__row">

            {/* Left info */}
            <m.div
              className="contact-section__left"
              ref={leftRef}
              initial={{ opacity: 0, y: 40 }}
              animate={leftInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.3 }}
            >
              <div className="contact-block">
                <div className="contact-block__title body-text-caps">Drop me a line</div>
                <div className="contact-block__text headline-6">
                  <a href="mailto:touch@creative-moon.com">touch@creative-moon.com</a>
                </div>
              </div>
              <div className="contact-block">
                <div className="contact-block__title body-text-caps">I am here</div>
                <div className="contact-block__text headline-6">Winnipeg, Canada</div>
              </div>
            </m.div>

            {/* Right form area */}
            <div className="contact-section__right">

              {/* Title — line mask animation */}
              <h1 className="contact-title headline-2 split" ref={titleRef}>
                {["I\u2019d love to", 'hear from you.'].map((text, i) => (
                  <m.div
                    key={i}
                    className="line"
                    custom={i}
                    variants={clipVariants}
                    initial="hidden"
                    animate={titleInView ? 'visible' : 'hidden'}
                  >
                    <m.div
                      className="line-child"
                      custom={i}
                      variants={slideVariants}
                      initial="hidden"
                      animate={titleInView ? 'visible' : 'hidden'}
                    >
                      {text}
                    </m.div>
                  </m.div>
                ))}
              </h1>

              {/* Description text */}
              <m.p
                className="contact-description body-text-2"
                ref={descRef}
                initial={{ opacity: 0, y: 30 }}
                animate={descInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.2 }}
              >
                Whether you have a clear brief or just an early idea, reach out.
                I work with brands and businesses on websites that are well-designed,
                well-built, and built to last.
              </m.p>

              {/* Form */}
              <m.div
                key={formAnimKey}
                className="contact-form"
                ref={formRef}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.3 }}
              >
                <form onSubmit={handleSubmit} noValidate>

                    {/* Honeypot — bot trap, completely hidden from users */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                      <input
                        type="text"
                        name="honeypot"
                        value={formState.honeypot}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Name */}
                    <div className={`form-group is-input${fieldErrors.name ? ' is-error' : ''}`}>
                      <div className="form-control">
                        <div className="form-placeholder">Name</div>
                        <input
                          className="form-input"
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {fieldErrors.name && (
                        <div className="error-message">{fieldErrors.name}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div className={`form-group is-input${fieldErrors.email ? ' is-error' : ''}`}>
                      <div className="form-control">
                        <div className="form-placeholder">Email address</div>
                        <input
                          className="form-input"
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {fieldErrors.email && (
                        <div className="error-message">{fieldErrors.email}</div>
                      )}
                    </div>

                    {/* Message (textarea) */}
                    <div className={`form-group is-textarea${fieldErrors.message ? ' is-error' : ''}`}>
                      <div className="form-control">
                        <div className="form-placeholder">Tell me about your project</div>
                        <textarea
                          className="form-textarea"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {fieldErrors.message && (
                        <div className="error-message">{fieldErrors.message}</div>
                      )}
                    </div>

                    {/* Privacy Policy checkbox */}
                    <div className={`form-group${fieldErrors.privacy ? ' is-error' : ''}`}>
                      <div className="form-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="privacy"
                            checked={formState.privacy}
                            onChange={handleChange}
                            required
                          />
                          <span className="form-checkbox__check">
                            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 5.5L4 8.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="form-checkbox__text">
                            I have read and agree with Creative Moon&apos;s{' '}
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                              Privacy Policy
                            </a>.
                          </span>
                        </label>
                      </div>
                      {fieldErrors.privacy && (
                        <div className="error-message">{fieldErrors.privacy}</div>
                      )}
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="contact-form__error" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Submit row — reCAPTCHA text (left) + Send button (right) */}
                    <div className="form-group form-group--submit">
                      <p className="submit-recaptcha">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                          Terms of Service
                        </a>{' '}
                        apply.
                      </p>
                      <button
                        type="submit"
                        className="button button--xl"
                        disabled={sending || !executeRecaptcha}
                      >
                        <div></div>
                        <span>{sending ? 'Sending...' : 'Send'}</span>
                      </button>
                    </div>

                  </form>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Send success toast (Plastic.design style) ── */}
      <AnimatePresence>
        {toastVisible && (
          <m.div
            className="contact-toast"
            role="status"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: 80, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
          >
            {/* Paper plane icon */}
            <div className="contact-toast__icon">
              <svg viewBox="0 0 51 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50.4994 9.98547L5.84619 1L15.4351 15.6433L25.9597 32.4357L50.4994 9.98547Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50.4996 9.9855L15.426 15.6415L13.7293 24.073L19.3905 22.5143" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Message */}
            <div className="contact-toast__message">
              <span className="contact-toast__thanks">Thanks.</span>
              <span className="contact-toast__sub">We&apos;ll get back to you as soon as we possibly can.</span>
            </div>
            {/* Close button */}
            <button
              className="contact-toast__close"
              onClick={() => {
                setToastVisible(false);
                setFormState({ name: '', email: '', message: '', privacy: false, honeypot: '' });
                setError(null);
                setFieldErrors({});
                setFormAnimKey(k => k + 1);
              }}
              aria-label="Close"
            >
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── Social section ── */}
      <section className="contact-social" ref={socialRef}>
        <div className="wrapper">
          <m.div
            className="contact-social__title body-text-caps"
            initial={{ opacity: 0 }}
            animate={socialInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            Follow along
          </m.div>
          <div className="contact-social__list headline-3">
            <ul>
              {socialLinks.map((link, i) => (
                <m.li
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={socialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.1 * i }}
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </m.li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Provider wrapper (default export) ──────────────────────────
export default function ContactPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{ async: true, defer: true }}
    >
      <ContactPageInner />
    </GoogleReCaptchaProvider>
  );
}

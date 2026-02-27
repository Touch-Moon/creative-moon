'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './ContactPage.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const socialLinks = [
  { name: 'Behance',   href: 'https://behance.net/creativemoon' },
  { name: 'Instagram', href: 'https://instagram.com/creative_moon' },
  { name: 'LinkedIn',  href: 'https://linkedin.com/in/creativemoon' },
  { name: 'GitHub',    href: 'https://github.com/creativemoon' },
];

// ── Style-guide form 상태 관리 훅 ────────────────────────
// .is-focused / .has-content 클래스를 .form-group에 JS로 적용
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
      const onBlur  = () => {
        group.classList.remove('is-focused');
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };
      const onInput = () => {
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };

      el.addEventListener('focus', onFocus);
      el.addEventListener('blur',  onBlur);
      el.addEventListener('input', onInput);

      // Textarea 자동 높이 조절
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
        el.removeEventListener('blur',  onBlur);
        el.removeEventListener('input', onInput);
        if (onResize) el.removeEventListener('input', onResize);
      });
    };
  }, [containerRef]);
}

// ── 실제 폼 컴포넌트 (useGoogleReCaptcha 사용) ───────────
function ContactPageInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formState, setFormState] = useState({
    name:     '',
    email:    '',
    company:  '',
    message:  '',
    privacy:  false,
    honeypot: '', // 봇 트랩 — 실제 사용자는 보이지 않음
  });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const titleRef  = useRef<HTMLHeadingElement>(null);
  const descRef   = useRef<HTMLParagraphElement>(null);
  const formRef   = useRef<HTMLDivElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const titleInView  = useInView(titleRef,  { once: true, margin: '0px 0px -10% 0px' });
  const descInView   = useInView(descRef,   { once: true, margin: '0px 0px -10% 0px' });
  const formInView   = useInView(formRef,   { once: true, margin: '0px 0px -10% 0px' });
  const leftInView   = useInView(leftRef,   { once: true, margin: '0px 0px -10% 0px' });
  const socialInView = useInView(socialRef, { once: true, margin: '0px 0px -10% 0px' });

  useFormFieldStates(formRef);

  // 필드별 유효성 검사
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
      // 입력 시 해당 필드의 에러 제거
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

    // 필드별 유효성 검사
    if (!validateFields()) return;

    setSending(true);
    setError(null);

    try {
      // reCAPTCHA v3 토큰 발급 (action 이름은 Google Console에서 확인 가능)
      const token = await executeRecaptcha('contact_form');

      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     formState.name,
          email:    formState.email,
          company:  formState.company,
          message:  formState.message,
          token,
          honeypot: formState.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page" data-theme="dark">
      {/* ── 메인 Contact 섹션 ── */}
      <section className="contact-section">
        <div className="wrapper">
          <div className="contact-section__row">

            {/* 좌측 정보 */}
            <motion.div
              className="contact-section__left"
              ref={leftRef}
              initial={{ opacity: 0, y: 40 }}
              animate={leftInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.3 }}
            >
              <div className="contact-block">
                <div className="contact-block__title body-text-caps">Drop us a line</div>
                <div className="contact-block__text headline-6">
                  <a href="mailto:hello@creativemoon.com">hello@creativemoon.com</a>
                </div>
              </div>
              <div className="contact-block">
                <div className="contact-block__title body-text-caps">Visit us</div>
                <div className="contact-block__text headline-6">Seoul, South Korea</div>
              </div>
            </motion.div>

            {/* 우측 폼 영역 */}
            <div className="contact-section__right">

              {/* 타이틀 — 라인 마스크 애니메이션 */}
              <h1 className="contact-title headline-2 split" ref={titleRef}>
                <div className="line">
                  <motion.div
                    className="line-child"
                    initial={{ y: '115%' }}
                    animate={titleInView ? { y: 0 } : { y: '115%' }}
                    transition={{ duration: 1.2, ease: EASE_OUT, delay: 0 }}
                  >
                    We&apos;d love to
                  </motion.div>
                </div>
                <div className="line">
                  <motion.div
                    className="line-child"
                    initial={{ y: '115%' }}
                    animate={titleInView ? { y: 0 } : { y: '115%' }}
                    transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.1 }}
                  >
                    hear from you.
                  </motion.div>
                </div>
              </h1>

              {/* 설명 텍스트 */}
              <motion.p
                className="contact-description body-text-2"
                ref={descRef}
                initial={{ opacity: 0, y: 30 }}
                animate={descInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.2 }}
              >
                Whether you want to tell us about a project, join our team, or just say hi,
                write to us! We&apos;d love to hear from you.
              </motion.p>

              {/* 폼 */}
              <motion.div
                className="contact-form"
                ref={formRef}
                initial={{ opacity: 0, y: 40 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.3 }}
              >
                {sent ? (
                  <div className="contact-form__sent">
                    <p className="headline-4">
                      Thanks. We&apos;ll get back to you as soon as we possibly can.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>

                    {/* Honeypot — 봇 트랩, 사용자에게 완전히 숨김 */}
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

                    {/* Company */}
                    <div className="form-group is-input">
                      <div className="form-control">
                        <div className="form-placeholder">Company</div>
                        <input
                          className="form-input"
                          type="text"
                          name="company"
                          value={formState.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Message (textarea) */}
                    <div className={`form-group is-textarea${fieldErrors.message ? ' is-error' : ''}`}>
                      <div className="form-control">
                        <div className="form-placeholder">Tell us about your project</div>
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

                    {/* 에러 메시지 */}
                    {error && (
                      <div className="contact-form__error" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Submit row — reCAPTCHA text (좌) + Send button (우) */}
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
                        className="button button--xl button--secondary"
                        disabled={sending || !executeRecaptcha}
                      >
                        <div></div>
                        <span>{sending ? 'Sending...' : 'Send'}</span>
                      </button>
                    </div>

                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social 섹션 ── */}
      <section className="contact-social" ref={socialRef}>
        <div className="wrapper">
          <motion.div
            className="contact-social__title body-text-caps"
            initial={{ opacity: 0 }}
            animate={socialInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            Follow us
          </motion.div>
          <div className="contact-social__list headline-3">
            <ul>
              {socialLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={socialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.1 * i }}
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Provider 래퍼 (기본 export) ──────────────────────────
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

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// ── Rate limiter: IP당 1시간에 최대 3회 ─────────────────
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ── HTML 이스케이프 (XSS 방지) ──────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message, token, honeypot } = body;

    // ── 1. Honeypot ─ 봇이 숨김 필드를 채우면 조용히 차단 ──
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // ── 2. 기본 유효성 검사 ─────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // ── 3. Rate Limiting ─ IP당 1시간 3회 제한 ───────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    const { success: rateLimitOk } = await ratelimit.limit(ip);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // ── 4. reCAPTCHA v3 검증 ────────────────────────────
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token missing.' },
        { status: 400 }
      );
    }

    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    const recaptchaData = await recaptchaRes.json();

    // score: 0.0(봇) ~ 1.0(사람), 0.5 미만은 차단
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // ── 5. Resend로 이메일 발송 ──────────────────────────
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const toEmail   = process.env.CONTACT_TO_EMAIL  ?? 'hello@creativemoon.com';

    const safeName    = escapeHtml(name.trim());
    const safeEmail   = escapeHtml(email.trim());
    const safeCompany = company?.trim() ? escapeHtml(company.trim()) : null;
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

    await resend.emails.send({
      from:    `Creative Moon <${fromEmail}>`,
      to:      [toEmail],
      replyTo: email.trim(),
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="margin-bottom: 24px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 10px 0; color: #888; width: 110px; vertical-align: top;">
                <strong>Name</strong>
              </td>
              <td style="padding: 10px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">
                <strong>Email</strong>
              </td>
              <td style="padding: 10px 0;">
                <a href="mailto:${safeEmail}" style="color: #000;">${safeEmail}</a>
              </td>
            </tr>
            ${safeCompany ? `
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">
                <strong>Company</strong>
              </td>
              <td style="padding: 10px 0;">${safeCompany}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">
                <strong>Message</strong>
              </td>
              <td style="padding: 10px 0; line-height: 1.6;">${safeMessage}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">
                <strong>reCAPTCHA</strong>
              </td>
              <td style="padding: 10px 0; color: #666;">
                Score: ${recaptchaData.score} / 1.0
              </td>
            </tr>
          </table>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #aaa; font-size: 12px;">
            Sent from Creative Moon contact form · ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

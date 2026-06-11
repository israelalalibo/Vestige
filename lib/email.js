import { Resend } from 'resend';
import { formatCents } from '@/lib/money';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env.EMAIL_FROM || 'Vestige <onboarding@resend.dev>';

// Core sender — no-ops (and logs) when RESEND_API_KEY is unset so signup /
// checkout never fail just because email isn't configured.
async function send({ to, subject, html }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    if (result.error) console.error('[email] send error:', result.error);
    return result;
  } catch (err) {
    console.error('[email] send threw:', err);
    return { error: err };
  }
}

// ---- Shared layout ----
function layout(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a1a">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="text-align:center;padding:8px 0 24px">
        <span style="font-size:22px;letter-spacing:6px;text-transform:uppercase;font-weight:300">Vestige</span>
      </div>
      <div style="background:#fff;border:1px solid #eee;border-radius:8px;padding:32px">
        <h1 style="font-size:20px;font-weight:500;margin:0 0 16px">${title}</h1>
        ${body}
      </div>
      <p style="text-align:center;color:#999;font-size:11px;margin-top:24px">© ${new Date().getFullYear()} Vestige. Premium streetwear.</p>
    </div>
  </body></html>`;
}

const btn = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:14px 28px;font-size:13px;letter-spacing:2px;text-transform:uppercase">${label}</a>`;

// ---- Welcome ----
export function sendWelcomeEmail(to, name) {
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#444">Hi ${name || 'there'},</p>
    <p style="font-size:14px;line-height:1.6;color:#444">Welcome to Vestige — your account is ready. You'll get early access to new arrivals, restocks, and members-only drops.</p>
    <p style="margin:24px 0">${btn(process.env.NEXT_PUBLIC_BASE_URL || 'https://vestige-delta.vercel.app', 'Start Shopping')}</p>
    <p style="font-size:13px;line-height:1.6;color:#777">Leave a Vestige.</p>`;
  return send({ to, subject: 'Welcome to Vestige', html: layout('Welcome to Vestige', body) });
}

// ---- Password reset ----
export function sendPasswordResetEmail(to, resetUrl) {
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#444">We received a request to reset your Vestige password. Click below to choose a new one. This link expires in 1 hour.</p>
    <p style="margin:24px 0">${btn(resetUrl, 'Reset Password')}</p>
    <p style="font-size:13px;line-height:1.6;color:#777">If you didn't request this, you can safely ignore this email — your password won't change.</p>
    <p style="font-size:12px;color:#aaa;word-break:break-all">${resetUrl}</p>`;
  return send({ to, subject: 'Reset your Vestige password', html: layout('Reset your password', body) });
}

// ---- Order confirmation ----
export function sendOrderConfirmationEmail(to, order) {
  const rows = order.items
    .map(
      (it) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px">${it.name}<br><span style="color:#999">${it.size} · ${it.color} · Qty ${it.quantity}</span></td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right">${formatCents(it.priceCents * it.quantity)}</td>
      </tr>`
    )
    .join('');

  const line = (label, value, strong) =>
    `<tr><td style="padding:4px 0;font-size:13px;color:#777">${label}</td><td style="padding:4px 0;font-size:13px;text-align:right${strong ? ';font-weight:600;color:#1a1a1a' : ''}">${value}</td></tr>`;

  const body = `
    <p style="font-size:14px;line-height:1.6;color:#444">Thanks for your order! We're getting it ready. Here's your confirmation.</p>
    <p style="font-size:13px;color:#777;margin:0 0 16px">Order <strong style="color:#1a1a1a">${order.orderNumber}</strong></p>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      ${line('Subtotal', formatCents(order.subtotalCents))}
      ${order.discountCents > 0 ? line(`Discount${order.couponCode ? ` (${order.couponCode})` : ''}`, '−' + formatCents(order.discountCents)) : ''}
      ${line('Shipping', order.shippingCents === 0 ? 'Free' : formatCents(order.shippingCents))}
      ${line('Total', formatCents(order.totalCents), true)}
    </table>
    <p style="margin:24px 0">${btn(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://vestige-delta.vercel.app'}/account`, 'View Your Orders')}</p>`;
  return send({ to, subject: `Order confirmed — ${order.orderNumber}`, html: layout('Order confirmed', body) });
}

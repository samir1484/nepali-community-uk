export function listingInquiryTemplate(input: {
  posterName: string;
  listingTitle: string;
  senderName: string;
  senderEmail: string;
  message: string;
}) {
  return {
    subject: `New enquiry about your listing: ${input.listingTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h2 style="color:#DC143C;">Hi ${escapeHtml(input.posterName)},</h2>
        <p>Someone is interested in your listing <strong>${escapeHtml(input.listingTitle)}</strong> on Nepali Community UK:</p>
        <p><strong>From:</strong> ${escapeHtml(input.senderName)} (${escapeHtml(input.senderEmail)})</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; padding: 16px; border: 1px solid #eee; border-radius: 8px;">${escapeHtml(input.message)}</p>
        <p style="color:#666; font-size: 13px; margin-top: 24px;">
          Just reply to this email to respond directly to ${escapeHtml(input.senderName)}.
        </p>
      </div>
    `,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

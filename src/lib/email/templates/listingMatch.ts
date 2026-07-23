export function listingMatchTemplate(input: {
  userName: string;
  listingTitle: string;
  typeLabel: string;
  location: string;
  listingUrl: string;
}) {
  return {
    subject: `New ${input.typeLabel.toLowerCase()} matching your interests: ${input.listingTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h2 style="color:#DC143C;">Hi ${escapeHtml(input.userName)},</h2>
        <p>A new ${escapeHtml(input.typeLabel.toLowerCase())} matching one of your interests was just approved on Nepali Community UK:</p>
        <p style="margin: 16px 0; padding: 16px; border: 1px solid #eee; border-radius: 8px;">
          <strong style="font-size: 16px;">${escapeHtml(input.listingTitle)}</strong><br />
          <span style="color: #666;">${escapeHtml(input.location)}</span>
        </p>
        <p>
          <a href="${input.listingUrl}" style="display: inline-block; background: #DC143C; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
            View listing
          </a>
        </p>
        <p style="color:#666; font-size: 13px; margin-top: 24px;">
          You're receiving this because of the interests you selected when you registered.
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

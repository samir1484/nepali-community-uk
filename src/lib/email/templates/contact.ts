export function contactMessageTemplate(input: {
  name: string;
  email: string;
  message: string;
}) {
  return {
    subject: `New contact message from ${input.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h2 style="color:#DC143C;">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
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

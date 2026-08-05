export function passwordResetTemplate({ name, resetUrl }: { name: string; resetUrl: string }) {
  return {
    subject: "Reset your Nepali Community UK password",
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #dc143c;">Reset your password</h2>
        <p>Namaste ${name},</p>
        <p>
          Someone asked to reset the password for your Nepali Community UK account.
          Click the button below to choose a new one.
        </p>
        <p style="margin: 28px 0;">
          <a href="${resetUrl}"
             style="background: #dc143c; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Choose a new password
          </a>
        </p>
        <p style="color: #555; font-size: 14px;">
          This link works once and expires in 1 hour. If you didn't ask for this, you can
          ignore this email — your password won't change.
        </p>
        <p style="color: #777; font-size: 13px; word-break: break-all;">
          If the button doesn't work, paste this into your browser:<br />${resetUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;" />
        <p style="color: #888; font-size: 12px;">Nepali Community UK</p>
      </div>
    `,
  };
}

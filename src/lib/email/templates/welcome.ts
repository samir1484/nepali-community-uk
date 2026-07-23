export function welcomeTemplate(input: { name: string }) {
  return {
    subject: "Welcome to Nepali Community UK!",
    html: `
      <div style="font-family: sans-serif; max-width: 560px;">
        <h2 style="color:#DC143C;">Congratulations, ${escapeHtml(input.name)}!</h2>
        <p>Your account has been created and your registration is confirmed.</p>
        <p>You're now part of the UK's largest digital platform for the Nepali
        community — you can log in any time to browse and post jobs, rooms, events,
        and volunteer opportunities.</p>
        <p>Welcome aboard!</p>
        <p style="color:#666;">— The Nepali Community UK team</p>
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

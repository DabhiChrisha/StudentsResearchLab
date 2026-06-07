function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildApprovalEmail({ studentName }) {
  const name = studentName ? String(studentName).trim() : 'Student';
  const safeName = escapeHtml(name);
  const year = new Date().getFullYear();

  const subject = '🎉 Congratulations — Your SRL Membership Is Confirmed';

  const text = `Dear ${name},

Congratulations on your approval to join SRL. Your application has been reviewed and you are now officially confirmed as a new member.

This is a strong opportunity to contribute, learn, and grow. Please maintain discipline, regularity, and consistency in your work to make the most of your membership.

YOUR LOGIN CREDENTIALS ARE ON THEIR WAY
You will receive a separate email with your portal login credentials within the next 15 minutes. Please check your inbox (and spam folder) shortly.

What to focus on next:
• Attend sessions and research activities regularly
• Collaborate with mentors and peers
• Continue working hard with dedication to build your career

If you have any questions, please reach out to the SRL team.

Warm regards,
The Admin Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Approved</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f4;padding:32px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(5,135,122,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#05877a 0%,#037a6e 60%,#026b60 100%);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Research Lab</h1>
              <div style="display:inline-block;background-color:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.35);border-radius:50px;padding:10px 28px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">✅ &nbsp;Application Approved</p>
              </div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#e6f4f2;padding:20px 40px;text-align:center;border-bottom:1px solid #c8e6e3;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#037a6e;letter-spacing:-0.3px;">🎉 Congratulations, ${safeName}!</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.7;">
                We are pleased to inform you that your application has been
                <strong style="color:#05877a;">officially approved</strong>.
                Welcome to the SRL research community.
              </p>

              <!-- Status card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0faf9;border-left:4px solid #05877a;border-radius:0 10px 10px 0;margin:0 0 28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#05877a;">You are now an official member</p>
                    <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
                      You are officially part of an active community of researchers, innovators, and scholars.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Credential delivery notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;margin:0 0 28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#b45309;">🔐 &nbsp;Your Login Credentials Are On Their Way</p>
                    <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
                      You will receive a <strong>separate email</strong> with your portal login credentials
                      within the next <strong>15 minutes</strong>. Please check your inbox and spam folder shortly.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What's next -->
              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#111827;">What's next for you:</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#e6f4f2;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">🗓️</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Attend sessions</strong> — Join upcoming workshops, seminars, and research presentations.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#e6f4f2;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">🤝</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Connect with peers</strong> — Collaborate with fellow researchers, mentors, and faculty.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#e6f4f2;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">🔬</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Contribute to research</strong> — Begin working on ongoing projects and publish your findings.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                If you have any questions or need assistance, please do not hesitate to reach out to the team. We look forward to your contributions and continued dedication.
              </p>

            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#e5e7eb;"></div>
            </td>
          </tr>

          <!-- SIGNATURE -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0 0 4px;font-size:15px;color:#374151;line-height:1.6;">Warm regards,</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#05877a;">The Admin Team</p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#f8fffe;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;border-radius:0 0 16px 16px;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
                This is an automated email from the Research Lab portal.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${year} Research Lab. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
  return { subject, text, html };
}

module.exports = { buildApprovalEmail };

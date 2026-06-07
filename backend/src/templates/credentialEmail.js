function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCredentialEmail({ studentName, email, enrollmentNo }) {
  const name = studentName ? String(studentName).trim() : 'Student';
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(String(email || '').trim());
  const safePassword = escapeHtml(String(enrollmentNo || '').trim());
  const year = new Date().getFullYear();

  const subject = '🔐 Your SRL Portal Login Credentials';

  const text = `Dear ${name},

Your SRL portal login credentials are ready. Please use the details below to log in.

LOGIN CREDENTIALS
Email:    ${email}
Password: ${enrollmentNo}

This is your temporary password. You are strongly encouraged to change it after your first login using the Forgot Password option.

IMPORTANT: Keep your credentials secure. Do not share them with anyone.

If you did not expect this email or have any concerns, contact the SRL admin team immediately.

Warm regards,
The Admin Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Login Credentials</title>
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
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">🔐 &nbsp;Your Login Credentials</p>
              </div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#e6f4f2;padding:20px 40px;text-align:center;border-bottom:1px solid #c8e6e3;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#037a6e;letter-spacing:-0.3px;">Welcome, ${safeName}!</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.7;">
                Your SRL member portal access is ready. Use the credentials below to log in.
              </p>

              <!-- Credentials card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0faf9;border-left:4px solid #05877a;border-radius:0 10px 10px 0;margin:0 0 24px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#05877a;">Login Details</p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d1faf5;">
                          <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;font-family:monospace;">${safeEmail}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;">
                          <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Password</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;font-family:monospace;">${safePassword}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Temporary password notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;margin:0 0 24px;">
                <tr>
                  <td style="padding:18px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#b45309;">⚠️ &nbsp;Temporary Password</p>
                    <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.6;">
                      This is your <strong>temporary password</strong>. Please change it after your first login using the <strong>Forgot Password</strong> option on the portal.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:0 10px 10px 0;margin:0 0 24px;">
                <tr>
                  <td style="padding:18px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#b91c1c;">🔒 &nbsp;Keep Your Credentials Secure</p>
                    <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.6;">
                      Do not share your login details with anyone. If you did not request this email, contact the SRL admin team immediately.
                    </p>
                  </td>
                </tr>
              </table>

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

module.exports = { buildCredentialEmail };

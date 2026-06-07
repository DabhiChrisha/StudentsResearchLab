function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildOtpEmail({ studentName, otp }) {
  const name = studentName ? String(studentName).trim() : 'User';
  const safeName = escapeHtml(name);
  const safeOtp = escapeHtml(String(otp || '').trim());
  const year = new Date().getFullYear();

  const subject = '🔑 Your SRL Password Reset OTP';

  const text = `Dear ${name},

You requested a password reset for your SRL portal account.

Your OTP: ${otp}

This OTP is valid for 10 minutes. Do not share it with anyone.

If you did not request a password reset, please ignore this email or contact the SRL admin team.

Warm regards,
The Admin Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset OTP</title>
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
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">🔑 &nbsp;Password Reset Request</p>
              </div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#e6f4f2;padding:20px 40px;text-align:center;border-bottom:1px solid #c8e6e3;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#037a6e;letter-spacing:-0.3px;">Hello, ${safeName}!</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.7;">
                We received a request to reset your SRL portal password. Use the OTP below to proceed.
              </p>

              <!-- OTP card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0faf9;border-left:4px solid #05877a;border-radius:0 10px 10px 0;margin:0 0 24px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#05877a;">Your One-Time Password</p>
                    <p style="margin:0;font-size:40px;font-weight:800;color:#111827;font-family:monospace;letter-spacing:12px;">${safeOtp}</p>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;margin:0 0 24px;">
                <tr>
                  <td style="padding:18px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#b45309;">⏱️ &nbsp;Expires in 10 Minutes</p>
                    <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.6;">
                      This OTP is valid for <strong>10 minutes</strong> only. Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                If you did not request a password reset, please ignore this email. Your account remains secure.
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

module.exports = { buildOtpEmail };

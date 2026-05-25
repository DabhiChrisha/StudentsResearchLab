function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildJoinRequestConfirmationEmail({ studentName }) {
  const name = studentName ? String(studentName).trim() : 'Student';
  const safeName = escapeHtml(name);
  const year = new Date().getFullYear();

  const subject = '✅ Your Application Has Been Received!';

  const text = `Hello ${name},

Thank you for applying! Your application has been successfully submitted and is now under review by our admin team.

What happens next?
• Your application will be reviewed by the admin team
• You will receive a separate email once a decision has been made
• The review process may take a few days

Please do not submit multiple applications. If you have any questions, feel free to reach out.

Thank you for your interest!

Warm regards,
The Admin Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background-color:#F8E6C1;font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8E6C1;padding:32px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(5,135,122,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#F8E6C1;padding:40px 40px 32px;text-align:center;border-bottom:1px solid #efd59f;">
              <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#3f3420;letter-spacing:-0.5px;">Research Lab</h1>
              <div style="display:inline-block;background-color:rgba(255,255,255,0.45);border:2px solid #e6c681;border-radius:50px;padding:10px 28px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#3f3420;letter-spacing:0.5px;">📬 &nbsp;Application Received</p>
              </div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#fff6e4;padding:20px 40px;text-align:center;border-bottom:1px solid #efd59f;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#3f3420;letter-spacing:-0.3px;">Hello, ${safeName}! 👋</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.7;">
                Thank you for your interest! Your application has been
                <strong style="color:#05877a;">successfully submitted</strong>
                and is now under review by our admin team.
              </p>

              <!-- Status card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff6e4;border-left:4px solid #F8E6C1;border-radius:0 10px 10px 0;margin:0 0 28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#05877a;">Application Status</p>
                    <p style="margin:0;font-size:15px;color:#4b5563;line-height:1.6;">
                      Your application is currently <strong>under review</strong>. Our team will carefully evaluate your profile and get back to you as soon as possible.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#111827;">What happens next:</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#F8E6C1;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">👩‍💼</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Admin review</strong> — Our admin team will review your submitted application.</p>
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
                          <div style="width:28px;height:28px;background-color:#F8E6C1;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">⏳</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Decision in a few days</strong> — The review process may take a few business days.</p>
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
                          <div style="width:28px;height:28px;background-color:#F8E6C1;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">📧</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;"><strong>Email notification</strong> — You will receive another email once a decision has been made.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Note box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      <strong>📌 Please note:</strong> Submission of this form is an application, not a confirmation of membership. Please do not submit multiple applications.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                Thank you for your interest. We appreciate your initiative and look forward to reviewing your application!
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
            <td style="background-color:#fff6e4;border-top:1px solid #efd59f;padding:20px 40px;text-align:center;border-radius:0 0 16px 16px;">
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

module.exports = { buildJoinRequestConfirmationEmail };

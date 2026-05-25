function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildRejectionEmail({ studentName }) {
  const name = studentName ? String(studentName).trim() : 'Student';
  const safeName = escapeHtml(name);
  const year = new Date().getFullYear();

  const subject = '🙏 Update on Your Application Status';

  const text = `Hello ${name},

Thank you for your application and for your interest in our research lab.

After careful review, we are unable to move forward with your application at this time.

We encourage you to keep building your skills and to consider applying again in the future.

If you would like feedback or have any questions, please feel free to reach out.

Warm regards,
The Admin Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Status Update</title>
</head>
<body style="margin:0;padding:0;background-color:#F8E6C1;font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F8E6C1;padding:32px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">

          <tr>
            <td style="background-color:#F8E6C1;padding:40px 40px 32px;text-align:center;border-bottom:1px solid #efd59f;">
              <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#3f3420;letter-spacing:-0.5px;">Research Lab</h1>
              <div style="display:inline-block;background-color:rgba(255,255,255,0.45);border:2px solid #e6c681;border-radius:50px;padding:10px 28px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#3f3420;letter-spacing:0.5px;">📩 Application Status Update</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#fff6e4;padding:20px 40px;text-align:center;border-bottom:1px solid #efd59f;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#3f3420;letter-spacing:-0.3px;">Hello, ${safeName}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 20px;font-size:16px;color:#1f2937;line-height:1.7;">
                Thank you for applying to our research lab. After careful consideration, we are not able to approve your application at this time.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff6e4;border-left:4px solid #F8E6C1;border-radius:0 10px 10px 0;margin:0 0 28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#3b82f6;">What this means</p>
                    <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">
                      Your application was reviewed but not selected for the current cycle. We appreciate your time and interest.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 18px;font-size:15px;color:#1f2937;line-height:1.7;">
                We encourage you to stay connected and consider applying again in the future.
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#1f2937;line-height:1.7;">
                If you would like feedback, please reply to this email or reach out to the team.
              </p>

              <p style="margin:0;font-size:15px;color:#475569;line-height:1.7;">
                Warm regards,<br />
                <strong>The Admin Team</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
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

module.exports = { buildRejectionEmail };

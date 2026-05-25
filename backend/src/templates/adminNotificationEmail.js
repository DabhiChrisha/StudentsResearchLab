function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildAdminNotificationEmail({ studentName, email, enrollment, department, batch, source }) {
  const name = studentName ? String(studentName).trim() : 'Applicant';
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email || 'N/A');
  const safeEnrollment = escapeHtml(enrollment || 'N/A');
  const safeDepartment = escapeHtml(department || 'N/A');
  const safeBatch = escapeHtml(batch || 'N/A');
  const safeSource = escapeHtml(source || 'Website');
  const year = new Date().getFullYear();

  const subject = `New Join Us application received: ${name}`;

  const text = `A new Join Us application has been submitted.

Name: ${name}
Email: ${safeEmail}
Enrollment: ${safeEnrollment}
Department / Course: ${safeDepartment}
Batch: ${safeBatch}
Source: ${safeSource}

Review the application in the admin portal and proceed with approval or rejection.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Join Us Application</title>
</head>
<body style="margin:0;padding:0;background-color:#f7fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e 0%,#134e4a 100%);padding:28px 32px;text-align:center;color:#ffffff;">
              <h1 style="margin:0;font-size:24px;letter-spacing:-0.5px;">New Join Us Application</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">A new student application has arrived and needs review.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 18px;font-size:16px;color:#111827;line-height:1.6;">A new Join Us application has been submitted. Review the details below and take action in the admin portal.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0 12px;">
                <tr>
                  <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                    <p style="margin:0 0 12px;font-size:14px;color:#0f172a;font-weight:700;">Applicant Details</p>
                    <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;"><strong>Name:</strong> ${safeName}</p>
                    <p style="margin:6px 0 0;font-size:14px;color:#334155;line-height:1.7;"><strong>Email:</strong> ${safeEmail}</p>
                    <p style="margin:6px 0 0;font-size:14px;color:#334155;line-height:1.7;"><strong>Enrollment:</strong> ${safeEnrollment}</p>
                    <p style="margin:6px 0 0;font-size:14px;color:#334155;line-height:1.7;"><strong>Department / Course:</strong> ${safeDepartment}</p>
                    <p style="margin:6px 0 0;font-size:14px;color:#334155;line-height:1.7;"><strong>Batch:</strong> ${safeBatch}</p>
                    <p style="margin:6px 0 0;font-size:14px;color:#334155;line-height:1.7;"><strong>Source:</strong> ${safeSource}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:14px;color:#475569;line-height:1.7;">Visit the admin portal to review, approve or reject this application and follow up as needed.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;text-align:center;color:#64748b;font-size:12px;">
              <p style="margin:0;">This is an automated notification from the Research Lab portal.</p>
              <p style="margin:8px 0 0;">&copy; ${year} Research Lab</p>
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

module.exports = { buildAdminNotificationEmail };

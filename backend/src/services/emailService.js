const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const { buildApprovalEmail } = require('../templates/approvalEmail');
const { buildJoinRequestConfirmationEmail } = require('../templates/joinRequestConfirmationEmail');
const { buildRejectionEmail } = require('../templates/rejectionEmail');
const { buildAdminNotificationEmail } = require('../templates/adminNotificationEmail');

let cachedTransporter = null;
let cachedTransporterVerified = false;

function normalizeEmail(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase();
}

function isValidEmail(value) {
  const email = normalizeEmail(value);
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

function createSmtpTransporter() {
  const { smtp } = emailConfig;

  const missing = [];
  if (!smtp.host) missing.push('SMTP_HOST');
  if (!smtp.port) missing.push('SMTP_PORT');
  if (!smtp.auth.user) missing.push('SMTP_USER');
  if (!smtp.auth.pass) missing.push('SMTP_PASS');

  if (missing.length > 0) {
    console.error(`[Email Config] Missing required SMTP variables: ${missing.join(', ')}`);
    throw new Error(
      'Missing SMTP configuration. Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS are set.',
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
    family: 4,
  });

  console.log(
    `[Email Service] Created SMTP transporter for ${smtp.host}:${smtp.port} secure=${smtp.secure}`,
  );
  return transporter;
}

async function verifyTransporter(transporter) {
  if (cachedTransporterVerified) return;

  try {
    await transporter.verify();
    cachedTransporterVerified = true;
    console.log(
      `[Email Service] SMTP transporter verified successfully for ${emailConfig.smtp.host}:${emailConfig.smtp.port}`,
    );
  } catch (error) {
    // In serverless environments (e.g. Vercel) verify() can fail transiently
    // due to cold-start network latency or connection reuse limits, even when
    // the credentials are correct and sendMail would succeed.  Logging the
    // failure here is sufficient; we let sendMail() decide whether the
    // transporter is truly broken — it will throw its own descriptive error.
    console.warn(
      `[Email Service] SMTP verify step failed (will still attempt sendMail): ${error.message}`,
    );
  }
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (emailConfig.provider !== 'smtp') {
    throw new Error(`Unsupported email provider: ${emailConfig.provider}`);
  }

  cachedTransporter = createSmtpTransporter();
  return cachedTransporter;
}

async function sendEmail({ to, subject, text, html, from }) {
  const recipients = String(to)
    .split(',')
    .map((item) => normalizeEmail(item))
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new Error('Email recipient is required');
  }

  const invalidRecipient = recipients.find((email) => !isValidEmail(email));
  if (invalidRecipient) {
    throw new Error(`Invalid email recipient: ${invalidRecipient}`);
  }

  const recipientList = recipients.join(', ');
  const sender = from || emailConfig.defaultFrom;
  if (!sender) {
    throw new Error('Email sender is not configured. Set EMAIL_FROM_ADDRESS or SMTP_USER.');
  }

  const transporter = getTransporter();
  await verifyTransporter(transporter);

  console.log(`[Email Service] Sending email to ${recipientList} from ${sender} subject="${subject}"`);

  let info;
  try {
    info = await transporter.sendMail({
      from: sender,
      to: recipientList,
      subject,
      text,
      html,
    });
  } catch (sendError) {
    // Reset the cached transporter so the next attempt gets a fresh connection
    // instead of retrying with a potentially broken or expired socket.
    cachedTransporter = null;
    cachedTransporterVerified = false;
    console.error(
      `[Email Service] sendMail failed for ${recipientList} — transporter cache cleared for next attempt:`,
      sendError,
    );
    throw sendError;
  }

  console.log(
    `[Email Service] Email sendMail result for ${recipientList}: accepted=${JSON.stringify(
      info.accepted,
    )}, rejected=${JSON.stringify(info.rejected)}, messageId=${info.messageId}`,
  );

  return info;
}

async function sendApprovalEmail({ to, studentName }) {
  const { subject, html, text } = buildApprovalEmail({ studentName });
  return sendEmail({ to, subject, html, text });
}

async function sendRejectionEmail({ to, studentName }) {
  const { subject, html, text } = buildRejectionEmail({ studentName });
  return sendEmail({ to, subject, html, text });
}

async function sendAdminNotificationEmail({ studentName, email, enrollment, department, batch, source }) {
  const recipients = String(emailConfig.adminNotificationRecipients || '').trim();
  if (!recipients) {
    console.warn('[Email Service] Admin notification email skipped: no admin recipients configured. Set JOIN_REQUEST_ADMIN_NOTIFICATION_EMAILS in environment.');
    return null;
  }

  const { subject, html, text } = buildAdminNotificationEmail({
    studentName,
    email,
    enrollment,
    department,
    batch,
    source,
  });

  return sendEmail({ to: recipients, subject, html, text });
}

async function sendJoinRequestConfirmationEmail({ to, studentName }) {
  const { subject, html, text } = buildJoinRequestConfirmationEmail({ studentName });
  return sendEmail({ to, subject, html, text });
}

module.exports = {
  sendEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendJoinRequestConfirmationEmail,
  sendAdminNotificationEmail,
  isValidEmail,
};


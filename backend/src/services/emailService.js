const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const { buildApprovalEmail } = require('../templates/approvalEmail');
const { buildJoinRequestConfirmationEmail } = require('../templates/joinRequestConfirmationEmail');

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
    console.error('[Email Service] SMTP transporter verification failed:', error);
    throw error;
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
  const recipient = normalizeEmail(to);
  if (!recipient) {
    throw new Error('Email recipient is required');
  }
  if (!isValidEmail(recipient)) {
    throw new Error(`Invalid email recipient: ${recipient}`);
  }

  const sender = from || emailConfig.defaultFrom;
  if (!sender) {
    throw new Error('Email sender is not configured. Set EMAIL_FROM_ADDRESS or SMTP_USER.');
  }

  const transporter = getTransporter();
  await verifyTransporter(transporter);

  console.log(`[Email Service] Sending email to ${recipient} from ${sender} subject="${subject}"`);

  const info = await transporter.sendMail({
    from: sender,
    to: recipient,
    subject,
    text,
    html,
  });

  console.log(
    `[Email Service] Email sendMail result for ${recipient}: accepted=${JSON.stringify(
      info.accepted,
    )}, rejected=${JSON.stringify(info.rejected)}, messageId=${info.messageId}`,
  );

  return info;
}

async function sendApprovalEmail({ to, studentName }) {
  const { subject, html, text } = buildApprovalEmail({ studentName });
  return sendEmail({ to, subject, html, text });
}

async function sendJoinRequestConfirmationEmail({ to, studentName }) {
  const { subject, html, text } = buildJoinRequestConfirmationEmail({ studentName });
  return sendEmail({ to, subject, html, text });
}

module.exports = {
  sendEmail,
  sendApprovalEmail,
  sendJoinRequestConfirmationEmail,
  isValidEmail,
};


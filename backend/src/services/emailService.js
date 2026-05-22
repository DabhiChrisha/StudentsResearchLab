const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const { buildApprovalEmail } = require('../templates/approvalEmail');
const { buildJoinRequestConfirmationEmail } = require('../templates/joinRequestConfirmationEmail');

let cachedTransporter = null;

function createSmtpTransporter() {
  const { smtp } = emailConfig;

  if (!smtp.host || !smtp.port || !smtp.auth.user || !smtp.auth.pass) {
    throw new Error(
      'Missing SMTP configuration. Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS are set.',
    );
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });
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
  if (!to) {
    throw new Error('Email recipient is required');
  }

  const transporter = getTransporter();

  return transporter.sendMail({
    from: from || emailConfig.defaultFrom,
    to,
    subject,
    text,
    html,
  });
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
};


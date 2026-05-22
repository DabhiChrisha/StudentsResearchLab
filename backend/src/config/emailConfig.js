require('dotenv').config();

const rawProvider = (process.env.EMAIL_PROVIDER || 'smtp').trim().toLowerCase();
const provider = rawProvider === 'gmail' ? 'smtp' : rawProvider;

const fromName = process.env.EMAIL_FROM_NAME?.trim() || 'Research Lab';
const fromAddress = (process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || '').trim();
const defaultFrom = fromAddress ? `"${fromName}" <${fromAddress}>` : fromName;

const smtp = {
  pool: true,
  host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
  port: Number.parseInt(process.env.SMTP_PORT || '465', 10),
  secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER?.trim() || '',
    pass: process.env.SMTP_PASS || '',
  },
};

module.exports = {
  provider,
  defaultFrom,
  fromName,
  fromAddress,
  smtp,
  resendApiKey: process.env.RESEND_API_KEY,
  postmarkApiKey: process.env.POSTMARK_API_KEY,
  sesRegion: process.env.SES_REGION,
  sesAccessKeyId: process.env.SES_ACCESS_KEY_ID,
  sesSecretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
};

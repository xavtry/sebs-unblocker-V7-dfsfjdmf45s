
// basic notification stub - prints to console. Extend to send email, Slack, etc.
const { logger } = require('./logger');

function notifyAdmin(subject, body) {
  // In production, hook this up to SMTP / Sendgrid / Slack / PagerDuty.
  logger(`[ALERT] ${subject} - ${body}`);
}

module.exports = { notifyAdmin };

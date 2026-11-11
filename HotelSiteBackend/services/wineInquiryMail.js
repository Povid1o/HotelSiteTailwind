const nodemailer = require('nodemailer');

const smtpConfigured = (env = process.env) => Boolean(
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM
);

function createMailTransport(env = process.env) {
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true
  });
}

function buildInquiryMessage({ wine, email, recipientEmail }, env = process.env) {
  const title = [wine.name, wine.year].filter(Boolean).join(', ').replace(/[\r\n]+/g, ' ');
  const path = `/Shop/${wine.id}`;
  const link = env.PUBLIC_SITE_URL ? new URL(path, env.PUBLIC_SITE_URL).href : path;
  return {
    from: env.SMTP_FROM,
    to: { address: recipientEmail },
    replyTo: { address: email },
    subject: `Заявка на вино «${title}»`,
    text: [
      'Новая заявка с сайта «Винные Террасы».',
      '',
      `Посетитель интересуется вином: ${title}.`,
      `Email посетителя: ${email}`,
      `Цена на сайте: ${wine.price} ₽`,
      `Карточка вина: ${link}`,
      '',
      'Посетитель просит связаться с ним и рассказать подробнее об этом вине.',
      'Нажмите «Ответить», чтобы написать посетителю.'
    ].join('\n')
  };
}

let transport;
async function sendInquiryMail(inquiry) {
  if (!smtpConfigured()) throw new Error('SMTP_NOT_CONFIGURED');
  transport ||= createMailTransport();
  const result = await transport.sendMail(buildInquiryMessage(inquiry));
  if (!result.accepted?.length || result.rejected?.length) throw new Error('SMTP_RECIPIENT_REJECTED');
}

module.exports = { smtpConfigured, createMailTransport, buildInquiryMessage, sendInquiryMail };

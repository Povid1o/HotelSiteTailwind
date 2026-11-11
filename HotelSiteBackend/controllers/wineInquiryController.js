const Joi = require('joi');

const emailSchema = Joi.string().trim().max(254).email({ tlds: { allow: false } });
const inquirySchema = Joi.object({
  wineId: Joi.number().integer().positive().required(),
  email: emailSchema.required(),
  website: Joi.string().max(200).allow('').default('')
});
const settingsSchema = Joi.object({ recipientEmail: emailSchema.allow('').required() });

// Dependencies are explicit so mail failures and untrusted input can be tested
// without a real mailbox or changing the application's database.
function createWineInquiryController({ Wine, Settings, mail, logger = console }) {
  return {
    async getSettings(_req, res) {
      const settings = await Settings.findByPk(1);
      res.set('Cache-Control', 'no-store').json({
        recipientEmail: settings?.recipient_email || '', smtpConfigured: mail.smtpConfigured()
      });
    },
    async saveSettings(req, res) {
      const { value, error } = settingsSchema.validate(req.body);
      if (error) return res.status(400).json({ message: 'Укажите корректный email для заявок.' });
      await Settings.upsert({ id: 1, recipient_email: value.recipientEmail });
      res.json({ recipientEmail: value.recipientEmail, smtpConfigured: mail.smtpConfigured() });
    },
    async submit(req, res) {
      // JSON-only prevents cross-site HTML form submissions to this public route.
      if (!req.is('application/json')) return res.status(415).json({ message: 'Ожидается JSON.' });
      const { value, error } = inquirySchema.validate(req.body);
      if (error) return res.status(400).json({ message: 'Проверьте адрес электронной почты и выбранное вино.' });
      if (value.website) return res.status(400).json({ message: 'Не удалось отправить заявку.' });
      const wine = await Wine.findOne({ where: { id: value.wineId, is_active: true } });
      if (!wine) return res.status(404).json({ message: 'Это вино больше недоступно. Выберите другое вино в каталоге.' });
      const settings = await Settings.findByPk(1);
      if (!settings?.recipient_email || !mail.smtpConfigured()) {
        return res.status(503).json({ message: 'Приём заявок временно недоступен. Свяжитесь с нами через раздел «Контакты».' });
      }
      try {
        await mail.sendInquiryMail({ wine, email: value.email, recipientEmail: settings.recipient_email });
      } catch (error) {
        // SMTP errors can include addresses or connection credentials; log only a code.
        logger.error('Wine inquiry delivery failed:', error.code || 'SMTP_SEND_FAILED');
        return res.status(502).json({ message: 'Не удалось отправить заявку. Попробуйте позже или свяжитесь с нами через раздел «Контакты».' });
      }
      return res.status(201).json({ message: 'Заявка отправлена. Мы свяжемся с вами по электронной почте.' });
    }
  };
}

module.exports = { createWineInquiryController };

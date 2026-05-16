const SibApiV3Sdk = require('@getbrevo/brevo');

export default async function sendEmail({ to, subject, html, from }: any) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: from || process.env.EMAIL_FROM || 'theotejano@gmail.com' };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    console.log(`Attempting to send email to: ${to}`);
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully');
}
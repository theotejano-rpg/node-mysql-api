import { BrevoClient } from '@getbrevo/brevo';

export default async function sendEmail({ to, subject, html, from }: any) {
    const client = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY || ''
    });

    console.log(`Attempting to send email to: ${to}`);

    await client.transactionalEmails.sendTransacEmail({
        sender: { email: from || process.env.EMAIL_FROM || 'theotejano@gmail.com' },
        to: [{ email: to }],
        subject,
        htmlContent: html
    });

    console.log('Email sent successfully');
}
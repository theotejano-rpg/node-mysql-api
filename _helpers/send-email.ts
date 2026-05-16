import nodemailer from 'nodemailer';
import { Resend } from 'resend';

function getEmailFrom(): string {
    return process.env.EMAIL_FROM || 'noreply@example.com';
}

function getSmtpOptions() {
    if (process.env.NODE_ENV === 'production' && !process.env.SMTP_HOST) {
        throw 'SMTP_HOST environment variable is required in production to send emails';
    }

    if (process.env.SMTP_HOST) {
        return {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
            secure: process.env.SMTP_SECURE === 'true'
        };
    }
}

async function sendWithResend({ to, subject, html, from }: any) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: from || getEmailFrom(),
        to,
        subject,
        html
    });
    if (error) throw new Error(`Email sending failed: ${error.message}`);
}

export default async function sendEmail({ to, subject, html, from }: any) {
    console.log(`Attempting to send email to: ${to}`);

    const hasResend = !!process.env.RESEND_API_KEY;

    if (hasResend) {
        return await sendWithResend({ to, subject, html, from });
    }

    const transporter = nodemailer.createTransport(getSmtpOptions());
    await transporter.sendMail({ from: from || getEmailFrom(), to, subject, html });
    console.log('Email sent successfully');
}
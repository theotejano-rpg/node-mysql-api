import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html, from }: any) {
    const fromAddress = from || process.env.EMAIL_FROM || 'onboarding@resend.dev';

    console.log(`Attempting to send email to: ${to}`);

    const { data, error } = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html
    });

    if (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Email sending failed: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
}
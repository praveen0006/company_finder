import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import nodemailer from 'nodemailer';

async function sendNotification() {
    const [, , company, role, reportPath, pdfPath] = process.argv;

    if (!company || !role) {
        console.error("Usage: node send-notification.mjs <company> <role> [report_path] [pdf_path]");
        process.exit(1);
    }

    try {
        const profilePath = path.join(process.cwd(), 'config', 'profile.yml');
        if (!fs.existsSync(profilePath)) {
            console.error("No profile.yml found.");
            return;
        }

        const profileData = yaml.load(fs.readFileSync(profilePath, 'utf8'));
        const smtp = profileData.smtp;

        if (!smtp || !smtp.host || !smtp.user || !smtp.app_password) {
            console.error("SMTP configuration missing in profile.yml.");
            return;
        }

        let summary = "No report provided or report not found.";
        if (reportPath && fs.existsSync(reportPath)) {
            const reportContent = fs.readFileSync(reportPath, 'utf8');
            // Extract the first few lines of the report for summary
            const lines = reportContent.split('\n').filter(line => line.trim().length > 0);
            summary = lines.slice(0, 10).join('\n');
        }

        let attachments = [];
        if (pdfPath && fs.existsSync(pdfPath)) {
            attachments.push({
                filename: path.basename(pdfPath),
                path: pdfPath
            });
        }

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port || 465,
            secure: smtp.port === 465, // true for 465, false for other ports
            auth: {
                user: smtp.user,
                pass: smtp.app_password.replace(/\s+/g, '') // remove spaces from app password just in case
            }
        });

        const mailOptions = {
            from: `"Career-Ops" <${smtp.user}>`,
            to: smtp.user,
            subject: `Job Application Completed: ${role} at ${company}`,
            text: `You have successfully applied for the ${role} position at ${company}.\n\nResume used: ${(pdfPath ? path.basename(pdfPath) : 'None specified')}\n\nHere is a summary of the evaluation:\n\n${summary}`,
            attachments: attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification email sent: ${info.messageId}`);
    } catch (error) {
        console.error("Failed to send email notification:", error);
    }
}

sendNotification();

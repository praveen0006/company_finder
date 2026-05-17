import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import nodemailer from 'nodemailer';

async function sendNotification() {
    const [, , company, role, reportPath, pdfPath, screenshotPath] = process.argv;

    if (!company || !role) {
        console.error("Usage: node send-notification.mjs <company> <role> [report_path] [pdf_path] [screenshot_path]");
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
        let score = "N/A";
        let archetype = "N/A";
        let legitimacy = "N/A";
        let tldr = "N/A";

        if (reportPath && fs.existsSync(reportPath)) {
            const reportContent = fs.readFileSync(reportPath, 'utf8');
            // Extract the first few lines of the report for summary
            const lines = reportContent.split('\n').filter(line => line.trim().length > 0);
            summary = lines.slice(0, 10).join('\n');

            // Extract Score: Match **Score:** 3.9/5 or Score: 3.9/5
            const scoreMatch = reportContent.match(/\*\*Score:\*\*\s*([^\n\r]+)/i) || reportContent.match(/Score:\s*([^\n\r]+)/i);
            if (scoreMatch) score = scoreMatch[1].trim();

            // Extract Archetype
            const archetypeMatch = reportContent.match(/\*\*Arquetipo:\*\*\s*([^\n\r]+)/i) || reportContent.match(/Arquetipo:\s*([^\n\r]+)/i) || reportContent.match(/\*\*Archetype:\*\*\s*([^\n\r]+)/i) || reportContent.match(/Archetype:\s*([^\n\r]+)/i);
            if (archetypeMatch) archetype = archetypeMatch[1].trim();

            // Extract Legitimacy
            const legitimacyMatch = reportContent.match(/\*\*Legitimacy:\*\*\s*([^\n\r]+)/i) || reportContent.match(/Legitimacy:\s*([^\n\r]+)/i);
            if (legitimacyMatch) legitimacy = legitimacyMatch[1].trim();

            // Extract TL;DR
            const tldrMatch = reportContent.match(/TL;DR\s*\|\s*([^\n\r|]+)/i);
            if (tldrMatch) tldr = tldrMatch[1].trim();
        }

        let attachments = [];
        if (pdfPath && fs.existsSync(pdfPath)) {
            attachments.push({
                filename: path.basename(pdfPath),
                path: pdfPath
            });
        }

        let hasScreenshot = false;
        if (screenshotPath && fs.existsSync(screenshotPath)) {
            attachments.push({
                filename: path.basename(screenshotPath),
                path: screenshotPath,
                cid: 'submission_screenshot'
            });
            hasScreenshot = true;
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

        const scoreBadgeStyle = score.includes('/5') 
            ? `background-color: rgba(108, 99, 255, 0.15); color: #a78bfa; border: 1px solid rgba(108, 99, 255, 0.3);` 
            : `background-color: rgba(226, 232, 240, 0.1); color: #cbd5e1; border: 1px solid rgba(226, 232, 240, 0.2);`;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Application Submitted</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0f; color: #e2e8f0; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #11111b; border: 1px solid #232333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
    
    <!-- Header with Premium Gradient -->
    <div style="background: linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%); padding: 36px 24px; text-align: center;">
      <div style="width: 48px; height: 48px; border-radius: 14px; background: rgba(255, 255, 255, 0.15); display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        🚀
      </div>
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">
        Application Confirmed!
      </h1>
      <p style="margin: 6px 0 0 0; color: #e2e5ff; font-size: 13px; font-weight: 500;">
        Career-Ops Automated Pipeline
      </p>
    </div>

    <!-- Content Area -->
    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 24px 0; font-size: 14px; color: #a0aec0; line-height: 1.5; text-align: center;">
        You have successfully completed your job application for <strong>${company}</strong>. Below are the execution metrics and documents synchronized with your tracking ledger.
      </p>

      <!-- Company & Role Card -->
      <div style="background-color: #161622; border: 1px solid #232333; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="border-bottom: 1px solid #232333; padding-bottom: 12px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #ffffff;">${company}</h3>
          <p style="margin: 0; font-size: 13px; color: #cbd5e1; font-weight: 500;">${role}</p>
        </div>

        <!-- Info Grid -->
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 12px; color: #718096; width: 40%;">Match Score</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #ffffff;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; ${scoreBadgeStyle}">
                ${score}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 12px; color: #718096;">Target Archetype</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #ffffff; word-break: break-word;">${archetype}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 12px; color: #718096;">Posting Legitimacy</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #10d9a0;">${legitimacy}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 12px; color: #718096;">Tailored Resume</td>
            <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #6c63ff; font-family: monospace;">
              ${pdfPath ? path.basename(pdfPath) : 'None specified'}
            </td>
          </tr>
        </table>
      </div>

      <!-- TL;DR / Summary -->
      ${tldr !== "N/A" ? `
      <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #a0aec0;">
        Role Brief (TL;DR)
      </h4>
      <div style="border-left: 4px solid #6c63ff; background-color: #161622; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
        ${tldr}
      </div>
      ` : ''}

      <!-- Evaluation Summary -->
      <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #a0aec0;">
        Evaluation Summary
      </h4>
      <div style="background-color: #161622; border: 1px solid #232333; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; color: #cbd5e1; font-family: monospace; white-space: pre-wrap; margin-bottom: 24px;">
${summary}
      </div>

      <!-- Screenshot Embed -->
      ${hasScreenshot ? `
      <div style="margin-top: 24px; border: 1px solid #232333; border-radius: 12px; overflow: hidden; background: #161622;">
        <div style="padding: 10px 16px; border-bottom: 1px solid #232333; background: #0c0c14; color: #a0aec0; font-size: 12px; font-weight: 600;">
          📸 Submission Confirmation Screenshot
        </div>
        <div style="padding: 12px; text-align: center; background-color: #1a1a27;">
          <img src="cid:submission_screenshot" alt="Submission Screenshot" style="max-width: 100%; height: auto; border-radius: 6px; display: inline-block; border: 1px solid #2c2c3e;" />
        </div>
      </div>
      ` : ''}

    </div>

    <!-- Footer -->
    <div style="background-color: #0c0c14; padding: 24px; text-align: center; border-top: 1px solid #232333; font-size: 11px; color: #718096; line-height: 1.5;">
      <p style="margin: 0 0 6px 0;">This notification was dispatched automatically by your local Career-Ops system.</p>
      <p style="margin: 0;">Open your <a href="http://localhost:5173" style="color: #6c63ff; text-decoration: none; font-weight: 600;">Career Dashboard</a> to view your full portfolio & metrics.</p>
    </div>

  </div>
</body>
</html>
        `;

        const mailOptions = {
            from: `"Career-Ops" <${smtp.user}>`,
            to: smtp.user,
            subject: `Job Application Completed: ${role} at ${company}`,
            text: `You have successfully applied for the ${role} position at ${company}.\n\nResume used: ${(pdfPath ? path.basename(pdfPath) : 'None specified')}\n\nHere is a summary of the evaluation:\n\n${summary}`,
            html: htmlContent,
            attachments: attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification email sent: ${info.messageId}`);
    } catch (error) {
        console.error("Failed to send email notification:", error);
    }
}

sendNotification();


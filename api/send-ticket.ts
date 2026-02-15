import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { subject, priority, description, userEmail, userName } = req.body;

    // Create transporter (USE ENV VARIABLES IN VERCEL)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const adminEmails = [
      'educatelux1@gmail.com',
      'Aadilmax2023@gmail.com',
      'Uvaktrading@gmail.com'
    ];

    const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails.join(','),
      subject: `New Support Ticket: ${ticketId} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; border-radius: 30px 30px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 30px 30px; border: 1px solid #e2e8f0; }
            .ticket-id { font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -0.02em; }
            .label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 4px; }
            .value { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
            .badge-high { background: #f97316; color: white; }
            .badge-urgent { background: #ef4444; color: white; }
            .badge-medium { background: #3b82f6; color: white; }
            .badge-low { background: #94a3b8; color: white; }
            .message-box { background: white; padding: 20px; border-radius: 20px; border: 1px solid #e2e8f0; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="ticket-id">${ticketId}</p>
              <p style="font-size: 14px; opacity: 0.9; margin: 0;">New Support Ticket Received</p>
            </div>
            <div class="content">
              <div style="margin-bottom: 30px;">
                <div class="label">Customer Information</div>
                <div class="value">${userName || 'Not provided'} (${userEmail})</div>
              </div>
              
              <div style="margin-bottom: 30px;">
                <div class="label">Ticket Details</div>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                  <span class="badge badge-${priority?.toLowerCase()}">${priority}</span>
                </div>
              </div>
              
              <div>
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              
              <div>
                <div class="label">Description</div>
                <div class="message-box">
                  ${description?.replace(/\n/g, '<br/>')}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <div style="display: flex; gap: 20px; justify-content: center;">
                  <span style="font-size: 10px; color: #64748b;">
                    Reply to this email to respond to the customer
                  </span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Support System • This is an automated message</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Ticket created and email sent successfully',
      ticketId
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
}

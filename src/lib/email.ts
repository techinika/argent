import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTeamInvitation(
  email: string,
  token: string,
  businessId: string,
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/join?token=${token}&business=${businessId}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Argent <info@techinika.com>",
    to: email,
    subject: "You have been invited to join a business on Argent",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">Argent</h1>
        </div>
        
        <h2 style="color: #18181b; margin-bottom: 20px;">You've been invited!</h2>
        
        <p style="color: #52525b; line-height: 1.6;">
          You've been invited to join a business account on Argent. Argent helps you manage your business finances effectively.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Accept Invitation
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 14px;">
          This invitation expires in 7 days. If you don't want to join, you can safely ignore this email.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7; text-align: center; color: #71717a; font-size: 12px;">
          <p>Argent - Finance Management</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Argent <info@techinika.com>",
    to: email,
    subject: "Reset your Argent password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">Argent</h1>
        </div>
        
        <h2 style="color: #18181b; margin-bottom: 20px;">Reset your password</h2>
        
        <p style="color: #52525b; line-height: 1.6;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 14px;">
          This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  role: "business" | "personal",
) {
  const dashboardUrl =
    role === "business"
      ? `${process.env.NEXT_PUBLIC_APP_URL}/business`
      : `${process.env.NEXT_PUBLIC_APP_URL}/personal`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Argent <info@techinika.com>",
    to: email,
    subject: `Welcome to Argent - Your ${role === "business" ? "Business" : "Personal"} Account`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">Argent</h1>
        </div>
        
        <h2 style="color: #18181b; margin-bottom: 20px;">Welcome, ${name}!</h2>
        
        <p style="color: #52525b; line-height: 1.6;">
          Your Argent ${role === "business" ? "business" : "personal"} account has been created successfully.
          ${role === "business" ? " Start by inviting your team members and setting up your budgets." : " Start by setting your financial goals and tracking expenses."}
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 14px;">
          If you have any questions, reply to this email and we'll help you get started.
        </p>
      </div>
    `,
  });
}

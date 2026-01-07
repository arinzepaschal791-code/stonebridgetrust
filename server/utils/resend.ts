import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        Accept: 'application/json',
        X_REPLIT_TOKEN: xReplitToken
      }
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const verificationUrl = `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/verify-email?token=${token}`;

    await client.emails.send({
      from: fromEmail || 'Stonebridge Trust <noreply@resend.dev>',
      to: email,
      subject: 'Verify Your Stonebridge Trust Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; font-size: 28px; margin: 0;">Stonebridge Trust</h1>
            <p style="color: #b8860b; font-size: 14px; margin: 5px 0;">Your Trusted Banking Partner</p>
          </div>
          
          <h2 style="color: #333;">Welcome, ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for creating an account with Stonebridge Trust. To complete your registration and access all our banking services, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #1a365d; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px;">
            If you didn't create an account with Stonebridge Trust, please ignore this email. This link will expire in 24 hours.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Stonebridge Trust Banking | Secure. Trusted. Reliable.
          </p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

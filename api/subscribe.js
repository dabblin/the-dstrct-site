/**
 * Vercel Serverless Function: VIP Email Subscription Endpoint
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, category, timestamp } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    console.log(`[DSTRCT VIP REGISTRATION] Email: ${email} | Category: ${category || 'General'} | Time: ${timestamp || new Date().toISOString()}`);

    // If an external webhook / email provider is set in environment, forward it
    const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, category, timestamp, site: 'thedstrct.com' })
        });
      } catch (err) {
        console.error('Webhook dispatch failed:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for The DSTRCT & Phat Pink Laces VIP access.',
      email,
      category
    });
  } catch (err) {
    console.error('Subscription handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory user session simulation store
  let sessionUser = {
    name: 'Road of Riot',
    email: 'roadofriot@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTtoQ4n9J10zKEo3WC2ZJVPrPB7tmep72XVG2GepMeywhdEigQ0XaUqQYTdUS3XYHFyz6EOdKETIG2Y7-fWxi1mBU-G8eMgChvsRR6imVX6i1X2rV6EkG8uWBe1PDT4VH1l4wnGFYMqhF_kIGkS5g0JUCigG9XfVcqoXdRaaxnF879u0eqPZHFS_vr8ffuRAWjdiZskg1oLbdwWu4ao64L4aZxgHmxgXmQ0-E7gAmGqrVZSd5wcqPn',
    isLoggedIn: true,
    googleAccountType: 'Google Workspace Pro',
    connectedDrive: true,
    quotaUsedGb: 4.2,
    quotaTotalGb: 100,
    joinedDate: 'Jan 2024',
    subscriptionStatus: 'Pro Member ($19/mo)',
    subscriptionRenews: 'Sept 12, 2026',
    is2FAEnabled: true,
    twoFactorMethod: 'Authenticator App (TOTP)',
    activeSessionsCount: 2,
    organization: 'MindSparQ Security Labs',
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get current user session
  app.get('/api/auth/me', (req, res) => {
    res.json(sessionUser);
  });

  // Update profile information
  app.post('/api/auth/update-profile', (req, res) => {
    const { name, email, avatar, organization } = req.body;
    if (name) sessionUser.name = name;
    if (email) sessionUser.email = email;
    if (avatar) sessionUser.avatar = avatar;
    if (organization) sessionUser.organization = organization;
    res.json({ success: true, user: sessionUser });
  });

  // Toggle 2FA settings
  app.post('/api/auth/toggle-2fa', (req, res) => {
    const { enabled, method } = req.body;
    sessionUser.is2FAEnabled = enabled !== undefined ? enabled : !sessionUser.is2FAEnabled;
    if (method) sessionUser.twoFactorMethod = method;
    res.json({ success: true, is2FAEnabled: sessionUser.is2FAEnabled, twoFactorMethod: sessionUser.twoFactorMethod });
  });

  // Google OAuth URL generation endpoint
  app.get('/api/auth/url', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const redirectUri = `${protocol}://${host}/auth/callback`;

    const clientId = process.env.GOOGLE_CLIENT_ID || '1083921782391-mindsparq.apps.googleusercontent.com';
    const scope = encodeURIComponent('openid profile email https://www.googleapis.com/auth/drive.appdata');
    
    // Construct Google OAuth URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&prompt=consent&access_type=offline`;

    res.json({ url: googleAuthUrl, redirectUri });
  });

  // OAuth Callback Route
  app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
    const { code } = req.query;
    
    // Set user as logged in upon Google authorization code return
    sessionUser.isLoggedIn = true;

    // Send postMessage back to parent window and close popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Authentication Successful</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #1e293b; padding: 2rem; rounded: 1rem; border: 1px solid #334155; }
            .spinner { width: 32px; height: 32px; border: 3px solid #3b82f6; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h3>Google Sign-In Successful!</h3>
            <p>Connecting your Google Workspace account to MindSparQ...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', code: ${JSON.stringify(code || 'mock_code')} }, '*');
              setTimeout(() => { window.close(); }, 800);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // Logout Endpoint
  app.post('/api/auth/logout', (req, res) => {
    sessionUser.isLoggedIn = false;
    res.json({ success: true });
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindSparQ Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

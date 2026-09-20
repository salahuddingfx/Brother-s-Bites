export function renderServerPortalHtml(options: {
  environment: string;
  version: string;
  clientUrl: string;
  uptime: number;
}): string {
  const { environment, version, clientUrl } = options;

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brother's Bites API & Backend Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090b;
      --surface: #121215;
      --surface-border: rgba(255, 255, 255, 0.08);
      --yellow: #F7B928;
      --yellow-glow: rgba(247, 185, 40, 0.25);
      --cream: #FAF5E9;
      --text-muted: rgba(250, 245, 233, 0.6);
      --emerald: #10B981;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--cream);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(247, 185, 40, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(217, 119, 6, 0.06) 0%, transparent 45%),
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
      line-height: 1.5;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 60px;
      width: 100%;
    }
    /* Header */
    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 28px;
      margin-bottom: 32px;
    }
    @media (min-width: 768px) {
      .header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-badge {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      background: linear-gradient(135deg, #F7B928, #D97706);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #09090b;
      font-weight: 900;
      font-size: 22px;
      box-shadow: 0 0 24px var(--yellow-glow);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #fff;
    }
    .brand-title span {
      color: var(--yellow);
    }
    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34D399;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #34D399;
      box-shadow: 0 0 10px #34D399;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    /* Action Bar */
    .action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--yellow);
      color: #09090b;
      border: 1px solid var(--yellow);
      box-shadow: 0 4px 14px var(--yellow-glow);
    }
    .btn-primary:hover {
      background: #eab308;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: var(--surface);
      color: var(--cream);
      border: 1px solid var(--surface-border);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }
    /* Meta Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: var(--text-muted);
    }
    .stat-value {
      font-size: 18px;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      color: #fff;
    }
    .stat-value.highlight {
      color: var(--yellow);
    }
    /* Section Titles */
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #fff;
    }
    /* Endpoints Grid */
    .endpoints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }
    .endpoint-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s ease;
    }
    .endpoint-card:hover {
      border-color: rgba(247, 185, 40, 0.4);
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-2px);
    }
    .ep-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge-method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(247, 185, 40, 0.15);
      color: var(--yellow);
      border: 1px solid rgba(247, 185, 40, 0.3);
    }
    .ep-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      word-break: break-all;
    }
    .ep-desc {
      font-size: 12px;
      color: var(--text-muted);
    }
    /* Raw JSON container */
    .json-panel {
      background: #000;
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 16px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #38BDF8;
      overflow-x: auto;
      max-height: 240px;
    }
    /* Footer */
    .footer {
      margin-top: auto;
      border-top: 1px solid var(--surface-border);
      padding: 24px 0;
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer a {
      color: var(--yellow);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="brand-wrap">
        <div class="logo-badge">BB</div>
        <div>
          <h1 class="brand-title">Brother's <span>Bites</span></h1>
          <p class="brand-subtitle">Core API Gateway & Digital Business Server · v${version}</p>
        </div>
      </div>
      <div class="status-pill">
        <span class="pulse-dot"></span>
        Systems Operational
      </div>
    </header>

    <!-- Fast Action Buttons -->
    <div class="action-bar">
      <a href="${clientUrl}" target="_blank" class="btn btn-primary">
        🌐 Open Public Website
      </a>
      <a href="${clientUrl}/admin/dashboard" target="_blank" class="btn btn-secondary">
        🛡️ Admin Control Center
      </a>
      <a href="${clientUrl}/admin/analytics" target="_blank" class="btn btn-secondary">
        📊 Visitor Analytics
      </a>
      <a href="/api/health" class="btn btn-secondary">
        🩺 Health Probe
      </a>
      <a href="/api-docs" class="btn btn-secondary">
        📚 API Docs (JSON)
      </a>
    </div>

    <!-- Server Specs & Runtime Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Server Port</span>
        <span class="stat-value highlight">:5000</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Environment</span>
        <span class="stat-value">${environment.toUpperCase()}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Database</span>
        <span class="stat-value" style="color: #34D399;">MongoDB Atlas</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Location Node</span>
        <span class="stat-value">Marine Drive, Cox's Bazar</span>
      </div>
    </div>

    <!-- API Routes Directory -->
    <div class="section-head">
      <h2 class="section-title">🚀 Core API Endpoints (v1)</h2>
      <span style="font-size: 12px; color: var(--text-muted);">Base Path: <code>/api/v1</code></span>
    </div>

    <div class="endpoints-grid">
      <a href="/api/v1/menu" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">🍔 Menu</span>
        </div>
        <div class="ep-path">/api/v1/menu</div>
        <div class="ep-desc">Food catalog, pricing, categories, and specials filter.</div>
      </a>

      <a href="/api/v1/categories" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">📁 Categories</span>
        </div>
        <div class="ep-path">/api/v1/categories</div>
        <div class="ep-desc">Food and beverage category classifications.</div>
      </a>

      <a href="/api/v1/offers" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">🏷️ Deals</span>
        </div>
        <div class="ep-path">/api/v1/offers</div>
        <div class="ep-desc">Special promotional offers and discount vouchers.</div>
      </a>

      <a href="/api/v1/gallery" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">📸 Gallery</span>
        </div>
        <div class="ep-path">/api/v1/gallery</div>
        <div class="ep-desc">Restaurant scenery, food photos, and chef showcase.</div>
      </a>

      <a href="/api/v1/settings" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / PATCH</span>
          <span style="font-size: 11px; color: var(--yellow);">⚙️ Settings</span>
        </div>
        <div class="ep-path">/api/v1/settings</div>
        <div class="ep-desc">Hero banner, opening hours, business details, and contact.</div>
      </a>

      <a href="/api/v1/reviews" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">⭐ Reviews</span>
        </div>
        <div class="ep-path">/api/v1/reviews</div>
        <div class="ep-desc">Customer ratings, feedback testimonials, and approval states.</div>
      </a>

      <a href="/api/v1/orders" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">🛍️ Orders</span>
        </div>
        <div class="ep-path">/api/v1/orders</div>
        <div class="ep-desc">Online checkout orders, kitchen tracking, and receipts.</div>
      </a>

      <a href="/api/v1/auth/me" target="_blank" class="endpoint-card">
        <div class="ep-top">
          <span class="badge-method">GET / POST</span>
          <span style="font-size: 11px; color: var(--yellow);">🔒 Auth</span>
        </div>
        <div class="ep-path">/api/v1/auth</div>
        <div class="ep-desc">JWT authentication, login sessions, and role permissions.</div>
      </a>
    </div>

    <!-- Raw JSON Fallback Preview -->
    <div class="section-head" style="margin-top: 10px;">
      <h2 class="section-title">📦 Raw Service Payload</h2>
      <a href="/?format=json" style="font-size: 12px; color: var(--yellow); text-decoration: none;">View Pure JSON →</a>
    </div>
    <pre class="json-panel">{
  "status": "running",
  "name": "Brother's Bites Digital Business Portal",
  "version": "${version}",
  "environment": "${environment}",
  "database": "connected (MongoDB)",
  "gateway": "Express / TypeScript REST API"
}</pre>

    <!-- Footer -->
    <footer class="footer">
      Brother's Bites — Sonar Para Beach, Marine Drive, Cox's Bazar · Crafted for Excellence
    </footer>
  </div>
</body>
</html>`;
}

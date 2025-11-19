import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db/index";
import { testing } from "./db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for the client bundle with proper content type headers
app.use("/static", express.static(path.join(__dirname, "../../dist/client"), {
  setHeaders: (res: express.Response, path: string) => {
    // Set appropriate content type based on file extension
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        res.setHeader('Content-Type', 'application/javascript');
        break;
      case 'css':
        res.setHeader('Content-Type', 'text/css');
        break;
      case 'html':
        res.setHeader('Content-Type', 'text/html');
        break;
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        break;
      case 'png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case 'jpg':
      case 'jpeg':
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      case 'gif':
        res.setHeader('Content-Type', 'image/gif');
        break;
      case 'svg':
        res.setHeader('Content-Type', 'image/svg+xml');
        break;
      case 'ico':
        res.setHeader('Content-Type', 'image/x-icon');
        break;
      case 'woff':
        res.setHeader('Content-Type', 'font/woff');
        break;
      case 'woff2':
        res.setHeader('Content-Type', 'font/woff2');
        break;
      case 'ttf':
        res.setHeader('Content-Type', 'font/ttf');
        break;
      case 'eot':
        res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
        break;
      case 'map':
        res.setHeader('Content-Type', 'application/json');
        break;
      default:
        // For unknown extensions, let Express try to infer
        break;
    }
  }
}));

// API Routes
app.get("/api/hello", async (req, res) => {
  try {
    // Create a new record in the testing table
    const result = await db.insert(testing).values({
      created_at: new Date().toISOString()
    }).returning();

    res.json({
      message: "Hello from Express API!",
      newRecord: result[0]
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({
      message: "Error creating record",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get("/api/testing", async (req, res) => {
  try {
    const records = await db.select().from(testing);
    res.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      message: "Error fetching records",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint to verify build artifacts are ready
app.get("/api/health/build", async (req, res) => {
  try {
    const ready = await checkBuildArtifacts();
    
    if (ready) {
      res.json({
        ready: true,
        message: "Build artifacts are ready"
      });
    } else {
      res.status(503).json({
        ready: false,
        message: "Build artifacts not ready"
      });
    }
  } catch (error) {
    console.error('Error checking build health:', error);
    res.status(500).json({
      ready: false,
      message: "Error checking build status",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced build readiness check function
async function checkBuildArtifacts(): Promise<boolean> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const distPath = path.join(__dirname, "../../dist/client");
    const bundleJsPath = path.join(distPath, "bundle.js");
    const bundleCssPath = path.join(distPath, "bundle.css");
    
    // Check if both bundle files exist
    if (!fs.existsSync(bundleJsPath) || !fs.existsSync(bundleCssPath)) {
      console.log('Build artifacts missing:', {
        jsExists: fs.existsSync(bundleJsPath),
        cssExists: fs.existsSync(bundleCssPath)
      });
      return false;
    }
    
    const jsStats = fs.statSync(bundleJsPath);
    const cssStats = fs.statSync(bundleCssPath);
    const now = Date.now();
    
    // 1. Check file sizes - must be substantial (not empty or tiny)
    const minJsSize = 1000; // At least 1KB for JS bundle
    const minCssSize = 100;  // At least 100 bytes for CSS
    
    if (jsStats.size < minJsSize || cssStats.size < minCssSize) {
      console.log('Build artifacts too small:', {
        jsSize: jsStats.size,
        cssSize: cssStats.size,
        minJsSize,
        minCssSize
      });
      return false;
    }
    
    // 2. Check if files are still being written (modified very recently)
    const veryRecentThreshold = 2000; // 2 seconds ago
    const jsVeryRecent = (now - jsStats.mtime.getTime()) < veryRecentThreshold;
    const cssVeryRecent = (now - cssStats.mtime.getTime()) < veryRecentThreshold;
    
    if (jsVeryRecent || cssVeryRecent) {
      console.log('Build artifacts still being written:', {
        jsAge: now - jsStats.mtime.getTime(),
        cssAge: now - cssStats.mtime.getTime(),
        threshold: veryRecentThreshold
      });
      return false;
    }
    
    // 3. Removed stale timestamp check - was causing issues with long-running sandboxes
    // All file changes trigger blocking builds via verifyBuildArtifacts() anyway
    // Other checks (existence, size, content, stability) provide sufficient protection
    
    // 4. Read file contents to ensure they're valid
    try {
      const jsContent = fs.readFileSync(bundleJsPath, 'utf8');
      const cssContent = fs.readFileSync(bundleCssPath, 'utf8');
      
      // Check JS content has basic bundle structure
      const hasValidJs = jsContent.includes('export') || 
                        jsContent.includes('import') || 
                        jsContent.includes('module') ||
                        jsContent.includes('function') ||
                        jsContent.includes('const ') ||
                        jsContent.includes('var ') ||
                        jsContent.includes('let ');
      
      // Check CSS content has basic CSS structure
      const hasValidCss = cssContent.includes('{') && 
                         cssContent.includes('}') &&
                         (cssContent.includes(':') || cssContent.length > 50);
      
      if (!hasValidJs) {
        console.log('JS bundle appears invalid or empty:', {
          length: jsContent.length,
          preview: jsContent.substring(0, 100)
        });
        return false;
      }
      
      if (!hasValidCss) {
        console.log('CSS bundle appears invalid or empty:', {
          length: cssContent.length,
          preview: cssContent.substring(0, 100)
        });
        return false;
      }
      
      // 5. Additional stability check - wait a bit and verify files haven't changed
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
      
      const jsStatsAfter = fs.statSync(bundleJsPath);
      const cssStatsAfter = fs.statSync(bundleCssPath);
      
      // If modification times changed during our check, files are still being written
      if (jsStats.mtime.getTime() !== jsStatsAfter.mtime.getTime() ||
          cssStats.mtime.getTime() !== cssStatsAfter.mtime.getTime()) {
        console.log('Build artifacts changed during check - still building');
        return false;
      }
      
      console.log('Build artifacts verified as ready:', {
        jsSize: jsStats.size,
        cssSize: cssStats.size,
        jsAge: now - jsStats.mtime.getTime(),
        cssAge: now - cssStats.mtime.getTime()
      });
      
      return true;
      
    } catch (readError) {
      console.log('Error reading build artifacts:', readError);
      return false;
    }
    
  } catch (error) {
    console.error('Error checking build artifacts:', error);
    return false;
  }
}

// Loading screen HTML template with hybrid refresh mechanism
const generateLoadingScreen = (baseUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preparing your prototype...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: white;
      color: #333;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .animated-logo {
      margin: 0 auto 1.5rem;
      fill: #374151;
    }
    @keyframes logoFadeIn1 {
      0% { opacity: 0; }
      12% { opacity: 1; }
      60% { opacity: 1; }
      75% { opacity: 0; }
      100% { opacity: 0; }
    }
    @keyframes logoFadeIn2 {
      0% { opacity: 0; }
      12% { opacity: 1; }
      60% { opacity: 1; }
      68% { opacity: 0; }
      100% { opacity: 0; }
    }
    @keyframes logoFadeIn3 {
      0% { opacity: 0; }
      12% { opacity: 1; }
      60% { opacity: 1; }
      70% { opacity: 0; }
      100% { opacity: 0; }
    }
    @keyframes logoFadeIn4 {
      0% { opacity: 0; }
      12% { opacity: 1; }
      60% { opacity: 1; }
      65% { opacity: 0; }
      100% { opacity: 0; }
    }
    .logo-part-1 {
      opacity: 0;
      animation: logoFadeIn1 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 0s;
    }
    .logo-part-2 {
      opacity: 0;
      animation: logoFadeIn2 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 0.25s;
    }
    .logo-part-3 {
      opacity: 0;
      animation: logoFadeIn3 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 0.12s;
    }
    .logo-part-4 {
      opacity: 0;
      animation: logoFadeIn4 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 0.38s;
    }
    p {
      margin: 0;
      font-size: 1rem;
      color: #666;
    }
    .status {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #999;
    }
  </style>
  <script>
    // Listen for parent window messages (existing mechanism)
    window.addEventListener('message', function(event) {
      if (event.data.type === 'sandbox-ready') {
        window.location.reload();
      }
    });
    
    // Health check polling as backup
    let pollCount = 0;
    const maxPolls = 30; // 1 minute max
    
    async function pollHealth() {
      pollCount++;
      try {
        const response = await fetch('${baseUrl}api/health/build');
        const data = await response.json();
        if (data.ready) {
          document.getElementById('status').textContent = 'Build complete! Loading...';
          window.location.reload();
          return;
        }
        
        // Update status with more detail
        document.getElementById('status').textContent = 
          \`Verifying build artifacts... (\${pollCount}/\${maxPolls})\`;
          
      } catch (error) {
        document.getElementById('status').textContent = 
          \`Connecting to build server... (\${pollCount}/\${maxPolls})\`;
      }
      
      if (pollCount < maxPolls) {
        setTimeout(pollHealth, 2000); // Check every 2 seconds
      } else {
        document.getElementById('status').textContent = 
          'Build verification taking longer than expected. Please refresh manually.';
      }
    }
    
    // Start polling after 5 seconds (give message system time)
    setTimeout(() => {
      document.getElementById('status').textContent = 'Checking build status...';
      pollHealth();
    }, 5000);
  </script>
</head>
<body>
  <div class="container">
    <svg
      class="animated-logo"
      width="60"
      height="45"
      viewBox="0 0 65 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Reforge Animated Logo</title>
      <defs>
        <clipPath id="clip0_660_7505_animated">
          <rect width="64.5" height="48" fill="white" />
        </clipPath>
      </defs>
      <g clip-path="url(#clip0_660_7505_animated)">
        <!-- Top Left - fades in first -->
        <path
          class="logo-part-1"
          d="M9.85933 0.447913C9.67874 0.372142 9.72326 0.106525 9.91897 0.0957008C14.6757 -0.18074 19.466 0.172305 22.3017 0.790134C27.3364 1.8884 31.8697 3.8543 34.9935 8.65705C36.3349 10.7195 37.3101 12.9935 37.6184 15.3299C37.6386 15.4806 37.5218 15.6147 37.3689 15.6147H20.3538C20.2203 15.6147 20.1119 15.5123 20.1027 15.3807C19.7406 9.91769 16.784 3.34222 9.85933 0.447913Z"
        />
        <!-- Bottom Right - fades in second -->
        <path
          class="logo-part-2"
          d="M54.3473 47.552C54.5279 47.6278 54.4833 47.8934 54.2876 47.9043C49.5309 48.1807 44.7406 47.8277 41.9049 47.2098C36.8702 46.1116 32.3369 44.1457 29.2131 39.3429C27.8717 37.2804 26.8965 35.0064 26.5882 32.67C26.568 32.5193 26.6848 32.3853 26.8377 32.3853H43.8536C43.9872 32.3853 44.0955 32.4877 44.1048 32.6192C44.4668 38.0823 47.4235 44.6577 54.3473 47.552Z"
        />
        <!-- Top Right - fades in third -->
        <path
          class="logo-part-3"
          d="M45.2513 30.779C45.1438 30.9289 45.2992 31.1245 45.4706 31.0554C49.5679 29.3909 67.4045 20.9312 63.7574 9.4389C60.5504 -0.570435 43.5084 -0.150778 39.5774 0.0831978C39.3825 0.0948549 39.338 0.358806 39.5186 0.434578C46.5533 3.36802 49.4973 10.0959 49.7863 15.5722C49.9954 19.5382 48.9631 25.6057 45.2522 30.779H45.2513Z"
        />
        <!-- Bottom Left - fades in fourth -->
        <path
          class="logo-part-4"
          d="M18.994 17.2209C19.1015 17.0711 18.9461 16.8754 18.7748 16.9445C14.6774 18.6098 -3.15833 27.0687 0.488783 38.561C3.69576 48.5704 20.7369 48.1507 24.6679 47.9159C24.8636 47.9042 24.9073 47.6394 24.7267 47.5645C17.6929 44.6311 14.7488 37.9032 14.4599 32.4277C14.2507 28.4618 15.283 22.3942 18.994 17.2209V17.2209Z"
        />
      </g>
    </svg>
    <p>Preparing your prototype...</p>
    <div id="status" class="status">Building assets...</div>
  </div>
</body>
</html>
`;

// Generate full app HTML with FOUC prevention
const generateFullAppHTML = (baseUrl: string) => {
  // Try to inline CSS for FOUC prevention
  let cssContent = '';
  try {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, "../../dist/client/bundle.css");
    if (fs.existsSync(cssPath)) {
      cssContent = fs.readFileSync(cssPath, 'utf8');
    }
  } catch (error) {
    console.log('Could not read CSS for inlining:', error);
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Full-Stack App</title>
  <script>
    window.baseUrl = '${baseUrl}';
  </script>
  <style>
    #root {
      min-height: 100vh;
    }

    [data-node-id] {
      position: relative;
      transition: all 0.2s ease-in-out;
    }

    [data-node-id].protoforge-hover {
      outline: 2px dashed #60a5fa !important;
      outline-offset: 1px;
      cursor: crosshair;
    }

    .comment-mode [data-node-id].protoforge-hover {
      outline: 2px dashed #f59e0b !important;
      outline-offset: 1px;
      cursor: pointer;
    }

    [data-node-id].protoforge-selected {
      outline: 2px dashed #1d4ed8 !important;
      outline-offset: 1px;
      position: relative;
    }

    [data-node-id].protoforge-selected::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 1px dashed #1d4ed8;
      pointer-events: none;
      z-index: 1;
    }

    [data-node-id].protoforge-hover::before {
      position: absolute;
      top: -24px;
      left: 0;
      background: rgba(96, 165, 250, 0.9);
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-family: monospace;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .comment-mode [data-node-id].protoforge-hover::before {
      content: attr(data-node-id) ' - Click to comment';
      background: rgba(245, 158, 11, 0.9);
    }

    /* Interactive border styling for elements with comments when comment mode is active - removed blue border */
    [data-node-id].protoforge-comment-border {
      cursor: pointer;
    }

    /* Highlight for currently targeted comment - higher specificity to override other styles */
    [data-node-id].protoforge-comment-highlight,
    [data-node-id].protoforge-has-comments.protoforge-comment-highlight {
      outline: 3px solid #8b5cf6 !important;
      outline-offset: 3px !important;
      background-color: rgba(139, 92, 246, 0.15) !important;
      animation: commentHighlightPulse 2s ease-in-out infinite !important;
      box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.25) !important;
      z-index: 9999 !important;
      position: relative !important;
    }

    @keyframes commentHighlightPulse {
      0%, 100% {
        outline-color: #8b5cf6;
        background-color: rgba(139, 92, 246, 0.08);
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
      }
      50% {
        outline-color: #7c3aed;
        background-color: rgba(139, 92, 246, 0.12);
        box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.2);
      }
    }

    /* Persistent styling for elements with comments - shows badge always */
    [data-node-id].protoforge-has-comments {
      position: relative !important;
    }

    /* Comment badge - only visible in comment mode */
    .comment-mode [data-node-id].protoforge-has-comments::after {
      content: attr(data-comment-count);
      position: absolute;
      top: -10px;
      right: -10px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      line-height: 1;
    }

    /* Tooltip on hover - only in comment mode */
    .comment-mode [data-node-id].protoforge-has-comments::before {
      content: attr(data-comment-tooltip);
      position: absolute;
      top: -24px;
      left: 0;
      background: rgba(59, 130, 246, 0.9);
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-family: monospace;
      white-space: nowrap;
      z-index: 10001;
      pointer-events: none;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    /* Show tooltip on hover - only in comment mode */
    .comment-mode [data-node-id].protoforge-has-comments:hover::before {
      opacity: 1;
    }

    /* Multi-selection indicator */
    [data-node-id].protoforge-selected:first-of-type::before {
      position: absolute;
      top: -24px;
      left: 0;
      background: rgba(29, 78, 216, 0.9);
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-family: monospace;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
  ${cssContent ? `<style id="inlined-css">\n${cssContent}\n</style>` : `<link rel="stylesheet" href="${baseUrl}static/bundle.css">`}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${baseUrl}static/bundle.js"></script>
</body>
</html>
  `;
};

// Unified route handler - checks build readiness and serves appropriate content
app.get("*", async (req, res) => {
  const baseUrl = (typeof req.query.baseUrl === 'string' ? req.query.baseUrl : null) || `https://${req.get('host')}/`;
  
  // Check if build artifacts are ready
  const buildReady = await checkBuildArtifacts();
  
  if (!buildReady) {
    // Serve loading screen if build not ready
    console.log('Build artifacts not ready, serving loading screen');
    return res.type("text/html").send(generateLoadingScreen(baseUrl));
  }
  
  // Serve full app if build is ready
  console.log('Build artifacts ready, serving full app');
  const fullAppHTML = generateFullAppHTML(baseUrl);
  res.type("text/html").send(fullAppHTML);
});

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📱 Frontend available at http://localhost:${port}`);
  console.log(`🔌 API available at http://localhost:${port}/api`);
});

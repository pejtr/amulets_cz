import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Redirect old e-shop URLs to ohorai.cz (301 for SEO - from GSC 404 errors)
  const redirectToOhoraiPatterns = [
    // Product pages
    '/product/*',
    '/product-category/*',
    '/product-tag/*',
    // Shop pages
    '/shop',
    '/shop/*',
    // Blog pages
    '/blog',
    '/blog/*',
    '/blog-2',
    '/blog-2/*',
    '/uncategorized/*',
    // Contact pages
    '/contact',
    '/contact/*',
    '/contact-2',
    '/contact-2/*',
    '/contact-3',
    '/contact-3/*',
    // Layout/template pages
    '/brand/*',
    '/2-columns',
    '/2-columns/*',
    '/3-columns',
    '/3-columns/*',
    '/3-columns-2',
    '/3-columns-2/*',
    '/page',
    '/page/*',
    '/page-2',
    '/page-2/*',
    // WordPress/PHP pages
    '/index.php/*',
    '/wpcontent_category/*',
    // Specific old product URLs from GSC
    '/aroma-nahrdelnik-love-ruzenin',
    '/aroma-nahrdelnik-love-ruzenin/*',
    '/aroma-nahrdelnik-love-ruzerin',
    '/aroma-nahrdelnik-love-ruzerin/*',
  ];
  
  redirectToOhoraiPatterns.forEach(pattern => {
    app.get(pattern, (_req, res) => {
      res.redirect(301, 'https://www.ohorai.cz/');
    });
  });

  // Redirect old/removed pages to homepage (301 for SEO)
  const redirectToHomepagePatterns = [
    '/darujte-lasku',
    '/kameny-podle-znameni-zverokruhu',
    '/kameny-podle-znameni-zverokruhu/*',
  ];
  
  redirectToHomepagePatterns.forEach(pattern => {
    app.get(pattern, (_req, res) => {
      res.redirect(301, '/');
    });
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

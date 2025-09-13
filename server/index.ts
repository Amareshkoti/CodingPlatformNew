import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware for API routes
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined;

    const originalResJson = res.json.bind(res);
    res.json = (bodyJson: any, ...args: any[]) => {
        capturedJsonResponse = bodyJson;
        return originalResJson(bodyJson, ...args);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            log(logLine);
        }
    });

    next();
});

(async () => {
    // Validate API key at startup
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("❌ OPENROUTER_API_KEY is not configured");
        console.error("Please set the OpenRouter API key for both Normal and Advanced modes");
        console.error("Normal mode: NVIDIA Nemotron Nano 9B V2");
        console.error("Advanced mode: DeepSeek R1 (with reasoning)");
        process.exit(1);
    }

    console.log("✅ API key validated successfully");
    console.log("📍 Normal mode: NVIDIA Nemotron Nano 9B V2");
    console.log("🧠 Advanced mode: DeepSeek R1 (with reasoning)");

    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error("Unhandled error:", err);
    });

    // Setup Vite only in development
    if (app.get("env") === "development") {
        await setupVite(app, server);
    } else {
        serveStatic(app);
    }

    // Always use PORT from env (default 5000)
    const port = parseInt(process.env.PORT || "5000", 10);
    const host = "0.0.0.0";

    // ✅ Fix: removed `reusePort: true` (not supported on Windows)
    server.listen(port, host, () => {
        log(`🚀 Server running on http://${host}:${port}`);
    });
})();

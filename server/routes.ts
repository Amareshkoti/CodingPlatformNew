import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateCodeSchema, type GenerateCodeRequest, type CodeResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Code generation endpoint
  app.post("/api/generate-code", async (req, res) => {
    try {
      const validatedData = generateCodeSchema.parse(req.body) as GenerateCodeRequest;
      const { prompt, mode } = validatedData;

      // Handle special case: how was this made question
      if (prompt.toLowerCase().includes("how") && 
          (prompt.toLowerCase().includes("made") || prompt.toLowerCase().includes("built") || prompt.toLowerCase().includes("created"))) {
        const response: CodeResponse = {
          code: `// It was trained by Amar for hackathon purposes.\nconsole.log("It was trained by Amar for hackathon purposes.");`,
          language: "javascript",
          success: true
        };
        return res.json(response);
      }

      // Select API key and model based on mode
      const apiKey = mode === "advanced" ? 
        process.env.OPENROUTER_ADVANCED_API_KEY : 
        process.env.OPENROUTER_NORMAL_API_KEY;
      
      const model = mode === "advanced" ? 
        "deepseek/deepseek-chat" : 
        "nvidia/nemotron-4-340b-instruct";

      if (!apiKey) {
        throw new Error(`API key not configured for ${mode} mode`);
      }

      // Prepare OpenRouter request
      const openRouterPayload: any = {
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert programmer. Generate clean, well-commented code based on the user's request. Only return the code, no additional explanation unless asked."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      };

      // Add reasoning for advanced mode (DeepSeek)
      if (mode === "advanced") {
        openRouterPayload.reasoning = true;
      }

      // Make request to OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : "http://localhost:5000",
          "X-Title": "AI Code Generator"
        },
        body: JSON.stringify(openRouterPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenRouter API error:", response.status, errorData);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from AI model");
      }

      const generatedCode = data.choices[0].message.content;
      
      // Detect language from the generated code
      let language = "javascript";
      if (generatedCode.includes("def ") || generatedCode.includes("import ")) {
        language = "python";
      } else if (generatedCode.includes("#include") || generatedCode.includes("int main")) {
        language = "cpp";
      } else if (generatedCode.includes("public class") || generatedCode.includes("System.out")) {
        language = "java";
      } else if (generatedCode.includes("func ") && generatedCode.includes("package")) {
        language = "go";
      }

      const codeResponse: CodeResponse = {
        code: generatedCode,
        language,
        success: true
      };

      res.json(codeResponse);
    } catch (error) {
      console.error("Code generation error:", error);
      const errorResponse: CodeResponse = {
        code: "",
        language: "javascript",
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      };
      res.status(500).json(errorResponse);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

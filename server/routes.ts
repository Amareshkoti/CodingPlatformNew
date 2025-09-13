import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateCodeSchema, type GenerateCodeRequest, type CodeResponse } from "@shared/schema";

// Function to extract clean code from AI response
function extractCleanCode(rawResponse: string): string {
  if (!rawResponse) return "";
  
  // Remove leading/trailing whitespace
  let cleaned = rawResponse.trim();
  
  // Extract code from markdown code blocks (```language or ```)
  const codeBlockRegex = /```(?:\w+)?\s*\n?([\s\S]*?)\n?```/g;
  const match = codeBlockRegex.exec(cleaned);
  
  if (match && match[1]) {
    // Found code block, extract the code inside
    cleaned = match[1].trim();
  } else {
    // No code blocks found, check if it starts with explanation text
    // Remove common explanation patterns that the model might add
    cleaned = cleaned
      .replace(/^.*?Here'?s.*?code.*?:?\s*/im, '') // "Here's the code:"
      .replace(/^.*?This is.*?code.*?:?\s*/im, '') // "This is the code:"
      .replace(/^.*?Below is.*?code.*?:?\s*/im, '') // "Below is the code:"
      .replace(/^.*?The code is.*?:?\s*/im, '') // "The code is:"
      .replace(/^.*?Solution.*?:?\s*/im, '') // "Solution:"
      .trim();
  }
  
  // Remove leading/trailing newlines and whitespace
  return cleaned;
}

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
        "deepseek/deepseek-r1" : 
        "nvidia/nemotron-nano-9b-v2";

      if (!apiKey) {
        throw new Error(`API key not configured for ${mode} mode`);
      }

      // Prepare OpenRouter request
      const openRouterPayload: any = {
        model,
        messages: [],
        max_tokens: 200,
        temperature: mode === "advanced" ? 0.6 : 0.1  // DeepSeek R1 performs better at 0.6, NVIDIA at 0.1
      };

      // Configure messages based on model type
      if (mode === "advanced") {
        // DeepSeek R1 - no system prompt recommended, all instructions in user prompt
        openRouterPayload.messages = [
          {
            role: "user",
            content: `You are an expert programmer. Generate clean, well-commented code based on the user's request. Only return the code, no additional explanation unless asked.

User request: ${prompt}`
          }
        ];
      } else {
        // NVIDIA Nemotron Nano 9B V2 - uses traditional system/user prompt structure
        openRouterPayload.messages = [
          {
            role: "system",
            content: "You are an expert programmer. Generate ONLY executable code. Do not include any explanations, reasoning, commentary, or markdown formatting. Return just the raw code that can be run directly."
          },
          {
            role: "user",
            content: `${prompt}\n\nIMPORTANT: Return ONLY the executable code. No explanations, no comments, no markdown code blocks, no reasoning. Just the raw code.`
          }
        ];
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
        console.error("Request payload was:", JSON.stringify(openRouterPayload, null, 2));
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("OpenRouter response data:", JSON.stringify(data, null, 2));
      
      if (!data.choices || data.choices.length === 0) {
        console.error("No choices in response:", data);
        throw new Error("No response from AI model");
      }

      let generatedCode = data.choices[0].message.content;
      
      // For Normal mode, only use content field and extract clean code
      if (mode === "normal") {
        // Don't use reasoning field for normal mode as it contains explanations
        if (!generatedCode) {
          throw new Error("No code generated in normal mode");
        }
        // Extract code from markdown code blocks if present
        generatedCode = extractCleanCode(generatedCode);
      } else {
        // For Advanced mode, use reasoning field as fallback if content is empty
        if (!generatedCode && data.choices[0].message.reasoning) {
          console.log("Content empty, using reasoning field from Advanced model");
          generatedCode = data.choices[0].message.reasoning;
        }
      }
      
      console.log("Generated code length:", generatedCode ? generatedCode.length : 0);
      console.log("Generated code preview:", generatedCode ? generatedCode.substring(0, 100) + "..." : "EMPTY");
      
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

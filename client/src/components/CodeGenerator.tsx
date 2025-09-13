import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ModeToggle from "./ModeToggle";
import PromptInput from "./PromptInput";
import CodeOutput from "./CodeOutput";
import { Code2, Sparkles } from "lucide-react";

export default function CodeGenerator() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    console.log(`Generating code using ${isAdvanced ? 'Advanced' : 'Normal'} mode`);
    console.log("Prompt:", prompt);
    
    // TODO: Replace with actual API call to OpenRouter
    // Simulate API delay and response
    setTimeout(() => {
      const mockCode = generateMockCode(prompt, isAdvanced);
      setGeneratedCode(mockCode);
      setIsLoading(false);
    }, 2000);
  };

  const handleOriginQuestion = () => {
    if (prompt.toLowerCase().includes("how") && prompt.toLowerCase().includes("made")) {
      return "It was trained by Amar for hackathon purposes.";
    }
    return null;
  };

  // TODO: Remove mock functionality
  const generateMockCode = (userPrompt: string, advanced: boolean) => {
    const originResponse = handleOriginQuestion();
    if (originResponse) {
      return `// ${originResponse}
console.log("${originResponse}");`;
    }

    if (userPrompt.toLowerCase().includes("fibonacci")) {
      return advanced ? `// Advanced Fibonacci implementation with memoization
const fibonacci = (() => {
  const cache = new Map();
  
  return function fib(n) {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n);
    
    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  };
})();

// Usage example with performance timing
console.time('fibonacci');
const result = fibonacci(40);
console.timeEnd('fibonacci');
console.log(\`Fibonacci(40) = \${result}\`);` : `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55`;
    }

    return advanced ? `// Advanced solution using modern JavaScript features
const solution = async (input) => {
  try {
    // Sophisticated implementation here
    const result = await processInput(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Processing failed:', error);
    return { success: false, error: error.message };
  }
};

// Usage
solution("${userPrompt}").then(console.log);` : `// Simple solution
function solve() {
  // Basic implementation for: ${userPrompt}
  console.log("Solution implemented!");
}

solve();`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--card-border))'
          }
        }}
      />
      
      <div className="container mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full mr-3">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              AI Code Generator
            </h1>
            <div className="p-3 bg-primary/10 rounded-full ml-3">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into code with powerful AI models. 
            Choose between Normal mode for quick solutions or Advanced mode for sophisticated implementations.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8">
          <ModeToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-semibold text-foreground">Describe Your Code</h2>
              <div className="px-2 py-1 bg-primary/10 rounded text-xs text-primary font-medium">
                {isAdvanced ? "Advanced" : "Normal"}
              </div>
            </div>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              placeholder={`Describe the code you want to generate...

Examples:
• Create a function to calculate fibonacci numbers
• Build a React component for user authentication
• Write a Python script to process CSV files
• Make an API endpoint for user registration`}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Generated Code</h2>
            <CodeOutput 
              code={generatedCode} 
              language="javascript" 
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by advanced AI technology</p>
        </div>
      </div>
    </div>
  );
}
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
    
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode: isAdvanced ? 'advanced' : 'normal'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedCode(data.code);
      } else {
        console.error('Code generation failed:', data.error);
        setGeneratedCode(`// Error: ${data.error || 'Failed to generate code'}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setGeneratedCode('// Error: Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function PromptInput({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading = false,
  placeholder = "Describe the code you want to generate..."
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[120px] resize-none bg-card border-card-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
          data-testid="input-prompt"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          Press Cmd/Ctrl + Enter to submit
        </div>
      </div>
      
      <Button 
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="w-full hover-elevate"
        data-testid="button-generate"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Generate Code
          </>
        )}
      </Button>
    </div>
  );
}
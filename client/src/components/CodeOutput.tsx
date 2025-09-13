import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "./CopyButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeOutputProps {
  code: string;
  language?: string;
  isLoading?: boolean;
}

export default function CodeOutput({ code, language = "javascript", isLoading = false }: CodeOutputProps) {
  if (isLoading) {
    return (
      <div className="relative bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse space-y-2 w-full">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="relative bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <div className="text-center">
            <div className="text-lg mb-2">🚀</div>
            <div>Generated code will appear here</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-card rounded-lg border border-card-border overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-card-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-sm text-muted-foreground font-mono">{language}</span>
        </div>
        <CopyButton text={code} />
      </div>
      
      <ScrollArea className="max-h-96">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          className="!bg-transparent !p-4"
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, Fira Code, monospace'
          }}
          data-testid="code-output"
        >
          {code}
        </SyntaxHighlighter>
      </ScrollArea>
    </div>
  );
}
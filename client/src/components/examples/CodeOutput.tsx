import { useState } from "react";
import CodeOutput from "../CodeOutput";
import { Button } from "@/components/ui/button";

export default function CodeOutputExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const sampleCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 fibonacci numbers
const sequence = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log("Fibonacci sequence:", sequence);

// More efficient iterative version
function fibonacciIterative(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`;

  const toggleDemo = () => {
    if (code) {
      setCode("");
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCode(sampleCode);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={toggleDemo} variant="outline">
        {code ? "Clear Output" : "Show Demo Code"}
      </Button>
      <CodeOutput code={code} language="javascript" isLoading={isLoading} />
    </div>
  );
}
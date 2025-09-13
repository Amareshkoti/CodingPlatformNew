import { useState } from "react";
import PromptInput from "../PromptInput";

export default function PromptInputExample() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    console.log("Generating code for:", prompt);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <PromptInput
      value={prompt}
      onChange={setPrompt}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
import CopyButton from "../CopyButton";

export default function CopyButtonExample() {
  const sampleCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border border-card-border">
      <span className="text-sm text-muted-foreground">Click to copy sample code:</span>
      <CopyButton text={sampleCode} />
    </div>
  );
}
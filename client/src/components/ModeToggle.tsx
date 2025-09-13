import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, Brain } from "lucide-react";

interface ModeToggleProps {
  isAdvanced: boolean;
  onToggle: (advanced: boolean) => void;
}

export default function ModeToggle({ isAdvanced, onToggle }: ModeToggleProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-card-border">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Zap className="h-4 w-4" />
        <Label className="text-sm font-medium">Normal Mode</Label>
      </div>
      
      <Switch
        checked={isAdvanced}
        onCheckedChange={onToggle}
        data-testid="toggle-mode"
        className="data-[state=checked]:bg-primary"
      />
      
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Brain className="h-4 w-4" />
        <Label className="text-sm font-medium">Advanced Mode</Label>
      </div>
      
    </div>
  );
}
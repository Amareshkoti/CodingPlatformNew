import { useState } from "react";
import ModeToggle from "../ModeToggle";

export default function ModeToggleExample() {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <ModeToggle 
      isAdvanced={isAdvanced} 
      onToggle={(advanced) => {
        setIsAdvanced(advanced);
        console.log(`Mode changed to: ${advanced ? 'Advanced' : 'Normal'}`);
      }} 
    />
  );
}